import React from 'react';
import './Sidebar.css';

type Page = 'employees' | 'insights';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <p className="sidebar-logo-name">OrgPay</p>
        <span className="sidebar-logo-sub">HR Salary Tool</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section">Main</span>
        <button
          className={`nav-item ${currentPage === 'employees' ? 'active' : ''}`}
          onClick={() => onNavigate('employees')}
        >
          <span className="nav-icon">👥</span>
          Employees
        </button>
        <button
          className={`nav-item ${currentPage === 'insights' ? 'active' : ''}`}
          onClick={() => onNavigate('insights')}
        >
          <span className="nav-icon">📊</span>
          Insights
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;