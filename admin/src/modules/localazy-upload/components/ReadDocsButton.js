import React from "react";
import { Button } from "@strapi/design-system/Button";
import { useTranslation } from "react-i18next";
import "../../../i18n";

function ReadDocsButton() {
  const { t } = useTranslation();

  const link = "https://localazy.com/docs/strapi";
  const onReadDocumentationClick = () => {
    window.open(link, "_blank");
  };

  return (
    <Button variant="tertiary" onClick={onReadDocumentationClick}>
      {t("upload.read_documentation")}
    </Button>
  );
}

export default ReadDocsButton;
