import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './components/redux/store'; // Adjust the path if necessary
import ListPage from './components/ListPage';
import FormPage from './components/FormPage';

const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/form/:id" element={<FormPage />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
