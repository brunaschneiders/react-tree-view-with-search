import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(() => ({
  root: {
    [[
      '&:focus > $content $label',
      '&:hover > $content $label',
      '&$selected > $content $label',
      '&$selected > $content $label:hover',
      '&$selected:focus > $content $label',
    ].join(',')]: {
      backgroundColor: 'transparent',
    },
  },
  content: {},
  expanded: {},
  selected: {},
  label: {
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  treeItem: {
    marginLeft: (props) => props.level * 20,
  },
}));

const CustomTreeItem = ({ nodeId, label, children, classes, level }) => {
  const [expanded, setExpanded] = useState(false);
  const props = { level };
  const customClasses = useStyles(props);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={customClasses.treeItem}>
      <div className={classes.content}>
        <div className={classes.label}>
          {label} {children?.length ? `(${children.length})` : null}
          {!!children ? (
            <IconButton size="small" onClick={handleToggle}>
              {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          ) : null}
        </div>
      </div>
      {expanded && children && <div>{children}</div>}
    </div>
  );
};

const removeNodes = (nodesList, nodesToBeRemoved) =>
  nodesList.filter((select) => !nodesToBeRemoved.includes(select));

const TreeItem = ({ items, selected, onSelect }) => {
  const classes = useStyles();
  const tree = React.useMemo(() => flattenTree({ items }), [items]);

  const handleChange = ({ event, parents = [] }) => {
    const {
      target: { value, checked },
    } = event;
    let newSelect = selected.slice();

    if (checked) {
      newSelect = handleChecked({ value, parents, newSelect });
    } else {
      newSelect = handleUnchecked({
        nodeToBeRemoved: value,
        parents,
        newSelect,
      });
    }

    onSelect(newSelect);
  };

  const handleChecked = ({ value, parents, newSelect }) => {
    return [...parents, value].reverse().reduce(
      (prev, curr, index) => {
        const node = curr;
        let newSelectTemp = prev;

        if (index === 0) {
          newSelectTemp = handleFirstLevelChecked({ node, newSelectTemp });
        } else {
          newSelectTemp = handleOtherLevelsChecked({ node, newSelectTemp });
        }

        return newSelectTemp;
      },
      [...newSelect, value],
    );
  };

  const handleFirstLevelChecked = ({ node, newSelectTemp }) => {
    const childNodes = getTreeNodes({ tree, node });

    if (childNodes.length > 0) {
      newSelectTemp = removeNodes([...newSelectTemp], childNodes);
    }
    return newSelectTemp;
  };

  const handleOtherLevelsChecked = ({ node, newSelectTemp }) => {
    const immediateChildNodes = getTreeNodes({ tree, node, depth: 1 });

    if (immediateChildNodes.length > 0) {
      const isEveryChildrenSelected = immediateChildNodes.every((childNode) =>
        newSelectTemp.includes(childNode),
      );

      if (isEveryChildrenSelected) {
        newSelectTemp = removeNodes(
          [...newSelectTemp, node],
          immediateChildNodes,
        );
      }
    }
    return newSelectTemp;
  };

  const handleUnchecked = ({ nodeToBeRemoved, parents, newSelect }) => {
    let updatedSelect = [...newSelect];

    if (updatedSelect.includes(nodeToBeRemoved)) {
      updatedSelect = removeNodes([...updatedSelect], [nodeToBeRemoved]);
    } else {
      const treeToBeRemoved = [...parents, nodeToBeRemoved];

      const parentNodeSelected = parents.find((parentNode) =>
        updatedSelect.includes(parentNode),
      );

      updatedSelect = removeNodes([...updatedSelect], [parentNodeSelected]);

      const nodesFromSelectedParent = parents.slice(
        parents.indexOf(parentNodeSelected),
      );

      nodesFromSelectedParent.forEach((parentNode) => {
        const childNodes = getTreeNodes({ tree, node: parentNode, depth: 1 });

        const nodesToBeIncluded = removeNodes(childNodes, treeToBeRemoved);

        updatedSelect.push(...nodesToBeIncluded);
      });
    }

    return updatedSelect;
  };

  const renderTreeItem = ({ nodes, parents = [], level = 0 }) => {
    return nodes.map((node) => {
      const { id: value, label, children } = node;
      const checked =
        selected.includes(value) ||
        parents.some((parent) => selected.includes(parent));

      const indeterminate = isIndeterminate({ tree, selected, node: value });
      const treeItemLabel = createTreeItemLabel({
        formControlLabelProps: { label },
        checkboxProps: {
          value,
          checked,
          indeterminate,
          onChange: (event) => {
            handleChange({ event, parents });
          },
        },
      });

      const customTreeItemProps = {
        key: value,
        nodeId: value,
        label: treeItemLabel,
        classes: classes,
        level: level,
      };

      if (children && children.length > 0) {
        return (
          <CustomTreeItem {...customTreeItemProps}>
            {renderTreeItem({
              nodes: children,
              parents: [...parents, value],
              level: level + 1,
            })}
          </CustomTreeItem>
        );
      }

      return <CustomTreeItem {...customTreeItemProps} />;
    });
  };

  return renderTreeItem({ nodes: items });
};
export default TreeItem;

function flattenTree({ items, parent = 'root', depth = 0 }) {
  return items.reduce((prev, curr) => {
    Object.assign(prev, { [parent]: [...(prev[parent] || []), curr.id] });
    if (curr.children && curr.children.length > 0) {
      return {
        ...prev,
        ...flattenTree({
          items: curr.children,
          depth: depth + 1,
          parent: curr.id,
        }),
      };
    }
    return prev;
  }, {});
}

function createTreeItemLabel({
  formControlLabelProps = {},
  checkboxProps = {},
}) {
  return (
    <FormControlLabel
      style={{ width: '100%', marginLeft: 0 }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      control={<Checkbox {...checkboxProps} />}
      {...formControlLabelProps}
    />
  );
}

function getTreeNodes({ tree, node = 'root', depth, currentDepth = 1 }) {
  const branches = tree[node];
  if (!branches) {
    return [];
  }
  return branches.reduce((prev, curr) => {
    let newPrev = [...prev, curr];
    if (tree[curr] && (typeof depth === 'undefined' || depth > currentDepth)) {
      newPrev = [
        ...newPrev,
        ...getTreeNodes({
          tree,
          node: curr,
          depth,
          currentDepth: currentDepth + 1,
        }),
      ];
    }
    return newPrev;
  }, []);
}

function isIndeterminate({ tree, node: value, selected }) {
  return getTreeNodes({ tree, node: value }).some((node) =>
    selected.includes(node),
  );
}
