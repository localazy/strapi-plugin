import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash-es/cloneDeep";
import { Select, Option } from '@strapi/design-system/Select';

import "../../../../i18n";

function LanguagesSelector(props) {
  /**
   * Translation function
   */
  const { t } = useTranslation();

  /**
   * Selected languages
   */
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const onChange = (values) => {
    setSelectedLanguages(values);
    props.onChange(cloneDeep(values));
  }

  useEffect(() => {
    const existingPreselectedLanguages =
      props.projectLanguages
        .filter(lang => props.preselectedLanguages.includes(lang.code))
        .map(lang => lang.code);

    setSelectedLanguages(existingPreselectedLanguages);
  }, [props.projectLanguages, props.preselectedLanguages]);

  return (
    <Select
      label={t("plugin_settings.webhook_languages")}
      hint={t("plugin_settings.webhook_languages_info")}
      clearLabel={t("plugin_settings.clear")}
      placeholder={t("plugin_settings.webhook_languages_placeholder")}
      onClear={() => setSelectedLanguages([])}
      value={selectedLanguages || []}
      onChange={(values) => onChange(values)}
      multi
      withTags
    >
      {props.projectLanguages.map(lang => (
        <Option
          key={lang.id}
          value={lang.code}
        >
          {`${lang.name} (${lang.code})`}
        </Option>
      ))}
    </Select>
  );
}

LanguagesSelector.propTypes = {
  projectLanguages: PropTypes.array.isRequired,
  preselectedLanguages: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LanguagesSelector;
