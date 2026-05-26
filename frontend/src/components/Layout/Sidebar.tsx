import React from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
        <div className="sidebar-logo-icon">
          <AccountBalanceIcon style={{ fontSize: 20, color: '#fff' }} />
        </div>
        <div>
          <p className="sidebar-logo-name">OrgPay</p>
          <span className="sidebar-logo-sub">HR Salary Tool</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section">Main Menu</span>
        <button
          className={`nav-item ${currentPage === 'employees' ? 'active' : ''}`}
          onClick={() => onNavigate('employees')}
        >
          <PeopleAltIcon className="nav-icon" />
          <span>Employees</span>
          {currentPage === 'employees' && <div className="nav-active-bar" />}
        </button>
        <button
          className={`nav-item ${currentPage === 'insights' ? 'active' : ''}`}
          onClick={() => onNavigate('insights')}
        >
          <InsightsIcon className="nav-icon" />
          <span>Insights</span>
          {currentPage === 'insights' && <div className="nav-active-bar" />}
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">HR</div>
          <div>
            <p className="sidebar-user-name">HR Manager</p>
            <p className="sidebar-user-role">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;