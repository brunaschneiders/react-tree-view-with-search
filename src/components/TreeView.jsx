import React from 'react';
import TreeItem from './TreeItem';

import data from '../data';

const TreeView = ({
  items = data,
  selected: selectedProps = [],
  onSelect: onSelectProps = () => {},
  disableMultiParentSelection = true,
}) => {
  return (
    data.length > 0 && (
      <TreeItem
        items={items}
        selected={selectedProps}
        onSelect={onSelectProps}
        disableMultiParentSelection={disableMultiParentSelection}
      />
    )
  );
};

export default TreeView;
