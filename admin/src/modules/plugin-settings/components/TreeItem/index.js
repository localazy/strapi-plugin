import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from '@strapi/design-system/Checkbox';

function TreeItem(props) {
  const onChange = (key, currentValue) => {
    props.onTreeItemClick(key, currentValue);
  };

  return (
    <>
      {typeof props.value === "boolean" && (
        <Checkbox
          checked={props.value}
          onChange={() => onChange([props.passedKey], props.value)}
        >
          {props.label || "-"}
        </Checkbox>
      )}
      {props.value === null && (
        <Checkbox
          checked={false}
          disabled
        >
          {props.label || "-"}
        </Checkbox>
      )}
      {props.children && <div key={props.passedKey}>{props.children}</div>}
    </>
  );
}

TreeItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  children: PropTypes.any,
  passedKey: PropTypes.string,
  onTreeItemClick: PropTypes.func.isRequired,
};

TreeItem.defaultProps = {
  label: undefined,
  value: undefined,
  children: undefined,
  passedKey: "",
};

export default TreeItem;
