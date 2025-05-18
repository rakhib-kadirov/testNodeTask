import React from 'react';
import './App.css';
import CreateAppeal from './components/CreateAppel/index';

function App() {
  return (
    <main>
      <div style={{ "display": "flex", padding: '12px' }}>
        <div style={{ "width": "50%" }}>
          <CreateAppeal />
        </div>
      </div>
    </main>
  );
}

export default App