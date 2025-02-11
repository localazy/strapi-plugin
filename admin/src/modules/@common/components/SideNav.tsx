import { SubNav, SubNavHeader, SubNavSection, SubNavSections, SubNavLink } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import useNav, { NavItem } from '../utils/use-nav';
import { NavLink } from 'react-router-dom';

const SideNav = () => {
  const { t } = useTranslation();

  const navigation = useNav();

  const isActive = (navItem: NavItem) => {
    // url contains to
    return location.pathname.includes(navItem.to);
  };

  return (
    <SubNav aria-label={t('common.localazy_plugin')}>
      <SubNavHeader label={t('common.localazy_plugin')} />
      <SubNavSections>
        <SubNavSection label={t('common.navigation')}>
          {navigation.map((navItem) => (
            <SubNavLink tag={NavLink} to={navItem.to} active={isActive(navItem)} icon={navItem.icon} key={navItem.id}>
              {navItem.label}
            </SubNavLink>
          ))}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
};

export default SideNav;
