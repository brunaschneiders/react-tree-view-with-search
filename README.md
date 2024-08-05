# :deciduous_tree: POC: Tree Checkbox Functionality

This POC demonstrates the implementation of a tree of checkboxes with the ability to collapse and expand nodes. The tree allows selecting and deselecting nodes, with logic to manage the selection of child and parent nodes.

## Features

- Collapse/Expand Nodes: Each node can be collapsed or expanded to show or hide its children.
- Checkbox Selection: Select and deselect nodes with propagation to child and parent nodes.
- Indeterminate State: Indeterminate state for partially selected nodes.

## :hammer_and_wrench: Technologies Used

- React: JavaScript library for building user interfaces.
- Material-UI: UI component library for React.
- JavaScript (ES6): Programming language used for the component logic.

## :rocket: How to Run

1. Clone the repository:

```
    git clone https://github.com/brunaschneiders/react-tree-view-with-search.git
    cd react-tree-view-with-search
```

2. Install dependencies:

```
    npm install
```

3. Run the application:

```
    npm start
```

4. Open your browser and go to http://localhost:3000 to see the application running.

## :books: Usage

### Data Structure

The data structure for the tree items should be an array of objects, where each object represents a node with the following fields:

- id: Unique identifier for the node.
- label: Label to be displayed for the node.
- children: Array of child nodes (optional).
  Example:

```
javascript
const items = [
  {
    id: '1',
    label: 'Node 1',
    children: [
      {
        id: '1-1',
        label: 'Node 1-1',
        children: [
          { id: '1-1-1', label: 'Node 1-1-1' },
          { id: '1-1-2', label: 'Node 1-1-2' },
        ],
      },
      { id: '1-2', label: 'Node 1-2' },
    ],
  },
  { id: '2', label: 'Node 2' },
];
```

### TreeItem Component

The TreeItem component is responsible for rendering the tree of checkboxes. It receives the following props:

- items: Array of tree items.
- selected: Array of IDs of selected nodes.
- onSelect: Function called when the selection changes.
  Usage example:

```
javascript
import React, { useState } from 'react';
import TreeItem from './components/TreeItem';

const App = () => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (newSelected) => {
    setSelected(newSelected);
  };

  return (
    <div>
      <TreeItem items={items} selected={selected} onSelect={handleSelect} />
    </div>
  );
};

export default App;
```

## :movie_camera: Demo

Check out the demo video below to see the tree checkbox functionality in action:
![Screenshot 2024-08-05 at 11 54 50](https://github.com/user-attachments/assets/bc8d5b30-124c-4d56-8015-99e75542da0c)



## :mag: Future Enhancements

- Search Functionality: In the future, we plan to add a search functionality to easily find and select nodes within the tree.

## :handshake: Contribution

Feel free to contribute with improvements or fixes. To do so, follow these steps:

1. Fork the repository.
2. Create a branch for your feature (git checkout -b feature/new-feature).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature/new-feature).
5. Open a Pull Request.
