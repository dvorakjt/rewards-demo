-- Add the SRID for latitude and longitude to the coordinates column of partner_locations --
ALTER TABLE partner_locations
  ALTER COLUMN coordinates
  TYPE geometry(point, 4326)
  USING ST_SetSRID(coordinates, 4326)