import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Switch } from '@strapi/design-system/Switch';
import { Checkbox } from '@strapi/design-system/Checkbox';
import DynamicZone from '@strapi/icons/DynamicZone';
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion';
import TreeItem from "../TreeItem";
import flattenObject from "../../../@common/utils/functions/flatten-deep";

function Tree(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const onTreeItemClick = (key, currentValue) => {
    props.onTreeItemClick(key, currentValue);
  };

  useEffect(() => {
    setIsExpanded(props.initiallyExpanded);
  }, [props.initiallyExpanded]);

  const createTree = (name, branch, path = "") => {
    const isBranchObject = typeof branch === "object" && branch !== null;

    if (isBranchObject) {
      return (
        <>
          {Object.entries(branch).map(([key, value]) => {
            const isSubbranchObject = typeof value === "object" && value !== null;
            let flattened = flattenObject(value)
            flattened = Object.fromEntries(Object.entries(flattened).filter(([key]) => !key.includes("__component__")));
            const flattenedKeys = Object.keys(flattened).map((k) => `${path}.${key}.${k}`);

            // debugger;
            const hasTruthyValue = Object
              .values(flattened)
              .some(v => v);
            const hasFalsyValue = Object
              .values(flattened)
              .some(v => !v && v !== null);
            const hasAllNullValue = Object
              .values(flattened)
              .every(v => v === null);

            const RESERVED_KEYS_TO_SKIP = ["__model__", "__component__"];

            if (RESERVED_KEYS_TO_SKIP.includes(key)) {
              return false;
            }
            const passedKey = `${path}.${key}`;

            return (
              <Box
                key={passedKey}
                marginTop={6}
                marginBottom={6}
                marginLeft={6}
              >
                {isSubbranchObject && (
                  <Checkbox
                    disabled={hasAllNullValue}
                    checked={hasTruthyValue && !hasFalsyValue}
                    indeterminate={hasTruthyValue && hasFalsyValue}
                    onChange={() => onTreeItemClick(flattenedKeys, hasTruthyValue && !hasFalsyValue)}
                  >
                    <Flex alignItems="center">
                      {!!value?.__component__ && (<Flex alignItems="center" marginRight={2}><DynamicZone width="1rem" height="1rem" /></Flex>)}
                      {value?.__component__ || key || "-"}
                    </Flex>
                  </Checkbox>)
                }
                <TreeItem
                  onTreeItemClick={onTreeItemClick}
                  passedKey={passedKey}
                >
                  {createTree(key, value, passedKey)}
                </TreeItem>
              </Box>
            );
          })}
        </>
      );
    }

    return (
      <TreeItem
        onTreeItemClick={onTreeItemClick}
        key={path}
        passedKey={path}
        label={name}
        value={branch}
      />
    );
  };

  return (
    <Box>
      {Object.entries(props.objects).map(([key, value]) => {
        return (
          value.__model__ !== undefined && (
            <Box borderColor="neutral200" hasRadius>
              <Accordion
                size="S"
                expanded={isExpanded}
                onToggle={() => { setIsExpanded(!isExpanded) }}
              >
                <AccordionToggle
                  variant="secondary"
                  title={key}
                  togglePosition="left"
                  action={
                    <Switch
                      label={`switch_tree_${key}`}
                      onChange={() =>
                        onTreeItemClick([`${key}.__model__`], value.__model__)
                      }
                      selected={!!value.__model__}
                    />}
                />

                <AccordionContent>
                  {createTree(key, value, key)}
                </AccordionContent>
              </Accordion>
            </Box>
          )

        )

      }
      )}
    </Box>
  );
}

Tree.propTypes = {
  objects: PropTypes.object.isRequired,
  onTreeItemClick: PropTypes.func.isRequired,
  initiallyExpanded: PropTypes.bool,
};

Tree.defaultProps = {
  initiallyExpanded: false,
};

export default Tree;
