import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function RiskForm({ onRiskAdded }) {
  const [formData, setFormData] = useState({
    asset: '',
    threat: '',
    likelihood: 3,
    impact: 3
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Calculate risk score and level (client-side preview)
  const calculateRisk = () => {
    const score = formData.likelihood * formData.impact;
    let level = 'Low';
    if (score >= 19) level = 'Critical';
    else if (score >= 13) level = 'High';
    else if (score >= 6) level = 'Medium';
    
    return { score, level };
  };

  const { score: previewScore, level: previewLevel } = calculateRisk();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'likelihood' || name === 'impact' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.asset.trim() || !formData.threat.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/assess-risk`, formData);
      setMessage({ 
        type: 'success', 
        text: `Risk assessed successfully! Score: ${response.data.score} | Level: ${response.data.level}` 
      });
      
      // Reset form
      setFormData({
        asset: '',
        threat: '',
        likelihood: 3,
        impact: 3
      });

      // Notify parent to refresh dashboard
      setTimeout(() => {
        if (onRiskAdded) onRiskAdded();
      }, 1500);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to assess risk. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMitigationHint = (level) => {
    const hints = {
      'Low': 'Accept / Monitor - Review quarterly per NIST SP 800-30',
      'Medium': 'Plan mitigation within 6 months - Document in risk register',
      'High': 'Prioritize action + compensating controls (NIST PR.AC-7)',
      'Critical': 'Immediate mitigation required + executive reporting (ISO 27001)'
    };
    return hints[level] || '';
  };

  return (
    <div className="card">
      <h2>Assess New Risk</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>
        Enter risk details below. The system will automatically calculate the risk score using the likelihood × impact matrix.
      </p>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="risk-form">
        <div className="form-group">
          <label htmlFor="asset">Asset / System *</label>
          <input
            type="text"
            id="asset"
            name="asset"
            placeholder="e.g., Customer Database, Web Server, Payment Gateway"
            value={formData.asset}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="threat">Threat / Vulnerability *</label>
          <input
            type="text"
            id="threat"
            name="threat"
            placeholder="e.g., SQL Injection, Unauthorized Access, DDoS Attack"
            value={formData.threat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="likelihood">
            Likelihood (1 = Rare, 5 = Almost Certain)
            <span className="slider-value">{formData.likelihood}</span>
          </label>
          <input
            type="range"
            id="likelihood"
            name="likelihood"
            min="1"
            max="5"
            value={formData.likelihood}
            onChange={handleChange}
          />
          <small style={{ color: '#999', marginTop: '5px' }}>
            How probable is this threat?
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="impact">
            Impact (1 = Negligible, 5 = Catastrophic)
            <span className="slider-value">{formData.impact}</span>
          </label>
          <input
            type="range"
            id="impact"
            name="impact"
            min="1"
            max="5"
            value={formData.impact}
            onChange={handleChange}
          />
          <small style={{ color: '#999', marginTop: '5px' }}>
            How severe would the damage be if it occurs?
          </small>
        </div>

        <div className="preview-box">
          <h3>📊 Real-Time Risk Preview</h3>
          <div className="preview-details">
            <div className="preview-item">
              <strong>Risk Score</strong>
              <span style={{ color: '#667eea' }}>{previewScore}</span>
            </div>
            <div className="preview-item">
              <strong>Risk Level</strong>
              <span className={`level-badge level-${previewLevel}`}>
                {previewLevel}
              </span>
            </div>
            <div className="preview-item" style={{ gridColumn: '1 / -1' }}>
              <strong>Recommended Action</strong>
              <p style={{ fontSize: '0.9rem', marginTop: '8px', color: '#666' }}>
                {getMitigationHint(previewLevel)}
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Assessing Risk...' : '✅ Submit Risk Assessment'}
        </button>
      </form>
    </div>
  );
}

export default RiskForm;
