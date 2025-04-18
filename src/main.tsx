import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from './demo/Demo';
import Layout from './components/ui/Layout';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout>
      <Demo />
    </Layout>
  </React.StrictMode>
); 