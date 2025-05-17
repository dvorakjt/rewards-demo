import { NavigationLink } from '../navigation-link';
import partnersIcon from '/src/assets/icons/partners-icon.png';
import partnersIconActive from '/src/assets/icons/partners-icon-active.png';
import rewardsIcon from '/src/assets/icons/rewards-icon.png';
import rewardsIconActive from '/src/assets/icons/rewards-icon-active.png';
import serverIcon from '/src/assets/icons/server-icon.png';
import serverIconActive from '/src/assets/icons/server-icon-active.png';
import recycleIcon from '/src/assets/icons/recycle-icon.png';
import recycleIconActive from '/src/assets/icons/recycle-icon-active.png';
import styles from './styles.module.scss';

export function NavigationMenu() {
  return (
    <nav className={styles.nav}>
      <menu className={styles.menu}>
        <NavigationLink
          to="/partners"
          destinationName="Partners"
          iconSrc={partnersIcon}
          activeStateIconSrc={partnersIconActive}
        />
        <NavigationLink
          to="/rewards"
          destinationName="Rewards"
          iconSrc={rewardsIcon}
          activeStateIconSrc={rewardsIconActive}
        />
        <NavigationLink
          to="/server"
          destinationName="Server"
          iconSrc={serverIcon}
          activeStateIconSrc={serverIconActive}
        />
        <NavigationLink
          to="/recycle"
          destinationName="Recycle"
          iconSrc={recycleIcon}
          activeStateIconSrc={recycleIconActive}
        />
      </menu>
    </nav>
  );
}
