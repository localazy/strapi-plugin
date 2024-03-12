import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Alert } from "@strapi/design-system/Alert";
import { useTranslation } from "react-i18next";
import { Box } from "@strapi/design-system/Box";

function TransferReport(props) {
  const { t } = useTranslation();

  const [reportLocal, setReportLocal] = useState(props.report);

  const onCloseItem = (index) => {
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

  return (
    reportLocal.map((item, index) => {
      return (
        <Box
          // eslint-disable-next-line react/no-array-index-key
          key={item}
          marginTop={4}
          marginBottom={4}
        >
          <Alert
            key={item}
            onClose={() => onCloseItem(index)}
            closeLabel={t("upload.close")}
            variant="default"
          >
            {item}
          </Alert>
        </Box>)
    })
  );
}

TransferReport.propTypes = {
  report: PropTypes.array.isRequired,
};

export default TransferReport;
