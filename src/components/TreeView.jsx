import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MuiTreeView from '@material-ui/lab/TreeView';
import TreeItem from './TreeItem';

import data from '../data';

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const TreeView = ({
  items = data,
  selected: selectedProps = [],
  onSelect: onSelectProps = () => {},
  disableMultiParentSelection = true,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([
    // 'material-ui',
    // 'documents',
    // 'applications',
    'documents',
    'documents.bootstrap',
    'documents.material-ui',
  ]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (value) => {
    onSelectProps((prevSelected) => {
      // if (
      //   prevSelected.some(
      //     (prevSelect) =>
      //       prevSelect.startsWith('main.') && prevSelect !== value,
      //   )
      // ) {
      //   return prevSelected;
      // }

      if (prevSelected.includes(value)) {
        return prevSelected.filter((prevSelect) => prevSelect !== value);
      }

      return [...prevSelected, value];
    });
  };

  // React.useEffect(() => {
  //   setSelected(selectedProps);
  // }, [selectedProps]);

  return (
    <MuiTreeView
      className={classes.root}
      // defaultCollapseIcon={<ExpandMoreIcon />}
      // defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
    >
      {data.length > 0 && (
        <TreeItem
          items={items}
          selected={selectedProps}
          onSelect={onSelectProps}
          disableMultiParentSelection={disableMultiParentSelection}
        />
      )}
    </MuiTreeView>
  );
};

export default TreeView;
