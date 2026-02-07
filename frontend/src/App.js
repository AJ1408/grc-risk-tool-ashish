import React, { useState } from 'react';
import RiskForm from './components/RiskForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRiskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('dashboard');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🛡️ GRC Risk Assessment Dashboard</h1>
        <p>Governance, Risk, and Compliance Management Tool</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#999' }}>
          Aligned with NIST SP 800-30 & ISO 27001 Standards
        </p>
      </header>

      <nav className="nav-tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'assess' ? 'active' : ''}`}
          onClick={() => setActiveTab('assess')}
        >
          ➕ Assess New Risk
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <Dashboard refreshTrigger={refreshTrigger} />
      )}

      {activeTab === 'assess' && (
        <RiskForm onRiskAdded={handleRiskAdded} />
      )}

      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: 'white',
        marginTop: '40px'
      }}>
        <p>© 2026 GRC Risk Assessment Tool | Built for Compliance & Security</p>
      </footer>
    </div>
  );
}

export default App;
