CREATE EXTENSION postgis;
/*
  btree_gist allows values typically indexed with B-trees such as text, dates, 
  integers, etc. to be included in a GIST index, allowing for fast querying by 
  both coordinates column of the locations table and the partner_id column.
*/
CREATE EXTENSION btree_gist;

CREATE TYPE redemption_forum AS ENUM (
  'online',
  'in-store'
);

CREATE TYPE coordinates_and_distance AS (
  coordinates geography(Point, 4326),
  distance DOUBLE PRECISION
);

CREATE TYPE redemption_forum_filter AS ENUM (
  'all',
  'online',
  'in-store',
  'both'
);

CREATE TYPE cursor_position AS (
  partner_name VARCHAR(255),
  reward_id UUID
);

CREATE TYPE sort_order AS ENUM (
  'a-z',
  'z-a'
);

CREATE TYPE reward_with_partner_data AS (
  id UUID, 
  short_description VARCHAR(255),
  redemption_forums redemption_forum[],
  long_description TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  partner_id VARCHAR(255),
  partner_name VARCHAR(255),
  partner_description TEXT,
  partner_website VARCHAR(255),
  partner_why8by8 TEXT
);

CREATE TABLE partners (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(255),
  why8by8 TEXT,
  hash TEXT NOT NULL
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(255) NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  coordinates geography(Point, 4326) NOT NULL
);

/* 
  The order matters here. Including partner_id first greatly improves 
  performance.
*/
CREATE INDEX locations_index ON locations 
USING GIST (partner_id, coordinates);

CREATE TABLE rewards (
  id UUID PRIMARY KEY,
  partner_id VARCHAR(255) NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  short_description VARCHAR(255) NOT NULL,
  redemption_forums redemption_forum[] NOT NULL,
  long_description TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  hash TEXT NOT NULL
);

CREATE TABLE contextualized_rewards (
  id UUID PRIMARY KEY,
  short_description VARCHAR(255) NOT NULL,
  redemption_forums redemption_forum[] NOT NULL,
  long_description TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  partner_id VARCHAR(255) NOT NULL,
  partner_name VARCHAR(255) NOT NULL,
  partner_description TEXT NOT NULL,
  partner_website VARCHAR(255),
  partner_why8by8 TEXT,
  nearest_location_coordinates TEXT,
  distance_to_nearest_location DOUBLE PRECISION
);

CREATE FUNCTION find_nearest_location_and_distance(
  user_coordinates geography(Point, 4326),
  partner_id VARCHAR(255)
) RETURNS coordinates_and_distance AS $$
DECLARE
  approx_nearest_location geography(Point, 4326);
  distance_to_approx_nearest_location DOUBLE PRECISION;
  actual_nearest_location_and_distance coordinates_and_distance;
BEGIN
  SELECT coordinates INTO approx_nearest_location
  FROM locations
  WHERE locations.partner_id = find_nearest_location_and_distance.partner_id
  ORDER BY coordinates <-> user_coordinates
  LIMIT 1;

  /*
    Spheroidal calculations will be used because both points are geography 
    types--this flag is set to TRUE just to be explicit about this.
  */
  distance_to_approx_nearest_location := ST_Distance(
    approx_nearest_location,
	  user_coordinates,
	  TRUE
  );

  SELECT coordinates, ST_Distance(
    coordinates,
	  user_coordinates,
	  TRUE
  ) AS distance
  INTO actual_nearest_location_and_distance
  FROM locations
  WHERE ST_DWithin(
    coordinates,
	  user_coordinates,
	  distance_to_approx_nearest_location
  ) AND locations.partner_id = find_nearest_location_and_distance.partner_id
  ORDER BY distance
  LIMIT 1;

  IF 
    actual_nearest_location_and_distance.coordinates IS NULL OR
    actual_nearest_location_and_distance.distance IS NULL
  THEN
    actual_nearest_location_and_distance.coordinates := approx_nearest_location;
    actual_nearest_location_and_distance.distance := distance_to_approx_nearest_location;
  END IF;

  return actual_nearest_location_and_distance; 
END; 
$$ LANGUAGE plpgsql STRICT STABLE;

CREATE FUNCTION get_contextualized_rewards (
  redemption_forum_filter redemption_forum_filter,
  cursor_position cursor_position,
  sort_order sort_order,
  longitude DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  max_distance DOUBLE PRECISION,
  ignore_max_distance_for_online_rewards BOOLEAN,
  max_num_results INTEGER
) 
RETURNS SETOF contextualized_rewards
AS $$
DECLARE
  reward_count INTEGER := 0;
  reward reward_with_partner_data;
  current_cursor_position cursor_position := cursor_position;
  user_coordinates geography(Point, 4326) := ST_SetSRID(
	ST_MakePoint(
	  longitude, latitude
	), 4326
  )::geography;
  nearest_location_and_distance coordinates_and_distance;
BEGIN
  CREATE TEMP TABLE temp_contextualized_rewards (LIKE contextualized_rewards) ON COMMIT DROP;

  WHILE
    CASE
	  WHEN max_num_results IS NOT NULL THEN reward_count < max_num_results 
	  ELSE TRUE
	END
	LOOP
  /*
    First, query for one reward that meets less computationally intensive 
    criteria (all criteria except proximity to the user).
  */
	SELECT
	  r.id as id,
	  r.short_description as short_description,
	  r.redemption_forums as redemption_forums,
	  r.long_description as long_description,
	  r.expiration_date as expiration_date,
	  p.id as partner_id,
	  p.name as partner_name,
	  p.description as partner_description,
	  p.website as partner_website,
	  p.why8by8 as why8by8
	INTO reward
	FROM rewards AS r
	INNER JOIN partners AS p ON r.partner_id = p.id
	WHERE 
      CASE
        WHEN redemption_forum_filter = 'all' THEN TRUE
        WHEN redemption_forum_filter = 'online' THEN 'online' = ANY(r.redemption_forums)
        WHEN redemption_forum_filter = 'in-store' THEN 'in-store' = ANY(r.redemption_forums)
        WHEN redemption_forum_filter = 'both' THEN 'online' = ANY(r.redemption_forums) AND 'in-store' = ANY(r.redemption_forums)
        ELSE TRUE
	  END
    AND
      CASE
        WHEN current_cursor_position IS NOT NULL THEN 
          CASE
            WHEN sort_order = 'a-z' THEN 
			  p.name > current_cursor_position.partner_name 
			  OR (
			    p.name = current_cursor_position.partner_name 
				AND r.id > current_cursor_position.reward_id
			  )
            ELSE 
			  p.name < current_cursor_position.partner_name 
			  OR (
			    p.name = current_cursor_position.partner_name 
			    AND 
				r.id < current_cursor_position.reward_id
			  )
	      END
        ELSE TRUE
	  END
    AND (r.expiration_date IS NULL OR r.expiration_date > NOW())
    ORDER BY 
      CASE WHEN sort_order = 'a-z' THEN p.name END ASC,
	  CASE WHEN sort_order = 'z-a' THEN p.name END DESC,
	  CASE WHEN sort_order = 'a-z' THEN r.id END ASC,
	  CASE WHEN sort_order = 'z-a' THEN r.id END DESC
    LIMIT 1;  

    -- Exit the loop if no more rewards are found.
	EXIT WHEN reward IS NULL;
	
	/*
    Find the nearest location and distance to that location. If the distance 
    is less than max_distance, the nearest_location_and_distance is null 
    (meaning the user did not provide their location or the partner 
    does not have any locations), or the reward is redeemable online and
    ignore_max_distance_for_online_rewards is true, add the reward to the 
    table of rewards that will be returned by this function.
  */
	SELECT coordinates, distance
	INTO nearest_location_and_distance
	FROM find_nearest_location_and_distance(
      user_coordinates,
	  reward.partner_id
	);
	
	IF nearest_location_and_distance.distance <= max_distance 
	OR (
      ignore_max_distance_for_online_rewards
	  AND 
	  'online' = ANY(reward.redemption_forums)
	)
	OR nearest_location_and_distance IS NULL
	THEN
	  INSERT INTO temp_contextualized_rewards (
         id,
         short_description,
         redemption_forums,
         long_description,
         expiration_date,
         partner_id,
         partner_name,
         partner_description,
         partner_website,
         partner_why8by8,
         nearest_location_coordinates,
         distance_to_nearest_location
	  ) VALUES (
         reward.id,
         reward.short_description,
         reward.redemption_forums,
         reward.long_description,
         reward.expiration_date,
         reward.partner_id,
         reward.partner_name,
         reward.partner_description,
         reward.partner_website,
        reward.partner_why8by8,
        ST_AsText(nearest_location_and_distance.coordinates),
		    nearest_location_and_distance.distance
	  );
	  
	  reward_count := reward_count + 1;
	END IF;

	current_cursor_position := (reward.partner_name, reward.id);
  END LOOP;
  RETURN QUERY
    SELECT * FROM temp_contextualized_rewards
    ORDER BY 
    CASE WHEN sort_order = 'a-z' THEN partner_name END ASC,
	  CASE WHEN sort_order = 'z-a' THEN partner_name END DESC,
	  CASE WHEN sort_order = 'a-z' THEN id END ASC,
	  CASE WHEN sort_order = 'z-a' THEN id END DESC;
END;
$$ LANGUAGE plpgsql;

/*
  Creates a random geographic coordinate. Can be used to test the database.
*/
CREATE FUNCTION gen_random_point()
RETURNS geography(Point, 4326) AS $$
BEGIN
  RETURN ST_SetSRID(
    ST_MakePoint(
      (random()*360.0) - 180.0,
      (acos(1.0 - 2.0 * random()) * 2.0 - pi()) * 90.0 / pi()
    ), 4326)::geography;
END;
$$ LANGUAGE plpgsql;