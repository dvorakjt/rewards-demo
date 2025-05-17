import { NavLink } from 'react-router';
import styles from './styles.module.scss';

interface NavigationLinkProps {
  to: string;
  destinationName: string;
  iconSrc: string;
  activeStateIconSrc: string;
}

export function NavigationLink({
  iconSrc,
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
      <img src={iconSrc} alt={iconAltText} className={styles.icon} />
      <img
        src={activeStateIconSrc}
        alt={iconAltText}
        className={styles.active_icon}
      />
    </NavLink>
  );
}
