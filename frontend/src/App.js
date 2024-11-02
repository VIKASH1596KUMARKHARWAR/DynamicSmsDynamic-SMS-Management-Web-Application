// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import SessionList from './pages/SessionList';
import DashboardPage from './pages/DashboardPage';
import ProgramControlPage from './pages/ProgramControlPage';
import CountryOperatorPage from './pages/CountryOperatorPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/program-control" element={<ProgramControlPage />} />
          <Route path="/country-operator" element={<CountryOperatorPage />} />
          <Route path="/sessions" element={<SessionList />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
