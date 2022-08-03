import React from "react";
import { useTranslation, Trans } from "react-i18next";
import styled from 'styled-components';
import { Typography, Flex } from "@strapi/design-system";
import Dot from '@strapi/icons/Dot';

const CustomBullet = styled(Dot)`
  width: ${12 / 16}rem;
  height: ${4 / 16}rem;
  margin-right: ${4 / 16}rem;
  * {
    fill: ${({ theme, $active }) => ($active ? theme.colors.primary600 : theme.colors.neutral600)};
  }
`;

function ContentTransferSetupEmpty() {
  const { t } = useTranslation();

  return (
    <div>
      <Typography
        textColor="neutral600"
        variant="beta"
      >
        {t("plugin_settings.there_are_no_collections_connected")}
      </Typography>
      <br />
      <br />
      <Typography
        textColor="neutral600"
        variant="omega"
      >
        {t("plugin_settings.please_check_that_you_have_entered_a_valid_collection")}
      </Typography>
      <br /><br />
      <Flex alignItems="center">
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          {t("plugin_settings.please_enable_localization_for_the_collection_you_want_to_translate")}
        </Typography>
      </Flex>
      <Flex alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_1" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex alignItems="center">
        <CustomBullet />

        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_2" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_3" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
    </div >
  );
}

export default ContentTransferSetupEmpty;
