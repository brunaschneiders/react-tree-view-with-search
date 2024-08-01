import React from 'react';
import './styles.css';

import TreeView from './components/TreeView';

export default function App() {
  const [selected, setSelected] = React.useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ boxSizing: 'border-box', width: '50%' }}>
        <TreeView selected={selected} onSelect={setSelected} disableRoot />
      </div>
      <div style={{ boxSizing: 'border-box', width: '50%' }}>
        <pre>{JSON.stringify({ selected }, null, 2)}</pre>
      </div>
    </div>
  );
}
