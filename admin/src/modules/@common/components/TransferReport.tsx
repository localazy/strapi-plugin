import React, { useState, useEffect } from 'react';
import { Alert, Box } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';

const TransferReport: React.FC<{ report: any[] }> = (props) => {
  const { t } = useTranslation();

  const [reportLocal, setReportLocal] = useState(props.report);

  const onCloseItem = (index: number) => {
    const newReportLocal = reportLocal;
    newReportLocal.splice(index, 1);

    setReportLocal([...newReportLocal]);
  };

  useEffect(() => {
    setReportLocal(props.report);
  }, [props.report]);

  if (!reportLocal) {
    return null;
  }

  return reportLocal.map((item, index) => {
    return (
      <Box key={index} marginTop={4} marginBottom={4}>
        <Alert key={index} onClose={() => onCloseItem(index)} closeLabel={t('upload.close')} variant='default'>
          {item}
        </Alert>
      </Box>
    );
  });
};

export { TransferReport };
