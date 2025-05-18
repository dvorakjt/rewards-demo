import { NavLink } from 'react-router';
import styles from './styles.module.scss';

interface NavigationLinkProps {
  /**
   * The path that the component will link to.
   */
  to: string;
  /**
   * The name of the page that the component will link to, e.g. "Rewards".
   * It will be displayed to the user when the link is active, or in a hover or
   * focus state.
   */
  destinationName: string;
  /**
   * The src for the image of the icon to be displayed to the user when the
   * link is inactive and not in a hover or focus state.
   */
  inactiveStateIconSrc: string;
  /**
   * The src for the image of the icon to be displayed to the user when the
   * link is active or in a hover or focus state.
   */
  activeStateIconSrc: string;
}

/**
 * A link that displays an icon and the name of the page it links to, for use
 * in the main navigation menu.
 *
 * @param props {@link NavigationLinkProps}
 */
export function NavigationLink({
  inactiveStateIconSrc,
  activeStateIconSrc,
  destinationName,
  to
}: NavigationLinkProps) {
  const iconAltText = `Go to ${destinationName}`;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return isActive ? styles.active_link : styles.link;
      }}
    >
      <img
        src={inactiveStateIconSrc}
        alt={iconAltText}
        className={styles.icon}
      />
      <img
        src={activeStateIconSrc}
        alt={iconAltText}
        className={styles.active_icon}
      />
      <span className={styles.destination_name}>{destinationName}</span>
    </NavLink>
  );
}
