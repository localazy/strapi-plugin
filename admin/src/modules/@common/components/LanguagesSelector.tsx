// TODO: ADD TYPES

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash-es/cloneDeep';
import { Field, MultiSelect, MultiSelectOption } from '@strapi/design-system';
interface LanguageSelectorProps {
  label: string;
  hint: string;
  placeholder: string;
  projectLanguages: any[];
  preselectedLanguages: any[];
  onChange: (values: any) => void;
}

const LanguagesSelector: React.FC<LanguageSelectorProps> = (props: LanguageSelectorProps) => {
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
  };

  useEffect(() => {
    const existingPreselectedLanguages = props.projectLanguages
      .filter((lang: any) => props.preselectedLanguages.includes(lang.code))
      .map((lang: any) => lang.code);

    setSelectedLanguages(existingPreselectedLanguages);
  }, [props.projectLanguages, props.preselectedLanguages]);

  return (
    <Field.Root hint={props.hint || t('common.select_languages')}>
      <Field.Label>{props.label || t('common.select_languages')}</Field.Label>
      <MultiSelect
        clearLabel={t('plugin_settings.clear')}
        placeholder={props.placeholder || t('common.select_languages')}
        onClear={() => setSelectedLanguages([])}
        value={selectedLanguages || []}
        onChange={(values: any) => onChange(values)}
        multi
        withTags
      >
        {props.projectLanguages.map((lang: any) => (
          <MultiSelectOption key={lang.id} value={lang.code}>
            {`${lang.name} (${lang.code})`}
          </MultiSelectOption>
        ))}
      </MultiSelect>
      <Field.Hint />
    </Field.Root>
  );
};

export { LanguagesSelector };
