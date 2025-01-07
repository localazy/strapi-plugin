import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
} from "@strapi/design-system";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import getNav from "../utils/get-nav";

const SideNav = () => {
  const { t } = useTranslation();

  const navigation = getNav();

  return (
    <SubNav ariaLabel={t("common.localazy_plugin")}>
      <SubNavHeader label={t("common.localazy_plugin")} />
      <SubNavSections>
        <SubNavSection label={t("common.navigation")}>
          {navigation.map((navItem) => (
            <>
              {/* <House /> */}
              <SubNavLink
                as={NavLink}
              to={navItem.to}
              active={navItem.active}
              icon={navItem.icon}
              key={navItem.id}
            >
              {navItem.label}
            </SubNavLink>
            </>
          ))}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
}

export default SideNav;
