import React, { Fragment } from 'react';
import './App.css';
import Downloader from './components/Downloader';
import { DataProvider } from './contexts/Data';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Fragment>
      <ToastContainer />

      <div className="App">
        <div className="App-header">
          
          <DataProvider>
            <Downloader />
          </DataProvider>

        </div>
      </div>
    </Fragment>
  );
}

export default App;
