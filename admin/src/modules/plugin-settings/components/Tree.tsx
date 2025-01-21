import React, { useState, useEffect } from 'react';
import { Box, Flex, Switch, Checkbox, Accordion } from '@strapi/design-system';
import { DynamicZoneField } from '@strapi/icons/symbols';
import { TreeItem } from './TreeItem';
import { flattenObject } from '../../@common/functions/flatten-deep';

interface TreeProps {
  objects: any[];
  onTreeItemClick: (key: string[], currentValue: boolean) => void;
  initiallyExpanded: boolean;
}

const Tree: React.FC<TreeProps> = ({ objects, onTreeItemClick, initiallyExpanded = false }) => {
  const [, setIsExpanded] = useState(initiallyExpanded);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const getCheckedState = (hasTruthyValue: boolean, hasFalsyValue: boolean) => {
    if (hasTruthyValue && !hasFalsyValue) {
      return true;
    }
    if (hasTruthyValue && hasFalsyValue) {
      return 'indeterminate';
    }
    return false;
  };

  const createTree = (name: string, branch: any[], path = '') => {
    const isBranchObject = typeof branch === 'object' && branch !== null;

    if (isBranchObject) {
      return (
        <>
          {Object.entries(branch).map(([key, value]) => {
            const isSubbranchObject = typeof value === 'object' && value !== null;
            let flattened = flattenObject(value);
            flattened = Object.fromEntries(Object.entries(flattened).filter(([key]) => !key.includes('__component__')));
            const flattenedKeys = Object.keys(flattened).map((k) => `${path}.${key}.${k}`);

            const hasTruthyValue = Object.values(flattened).some((v) => v);
            const hasFalsyValue = Object.values(flattened).some((v) => !v && v !== null);
            const hasAllNullValue = Object.values(flattened).every((v) => v === null);

            const RESERVED_KEYS_TO_SKIP = ['__model__', '__component__'];

            if (RESERVED_KEYS_TO_SKIP.includes(key)) {
              return false;
            }
            const passedKey = `${path}.${key}`;

            return (
              <Box key={passedKey} marginTop={6} marginBottom={6} marginLeft={6}>
                {isSubbranchObject && (
                  <Checkbox
                    disabled={hasAllNullValue}
                    checked={getCheckedState(hasTruthyValue, hasFalsyValue)}
                    onCheckedChange={() => onTreeItemClick(flattenedKeys, hasTruthyValue)}
                  >
                    <Flex alignItems='center'>
                      {!!value?.__component__ && (
                        <Flex alignItems='center' marginRight={2}>
                          <DynamicZoneField width='1rem' height='1rem' />
                        </Flex>
                      )}
                      {value?.__component__ || key || '-'}
                    </Flex>
                  </Checkbox>
                )}
                <TreeItem onTreeItemClick={onTreeItemClick} passedKey={passedKey}>
                  {createTree(key, value, passedKey)}
                </TreeItem>
              </Box>
            );
          })}
        </>
      );
    }

    return <TreeItem onTreeItemClick={onTreeItemClick} key={path} passedKey={path} label={name} value={branch} />;
  };

  return (
    <Box>
      {Object.entries(objects).map(([key, value]) => {
        return (
          value.__model__ !== undefined && (
            <Box borderColor='neutral200' hasRadius key={`key`}>
              <Accordion.Root size='S'>
                <Accordion.Item value={key}>
                  <Switch
                    label={`switch_tree_${key}`}
                    onCheckedChange={() => onTreeItemClick([`${key}.__model__`], value.__model__)}
                    checked={!!value.__model__}
                  />
                  <Accordion.Header>
                    <Accordion.Trigger description={key}>{key}</Accordion.Trigger>
                  </Accordion.Header>

                  <Accordion.Content>{createTree(key, value, key)}</Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </Box>
          )
        );
      })}
    </Box>
  );
};

export { Tree };
