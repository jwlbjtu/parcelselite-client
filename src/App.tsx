import React, { ReactElement } from 'react';

import './App.css';
import LayoutPage from './features/Layout/pages/LayoutPage';

function App(): ReactElement {
  return (
    <div className="App">
      <LayoutPage />
    </div>
  );
}

export default App;
