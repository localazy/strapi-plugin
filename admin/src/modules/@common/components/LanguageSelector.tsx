// TODO: ADD TYPES

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash-es/cloneDeep";
import { Select, Option } from '@strapi/design-system/Select';

interface LanguageSelectorProps {
  label: string;
  hint: string;
  placeholder: string;
  projectLanguages: any[];
  preselectedLanguages: any[];
  onChange: (values: any) => void;
}

const LanguagesSelector = (props: LanguageSelectorProps) => {
  /**
   * Translation function
   */
  const { t } = useTranslation();

  /**
   * Selected languages
   */
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);

  const onChange = (values: any) => {
    setSelectedLanguages(values);
    props.onChange(cloneDeep(values));
  }

  useEffect(() => {
    const existingPreselectedLanguages =
      props.projectLanguages
        .filter((lang: any) => props.preselectedLanguages.includes(lang.code))
        .map((lang: any) => lang.code);

    setSelectedLanguages(existingPreselectedLanguages);
  }, [props.projectLanguages, props.preselectedLanguages]);

  return (
    <Select
      label={props.label || t("common.select_languages")}
      hint={props.hint || t("common.select_languages")}
      clearLabel={t("plugin_settings.clear")}
      placeholder={props.placeholder || t("common.select_languages")}
      onClear={() => setSelectedLanguages([])}
      value={selectedLanguages || []}
      onChange={(values: any) => onChange(values)}
      multi
      withTags
    >
      {props.projectLanguages.map((lang: any) => (
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
  label: PropTypes.string,
  hint: PropTypes.string,
  placeholder: PropTypes.string,
  projectLanguages: PropTypes.array.isRequired,
  preselectedLanguages: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};


export default LanguagesSelector;
