import React from "react";
import { Checkbox } from '@strapi/design-system';

interface TreeItemProps {
  label?: string;
  value?: any;
  children?: any;
  passedKey: string;
  onTreeItemClick: (key: any, currentValue: any) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  label,
  value,
  children,
  passedKey = "",
  onTreeItemClick,
}) => {
  const onChange = (key: any, currentValue: any) => {
    onTreeItemClick(key, currentValue);
  };

  return (
    <>
      {typeof value === "boolean" && (
        <Checkbox
          checked={value}
          onCheckedChange={() => onChange([passedKey], value)}
        >
          {label || "-"}
        </Checkbox>
      )}
      {value === null && (
        <Checkbox
          checked={false}
          disabled
        >
          {label || "-"}
        </Checkbox>
      )}
      {children && <div key={passedKey}>{children}</div>}
    </>
  );
}

export { TreeItem };
