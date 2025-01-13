import { useTranslation, Trans } from "react-i18next";
import styled from 'styled-components';
import { Typography, Flex } from "@strapi/design-system";

const CustomBullet = styled.div`
  width: ${4 / 16}rem;
  height: ${4 / 16}rem;
  margin-right: ${12 / 16}rem;
  background-color: ${({ theme }) => theme.colors.neutral600};
  border-radius: 50%;
`;

function ContentTransferSetupEmpty() {
  const { t } = useTranslation();

  return (
    <div>
      <Typography
        textColor="neutral600"
        variant="beta"
      >
        {t("plugin_settings.there_is_nothing_to_transfer")}
      </Typography>
      <br />
      <br />
      <Typography
        textColor="neutral600"
        variant="omega"
      >
        {t("plugin_settings.please_check_that_you_have_entered_a_valid_collection")}
      </Typography>
      <br />
      <Flex marginTop={1} alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_1" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex marginTop={1} alignItems="center">
        <CustomBullet />

        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_2" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex marginTop={1} alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_3" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex marginTop={1} alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_4" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
      <Flex marginTop={1} alignItems="center">
        <CustomBullet />
        <Typography
          textColor="neutral600"
          variant="omega"
        >
          <Trans i18nKey="plugin_settings.step_5" components={{ 1: <Typography variant="omega" fontWeight="semiBold" /> }} />
        </Typography>
      </Flex>
    </div >
  );
}

export { ContentTransferSetupEmpty };
