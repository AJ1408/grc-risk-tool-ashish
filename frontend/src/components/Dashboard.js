import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heatmap from './Heatmap';

const API_URL = 'http://localhost:8000';

function Dashboard({ refreshTrigger }) {
  const [risks, setRisks] = useState([]);
  const [filteredRisks, setFilteredRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchRisks();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilter();
  }, [risks, filterLevel]);

  const fetchRisks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/risks`);
      setRisks(response.data);
    } catch (err) {
      setError('Failed to load risks. Make sure the backend is running on port 8000.');
      console.error('Error fetching risks:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filterLevel === 'All') {
      setFilteredRisks(risks);
    } else {
      setFilteredRisks(risks.filter(risk => risk.level === filterLevel));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredRisks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredRisks(sorted);
  };

  const exportToCSV = () => {
    if (filteredRisks.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['ID', 'Asset', 'Threat', 'Likelihood', 'Impact', 'Score', 'Level', 'Mitigation Hint'];
    const rows = filteredRisks.map(risk => [
      risk.id,
      risk.asset,
      risk.threat,
      risk.likelihood,
      risk.impact,
      risk.score,
      risk.level,
      getMitigationHint(risk.level)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `grc-risks-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMitigationHint = (level) => {
    const hints = {
      'Low': 'Accept / Monitor',
      'Medium': 'Plan mitigation within 6 months',
      'High': 'Prioritize action per NIST PR.AC',
      'Critical': 'Immediate response + executive reporting'
    };
    return hints[level] || '';
  };

  const calculateStats = () => {
    const total = risks.length;
    const highCritical = risks.filter(r => r.level === 'High' || r.level === 'Critical').length;
    const avgScore = total > 0 
      ? (risks.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1)
      : 0;
    const critical = risks.filter(r => r.level === 'Critical').length;
    
    return { total, highCritical, avgScore, critical };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          Loading risk data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          ❌ {error}
        </div>
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📊</div>
          <h2>No Risks Assessed Yet</h2>
          <p style={{ color: '#999', marginTop: '10px' }}>
            Click on "Assess New Risk" to add your first risk assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Risks</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#FFA500' }}>
          <h3>High + Critical</h3>
          <div className="stat-value" style={{ color: '#FFA500' }}>
            {stats.highCritical}
          </div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#FF0000' }}>
          <h3>Critical Only</h3>
          <div className="stat-value" style={{ color: '#FF0000' }}>
            {stats.critical}
          </div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#764ba2' }}>
          <h3>Average Score</h3>
          <div className="stat-value" style={{ color: '#764ba2' }}>
            {stats.avgScore}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card">
        <h2>Risk Heatmap (5×5 Matrix)</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Interactive visualization showing risk distribution across likelihood and impact dimensions.
          Hover over cells to see details.
        </p>
        <Heatmap risks={risks} />
      </div>

      {/* Risks Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Risk Register</h2>
          <button onClick={exportToCSV} className="btn btn-secondary">
            📥 Export to CSV
          </button>
        </div>

        <div className="filter-controls">
          <label htmlFor="levelFilter" style={{ fontWeight: '600' }}>
            Filter by Level:
          </label>
          <select
            id="levelFilter"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <span style={{ color: '#666' }}>
            Showing {filteredRisks.length} of {risks.length} risks
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('asset')}>
                  Asset {sortConfig.key === 'asset' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('threat')}>
                  Threat {sortConfig.key === 'threat' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('likelihood')}>
                  Likelihood {sortConfig.key === 'likelihood' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('impact')}>
                  Impact {sortConfig.key === 'impact' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('score')}>
                  Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('level')}>
                  Level {sortConfig.key === 'level' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Mitigation Hint</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.map((risk) => (
                <tr key={risk.id}>
                  <td>{risk.id}</td>
                  <td><strong>{risk.asset}</strong></td>
                  <td>{risk.threat}</td>
                  <td style={{ textAlign: 'center' }}>{risk.likelihood}</td>
                  <td style={{ textAlign: 'center' }}>{risk.impact}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{risk.score}</td>
                  <td>
                    <span className={`level-badge level-${risk.level}`}>
                      {risk.level}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#666' }}>
                    {getMitigationHint(risk.level)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
