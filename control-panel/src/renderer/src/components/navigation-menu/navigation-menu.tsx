import { NavigationLink } from '../navigation-link';
import eightBy8Logo from '/src/assets/icons/8by8-logo.png';
import partnersIconInactive from '/src/assets/icons/partners-icon-inactive.png';
import partnersIconActive from '/src/assets/icons/partners-icon-active.png';
import rewardsIconInactive from '/src/assets/icons/rewards-icon-inactive.png';
import rewardsIconActive from '/src/assets/icons/rewards-icon-active.png';
import serverIconInactive from '/src/assets/icons/server-icon-inactive.png';
import serverIconActive from '/src/assets/icons/server-icon-active.png';
import recycleIconInactive from '/src/assets/icons/recycle-icon-inactive.png';
import recycleIconActive from '/src/assets/icons/recycle-icon-active.png';
import styles from './styles.module.scss';

/**
 * The main navigation menu for the application.
 */
export function NavigationMenu() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo_container}>
        <img src={eightBy8Logo} className={styles.logo} />
        <h2 className={styles.logo_caption}>
          Rewards System
          <br />
          Control Panel
        </h2>
      </div>
      <menu className={styles.menu}>
        <NavigationLink
          to="/partners"
          destinationName="Partners"
          inactiveStateIconSrc={partnersIconInactive}
          activeStateIconSrc={partnersIconActive}
        />
        <NavigationLink
          to="/rewards"
          destinationName="Rewards"
          inactiveStateIconSrc={rewardsIconInactive}
          activeStateIconSrc={rewardsIconActive}
        />
        <NavigationLink
          to="/server"
          destinationName="Server"
          inactiveStateIconSrc={serverIconInactive}
          activeStateIconSrc={serverIconActive}
        />
        <NavigationLink
          to="/recycle"
          destinationName="Recycle"
          inactiveStateIconSrc={recycleIconInactive}
          activeStateIconSrc={recycleIconActive}
        />
      </menu>
    </nav>
  );
}
