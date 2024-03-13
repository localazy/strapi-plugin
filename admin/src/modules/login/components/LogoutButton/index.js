/*
 *
 * LogoutButton
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@strapi/design-system/Button";
import { useTranslation } from "react-i18next";
import Exit from "@strapi/icons/Exit";
import LocalazyUserService from "../../../user/services/localazy-user-service";
import { setLocalazyIdentity } from "../../../../state/localazy-identity";

function LogoutButton(props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const logout = async () => {
    setIsLoading(true);

    // delete identity from db
    // delete identity from app state
    LocalazyUserService.deleteIdentity();
    setLocalazyIdentity();

    setIsLoading(false);

    props.onResultFetched();
  };

  return (
    <div>
      <Button
        startIcon={<Exit />}
        variant="secondary"
        loading={isLoading}
        onClick={logout}
      >
        {t("login.logout_from_localazy")}
      </Button>
    </div>
  );
}

LogoutButton.propTypes = {
  onResultFetched: PropTypes.func.isRequired,
};

export default LogoutButton;
