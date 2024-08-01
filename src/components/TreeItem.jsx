import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiTreeItem from '@material-ui/lab/TreeItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import createTreeNode from './createTreeNode';

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
  },
}));

const TreeItem = ({
  items,
  selected,
  onSelect,
  disableMultiParentSelection,
}) => {
  const classes = useStyles();
  const tree = React.useMemo(() => flattenTree({ items }), [items]);
  const marksUncheckedRef = React.useRef(
    createMarksUnchecked({ tree, items, selected }),
  );
  const activeParentRef = React.useRef('');

  React.useEffect(() => {
    // marksUncheckedRef.current = createMarksUnchecked({ tree, items, selected });
    // console.log('marksUnchecked', marksUncheckedRef.current);
    // console.clear();
    // console.log(JSON.stringify(marksUncheckedRef.current, null, 2));
    // console.log('activeParent', activeParentRef.current);
  }, [items, selected, tree]);

  const handleChange = ({ event, parents = [] }) => {
    const {
      target: { value, checked },
    } = event;
    let newSelect = selected.slice();

    if (checked) {
      newSelect = [...parents, value].reverse().reduce(
        (prev, curr, index) => {
          const node = curr;
          let newSelectSoFar = prev;

          if (index === 0) {
            const childNodes = getTreeNodes({ tree, node });
            const childNodesLength = childNodes.length;

            if (childNodesLength > 0) {
              newSelectSoFar = [
                ...newSelectSoFar.filter(
                  (select) => !childNodes.includes(select),
                ),
              ];

              marksUncheckedRef.current = marksUncheckedRef.current.filter(
                (marksUnchecked) =>
                  ![...childNodes, node].includes(marksUnchecked),
              );
            }
          } else {
            // const childNodes = getTreeNodes({ tree, node, depth: 1 });
            const childNodes = getTreeNodes({ tree, node });
            const childNodesLength = childNodes.length;

            if (childNodesLength > 0) {
              const isEveryChildrenExist = childNodes.every((childNode) =>
                newSelectSoFar.includes(childNode),
              );

              if (isEveryChildrenExist) {
                newSelectSoFar = [
                  ...newSelectSoFar.filter(
                    (select) => !childNodes.includes(select),
                  ),
                  node,
                ];

                marksUncheckedRef.current = marksUncheckedRef.current.filter(
                  (marksUnchecked) =>
                    ![...childNodes, node].includes(marksUnchecked),
                );
              }
            }
          }

          marksUncheckedRef.current = marksUncheckedRef.current.filter(
            (marksUnchecked) => !newSelectSoFar.includes(marksUnchecked),
          );

          return newSelectSoFar;
        },
        [...newSelect, value],
      );
    } else if (!checked && !newSelect.includes(value)) {
      let toExclude = value;
      newSelect = parents
        .slice()
        .reverse()
        .reduce(
          (prev, curr, index) => {
            const node = curr;
            let newSelectSoFar = prev;
            let childNodes;

            marksUncheckedRef.current = [
              ...new Set([...marksUncheckedRef.current, toExclude]),
            ];

            if (index === 0) {
              childNodes = getTreeNodes({ tree, node, depth: 1 });
              console.log(
                toExclude,
                childNodes,
                childNodes.filter((childNode) => childNode !== toExclude),
              );
              newSelectSoFar = [
                ...newSelectSoFar,
                ...childNodes.filter((childNode) => childNode !== toExclude),
              ];
            } else {
              childNodes = getTreeNodes({ tree, node, depth: 1 }).filter(
                (childNode) => childNode !== toExclude,
              );
              console.log(
                toExclude,
                childNodes,
                childNodes.filter((childNode) => childNode !== toExclude),
              );
              newSelectSoFar = [
                ...newSelectSoFar.filter(
                  (select) => !childNodes.includes(select),
                ),
                ...childNodes.filter(
                  (childNode) => !marksUncheckedRef.current.includes(childNode),
                ),
              ];
            }

            toExclude = curr;

            return newSelectSoFar;
          },
          newSelect.filter((select) => !parents.includes(select)),
        );
    } else {
      [...parents, value]
        .slice()
        .reverse()
        .forEach((item) => {
          const node = item;
          const childNodes = getTreeNodes({ tree, node, depth: 1 });

          if (childNodes.length > 0) {
            marksUncheckedRef.current = [
              ...new Set([...marksUncheckedRef.current, ...childNodes]),
            ];
          } else {
            marksUncheckedRef.current = [
              ...new Set([...marksUncheckedRef.current, node]),
            ];
          }
        });
      newSelect = newSelect.filter((select) => select !== value);
    }

    if (disableMultiParentSelection) {
      if (checked) {
        activeParentRef.current = parents.length > 0 ? parents[0] : value;
      } else {
        const childNodes = getTreeNodes({
          tree,
          node: parents.length > 0 ? parents[0] : value,
        });

        if (!childNodes.some((childNode) => newSelect.includes(childNode))) {
          activeParentRef.current = '';
        }
      }
    }

    onSelect(newSelect);
  };

  const renderTreeItem = ({ nodes, parents = [], level = 0 }) => {
    return nodes.map((node) => {
      const { id: value, label, children } = node;
      const checked =
        selected.includes(value) ||
        parents.some((parent) => selected.includes(parent));
      let disabled = activeParentRef.current
        ? !parents.includes(activeParentRef.current)
        : false;

      if (activeParentRef.current === value) {
        disabled = false;
      }

      if (children && children.length > 0) {
        const indeterminate = isIndeterminate({ tree, selected, node: value });
        const treeItemLabel = createTreeItemLabel({
          formControlLabelProps: { label },
          checkboxProps: {
            value,
            checked,
            indeterminate,
            disabled,
            onChange: (event) => {
              handleChange({ event, parents });
            },
          },
        });

        return (
          <MuiTreeItem
            key={value}
            nodeId={value}
            label={treeItemLabel}
            classes={{
              root: classes.root,
              label: classes.label,
              content: classes.content,
              selected: classes.selected,
            }}
          >
            {renderTreeItem({
              nodes: children,
              parents: [...parents, value],
              level: level + 1,
            })}
          </MuiTreeItem>
        );
      }

      const treeItemLabel = createTreeItemLabel({
        formControlLabelProps: { label },
        checkboxProps: {
          value,
          checked,
          disabled,
          onChange: (event) => {
            handleChange({ event, parents });
          },
        },
      });

      return (
        <MuiTreeItem
          key={value}
          nodeId={value}
          label={treeItemLabel}
          classes={{
            root: classes.root,
            label: classes.label,
            content: classes.content,
            selected: classes.selected,
          }}
        />
      );
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

function createMarksUnchecked({ tree, items, selected }) {
  return items.reduce((prev, { id: node }) => {
    return [...prev, node, ...getTreeNodes({ tree, node })];
  }, []);
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

// const treeNodes = React.useMemo(
//   () =>
//     createTreeNode({
//       branches: (function fn(branches, parent) {
//         const newBranches = branches.map(({ children, ...branch }) => {
//           if (children && children.length > 0) {
//             const treeNode = createTreeNode({
//               node: branch,
//               parent,
//             });

//             return Object.assign(treeNode, {
//               branches: fn(children, treeNode),
//             });
//           }

//           return createTreeNode({ node: branch, parent });
//         });

//         return newBranches;
//       })(items),
//     }),
//   [items],
// );

// function TreeItem({
//   parents = [],
//   tree,
//   // treeNodes,
//   items,
//   multiple,
//   selected,
//   onSelect: handleSelect,
// }) {
//   const classes = useStyles();

//   // const handleChange = (event) => {
//   //   const { value, checked } = event.target;
//   //   const np = parents && parents[parents.length - 1];

//   //   handleSelect((prevSelect) => {
//   //     let newSelect = prevSelect.slice();

//   //     if (checked) {
//   //       newSelect = [...prevSelect, value];
//   //       // } else if (!checked && newSelect.includes(parents)) {
//   //     } else if (!checked && parents.some((p) => newSelect.includes(p))) {
//   //       // } else if (!checked && newSelect.includes(np)) {
//   //       newSelect = [
//   //         // ...newSelect.filter((select) => select !== parents),
//   //         ...newSelect.filter((select) => !parents.includes(select)),
//   //         // ...newSelect.filter((select) => select !== np),
//   //         ...siblings.filter((sibling) => sibling !== value),
//   //       ];
//   //     } else {
//   //       newSelect = newSelect.filter((select) => select !== value);
//   //     }

//   //     if (siblings.every((select) => newSelect.includes(select))) {
//   //       newSelect = [
//   //         ...newSelect.filter((select) => !siblings.includes(select)),
//   //         // parents
//   //         // ...((parents && [parents[parents.length - 1]]) || []),
//   //         np,
//   //       ].filter(Boolean);
//   //     }

//   //     return newSelect;
//   //   });
//   // };

//   const handleChange = ({ event, isParent = false, treeNode }) => {
//     const {
//       target: { value, checked },
//     } = event;

//     if (isParent) {
//     }

//     console.log(treeNode);

//     handleSelect((prevSelect) => {
//       let newSelect = prevSelect.slice();

//       if (checked) {
//         newSelect = [...parents, value].reverse().reduce(
//           (prev, curr, index) => {
//             const node = curr;
//             let newSelectSoFar = prev;
//             let childNodes;
//             let childNodesLength;

//             if (index === 0) {
//               childNodes = getTreeNodes({ tree, node });
//               childNodesLength = childNodes.length;

//               if (childNodesLength > 0) {
//                 newSelectSoFar = [
//                   ...newSelectSoFar.filter(
//                     (select) => !childNodes.includes(select),
//                   ),
//                 ];
//               }
//             } else {
//               childNodes = getTreeNodes({ tree, node, depth: 1 });
//               childNodesLength = childNodes.length;

//               if (childNodesLength > 0) {
//                 const isEveryChildrenExist = childNodes.every((childNode) =>
//                   newSelectSoFar.includes(childNode),
//                 );

//                 if (isEveryChildrenExist) {
//                   newSelectSoFar = [
//                     ...newSelectSoFar.filter(
//                       (select) => !childNodes.includes(select),
//                     ),
//                     node,
//                   ];
//                 }
//               }
//             }

//             return newSelectSoFar;
//           },
//           [...newSelect, value],
//         );
//       } else if (!checked && !newSelect.includes(value)) {
//         console.log('else if', value);
//         let toExclude = value;
//         newSelect = parents
//           .slice()
//           .reverse()
//           .reduce((prev, curr, index) => {
//             const node = curr;
//             let newSelectSoFar = prev;
//             let childNodes;

//             if (index === 0) {
//               childNodes = getTreeNodes({ tree, node, depth: 1 });
//               newSelectSoFar = [
//                 ...newSelectSoFar,
//                 ...childNodes.filter((childNode) => childNode !== toExclude),
//               ];
//             } else {
//               childNodes = getTreeNodes({ tree, node, depth: 1 }).filter(
//                 (childNode) => childNode !== toExclude,
//               );
//               console.log(toExclude, childNodes);
//               // newSelectSoFar = [
//               //   ...newSelectSoFar.filter(
//               //     (select) => !childNodes.includes(select),
//               //   ),
//               //   ...childNodes,
//               // ];
//               newSelectSoFar = [
//                 ...newSelectSoFar.filter(
//                   (select) => !childNodes.includes(select),
//                 ),
//                 ...childNodes.filter((childNode) =>
//                   newSelect.includes(childNode),
//                 ),
//               ];
//             }

//             toExclude = curr;

//             return newSelectSoFar;
//           }, newSelect.filter((select) => !parents.includes(select)));
//       } else {
//         console.log('else', value);
//         newSelect = newSelect.filter((select) => select !== value);
//       }

//       return newSelect;
//     });
//   };

//   return items.map((item) => {
//     const { id: value, label, children } = item;
//     const checked =
//       selected.includes(value) || parents.some((p) => selected.includes(p));

//     if (children && children.length > 0) {
//       const indeterminate = getTreeNodes({ tree, node: value }).some((item) =>
//         selected.includes(item),
//       );
//       const treeItemLabel = createTreeItemLabel({
//         formControlLabelProps: { label },
//         checkboxProps: {
//           value,
//           checked,
//           indeterminate,
//           onChange: (event) => {
//             handleChange({ event, isParent: true });
//           },
//         },
//       });

//       return (
//         <MuiTreeItem
//           key={value}
//           nodeId={value}
//           label={treeItemLabel}
//           classes={{
//             root: classes.root,
//             label: classes.label,
//             content: classes.content,
//             selected: classes.selected,
//           }}
//         >
//           <TreeItem
//             parents={[...parents, value]}
//             items={children}
//             tree={tree}
//             // treeNodes={branches}
//             multiple={multiple}
//             selected={selected}
//             onSelect={handleSelect}
//           />
//         </MuiTreeItem>
//       );
//     }

//     const treeItemLabel = createTreeItemLabel({
//       formControlLabelProps: { label },
//       checkboxProps: {
//         value,
//         checked,
//         onChange: (event) => {
//           handleChange({ event });
//         },
//       },
//     });

//     return (
//       <MuiTreeItem
//         key={value}
//         nodeId={value}
//         label={treeItemLabel}
//         classes={{
//           root: classes.root,
//           label: classes.label,
//           content: classes.content,
//           selected: classes.selected,
//         }}
//       />
//     );
//   });
// }
