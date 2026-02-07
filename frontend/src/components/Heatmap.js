import React, { useState } from 'react';

function Heatmap({ risks }) {
  const [tooltip, setTooltip] = useState(null);

  // Create a matrix to count risks in each cell
  const createMatrix = () => {
    const matrix = Array(5).fill(null).map(() => Array(5).fill(null).map(() => ({
      count: 0,
      risks: []
    })));

    risks.forEach(risk => {
      const row = risk.likelihood - 1; // 0-indexed
      const col = risk.impact - 1;
      matrix[row][col].count++;
      matrix[row][col].risks.push(risk);
    });

    return matrix;
  };

  const matrix = createMatrix();

  // Get color based on score (likelihood × impact)
  const getCellColor = (likelihood, impact) => {
    const score = (likelihood + 1) * (impact + 1);
    
    if (score <= 5) return '#00ff0080'; // Low - Green
    if (score <= 12) return '#ffff0080'; // Medium - Yellow
    if (score <= 18) return '#ffa50080'; // High - Orange
    return '#ff000080'; // Critical - Red
  };

  const handleMouseEnter = (e, likelihood, impact, cellData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      likelihood: likelihood + 1,
      impact: impact + 1,
      count: cellData.count,
      risks: cellData.risks
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="heatmap-container">
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: '600' }}>Legend:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#00ff0080', border: '1px solid #ccc' }}></div>
            <span>Low (1-5)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ffff0080', border: '1px solid #ccc' }}></div>
            <span>Medium (6-12)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ffa50080', border: '1px solid #ccc' }}></div>
            <span>High (13-18)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ff000080', border: '1px solid #ccc' }}></div>
            <span>Critical (19-25)</span>
          </div>
        </div>
      </div>

      <div className="heatmap">
        {/* Header row with Impact labels */}
        <div className="heatmap-row">
          <div className="heatmap-label" style={{ background: 'transparent' }}></div>
          {[1, 2, 3, 4, 5].map(impact => (
            <div key={`impact-${impact}`} className="heatmap-label">
              Impact: {impact}
            </div>
          ))}
        </div>

        {/* Rows with Likelihood labels and cells */}
        {[5, 4, 3, 2, 1].map((likelihood, rowIndex) => (
          <div key={`row-${likelihood}`} className="heatmap-row">
            <div className="heatmap-label">
              Likelihood: {likelihood}
            </div>
            {[0, 1, 2, 3, 4].map((impact) => {
              const actualLikelihood = likelihood - 1;
              const cellData = matrix[actualLikelihood][impact];
              return (
                <div
                  key={`cell-${likelihood}-${impact + 1}`}
                  className="heatmap-cell"
                  style={{
                    background: getCellColor(actualLikelihood, impact)
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, actualLikelihood, impact, cellData)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="count">{cellData.count}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>
                    {cellData.count === 1 ? 'risk' : 'risks'}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.count > 0 && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Likelihood: {tooltip.likelihood} | Impact: {tooltip.impact}
          </div>
          <div style={{ marginBottom: '5px' }}>
            {tooltip.count} {tooltip.count === 1 ? 'Risk' : 'Risks'}:
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', maxHeight: '150px', overflowY: 'auto' }}>
            {tooltip.risks.map((risk, idx) => (
              <li key={idx} style={{ marginBottom: '3px' }}>
                {risk.asset} - {risk.threat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Heatmap;
