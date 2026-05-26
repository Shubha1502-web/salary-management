import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Layout/Sidebar';
import EmployeesPage from './pages/EmployeesPage';
import InsightsPage from './pages/InsightsPage';

type Page = 'employees' | 'insights';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('employees');

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="app-main">
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'insights' && <InsightsPage />}
      </main>
    </div>
  );
}

export default App;