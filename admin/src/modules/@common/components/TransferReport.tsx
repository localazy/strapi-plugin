import React, { useState, useEffect } from 'react';
import { Alert, Box, Typography } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';

type ReportItem = string | { message: string; links?: { strapi?: string; localazy?: string } };

const TransferReportItem: React.FC<{ item: ReportItem }> = ({ item }) => {
  if (typeof item === 'string') {
    return <>{item}</>;
  }

  const { message, links } = item;

  return (
    <>
      <Typography variant='omega'>{message}</Typography>
      {links && (
        <Box paddingTop={2}>
          {links.strapi && (
            <Typography variant='pi'>
              <a href={links.strapi} target='_blank' rel='noopener noreferrer' style={{ marginRight: '12px' }}>
                Open in Strapi
              </a>
            </Typography>
          )}
          {links.localazy && (
            <Typography variant='pi'>
              <a href={links.localazy} target='_blank' rel='noopener noreferrer'>
                View in Localazy
              </a>
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};

const TransferReport: React.FC<{ report: ReportItem[] }> = (props) => {
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
    const hasLinks = typeof item !== 'string' && item.links;
    return (
      <Box key={index} marginTop={4} marginBottom={4}>
        <Alert
          key={index}
          onClose={() => onCloseItem(index)}
          closeLabel={t('upload.close')}
          variant={hasLinks ? 'danger' : 'default'}
        >
          <TransferReportItem item={item} />
        </Alert>
      </Box>
    );
  });
};

export { TransferReport };
