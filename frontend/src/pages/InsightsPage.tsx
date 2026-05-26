import React, { useState, useEffect } from 'react';
import { getSalaryStats, getSalaryByTitle } from '../api/employees';
import { SalaryStats, SalaryByTitle } from '../types';
import './InsightsPage.css';

const COUNTRIES = ['', 'India', 'USA', 'UK', 'Germany', 'Canada'];

const InsightsPage: React.FC = () => {
  const [country, setCountry] = useState('');
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [byTitle, setByTitle] = useState<SalaryByTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [statsRes, titleRes] = await Promise.all([
          getSalaryStats(country || undefined),
          getSalaryByTitle(country || undefined),
        ]);
        setStats(statsRes.data);
        setByTitle(titleRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [country]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Salary insights</h1>
          <p className="page-sub">Aggregated salary data across the organization</p>
        </div>
        <select
          className="filter-select"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c || 'All countries'}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Minimum salary</div>
              <div className="stat-value">{fmt(stats?.min || 0)}</div>
              <div className="stat-sub">{country || 'All countries'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Maximum salary</div>
              <div className="stat-value">{fmt(stats?.max || 0)}</div>
              <div className="stat-sub">{country || 'All countries'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average salary</div>
              <div className="stat-value">{fmt(stats?.avg || 0)}</div>
              <div className="stat-sub">{country || 'All countries'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total headcount</div>
              <div className="stat-value">{stats?.count?.toLocaleString()}</div>
              <div className="stat-sub">employees</div>
            </div>
          </div>

          <div className="insights-card">
            <h2 className="insights-card-title">Average salary by job title</h2>
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Job title</th>
                  <th>Headcount</th>
                  <th>Avg salary</th>
                  <th>vs org avg</th>
                </tr>
              </thead>
              <tbody>
                {byTitle.map(row => (
                  <tr key={row.jobTitle}>
                    <td>{row.jobTitle}</td>
                    <td>{row.count.toLocaleString()}</td>
                    <td>{fmt(row.avgSalary)}</td>
                    <td className={row.vsOrgAvg >= 0 ? 'positive' : 'negative'}>
                      {row.vsOrgAvg >= 0 ? '+' : ''}{row.vsOrgAvg}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default InsightsPage;