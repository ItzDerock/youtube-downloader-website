import React from 'react';
import './App.css';
import Downloader from './components/Downloader';
import { DataProvider } from './contexts/Data';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <DataProvider>
          <Downloader />
        </DataProvider>

      </header>
    </div>
  );
}

export default App;
