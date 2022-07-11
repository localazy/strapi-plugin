import React from "react";
import { Flex } from '@strapi/design-system/Flex';
import { Loader } from "@strapi/design-system/Loader";
import { useTranslation } from "react-i18next";

import "../../../../i18n";

function PluginPageLoader() {
  const { t } = useTranslation();

  return (
    <Flex
      marginTop={10}
      alignItems="center"
      justifyContent="center"
    >
      <Loader>{t("common.loading_content")}</Loader>
    </Flex>
  )
}

export default PluginPageLoader;
