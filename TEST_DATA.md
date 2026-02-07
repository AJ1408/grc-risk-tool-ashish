# Sample Test Data for GRC Risk Assessment Dashboard

This file contains sample risks you can use to test the application.

## Quick Test Scenarios

### Scenario 1: Low Risk
- **Asset**: Email Server
- **Threat**: Spam Filter Bypass
- **Likelihood**: 2
- **Impact**: 2
- **Expected Score**: 4
- **Expected Level**: Low

### Scenario 2: Medium Risk
- **Asset**: Internal Wiki
- **Threat**: Information Disclosure
- **Likelihood**: 3
- **Impact**: 3
- **Expected Score**: 9
- **Expected Level**: Medium

### Scenario 3: High Risk
- **Asset**: Customer Database
- **Threat**: SQL Injection
- **Likelihood**: 4
- **Impact**: 4
- **Expected Score**: 16
- **Expected Level**: High

### Scenario 4: Critical Risk
- **Asset**: Payment Gateway
- **Threat**: Data Breach
- **Likelihood**: 5
- **Impact**: 5
- **Expected Score**: 25
- **Expected Level**: Critical

---

## Comprehensive Test Set (10 Risks)

Use these to populate your dashboard for demonstration:

1. **Web Application**
   - Threat: Cross-Site Scripting (XSS)
   - Likelihood: 3, Impact: 3
   - Expected: Score 9, Level Medium

2. **Mobile App**
   - Threat: Insecure Data Storage
   - Likelihood: 4, Impact: 3
   - Expected: Score 12, Level Medium

3. **Cloud Infrastructure**
   - Threat: Misconfigured S3 Bucket
   - Likelihood: 3, Impact: 5
   - Expected: Score 15, Level High

4. **Network Perimeter**
   - Threat: DDoS Attack
   - Likelihood: 4, Impact: 4
   - Expected: Score 16, Level High

5. **API Gateway**
   - Threat: Broken Authentication
   - Likelihood: 2, Impact: 5
   - Expected: Score 10, Level Medium

6. **Admin Panel**
   - Threat: Privilege Escalation
   - Likelihood: 2, Impact: 4
   - Expected: Score 8, Level Medium

7. **Backup System**
   - Threat: Ransomware Encryption
   - Likelihood: 3, Impact: 5
   - Expected: Score 15, Level High

8. **CI/CD Pipeline**
   - Threat: Supply Chain Attack
   - Likelihood: 2, Impact: 5
   - Expected: Score 10, Level Medium

9. **User Authentication**
   - Threat: Credential Stuffing
   - Likelihood: 5, Impact: 4
   - Expected: Score 20, Level Critical

10. **File Upload Feature**
    - Threat: Malicious File Execution
    - Likelihood: 3, Impact: 4
    - Expected: Score 12, Level Medium

---

## Validation Test Cases

### Edge Case 1: Minimum Values
- Likelihood: 1, Impact: 1
- Expected Score: 1, Level: Low

### Edge Case 2: Maximum Values
- Likelihood: 5, Impact: 5
- Expected Score: 25, Level: Critical

### Edge Case 3: Boundary - Low to Medium
- Likelihood: 2, Impact: 3
- Expected Score: 6, Level: Medium

### Edge Case 4: Boundary - Medium to High
- Likelihood: 3, Impact: 5
- Expected Score: 15, Level: High (13-18 range)

### Edge Case 5: Boundary - High to Critical
- Likelihood: 4, Impact: 5
- Expected Score: 20, Level: Critical (19-25 range)

---

## API Testing with cURL

### Test POST Endpoint
```bash
curl -X POST http://localhost:8000/assess-risk \
  -H "Content-Type: application/json" \
  -d '{
    "asset": "Test Server",
    "threat": "Brute Force Attack",
    "likelihood": 4,
    "impact": 3
  }'
```

Expected response:
```json
{
  "id": 1,
  "asset": "Test Server",
  "threat": "Brute Force Attack",
  "likelihood": 4,
  "impact": 3,
  "score": 12,
  "level": "Medium"
}
```

### Test GET All Risks
```bash
curl http://localhost:8000/risks
```

### Test GET Filtered Risks
```bash
curl http://localhost:8000/risks?level=High
```

### Test Invalid Input (Should Return 400)
```bash
curl -X POST http://localhost:8000/assess-risk \
  -H "Content-Type: application/json" \
  -d '{
    "asset": "Test",
    "threat": "Test",
    "likelihood": 6,
    "impact": 3
  }'
```

---

## Heatmap Distribution Test

To test heatmap visualization, add risks that cover different cells:

| Likelihood | Impact | Count | Purpose |
|-----------|--------|-------|---------|
| 1 | 1 | 1 risk | Bottom-left (green) |
| 2 | 2 | 2 risks | Low-medium transition |
| 3 | 3 | 3 risks | Center (yellow) |
| 4 | 4 | 2 risks | High area (orange) |
| 5 | 5 | 1 risk | Top-right (red) |

This creates a diagonal pattern showing all risk levels.

---

## Expected Dashboard Stats

After adding all 10 sample risks above:
- **Total Risks**: 10
- **High + Critical**: 4 (3 High + 1 Critical)
- **Critical Only**: 1
- **Average Score**: ~12.3

---

## Frontend Testing Checklist

- [ ] Real-time preview updates as sliders move
- [ ] Form validation shows error for empty fields
- [ ] Success message appears after submission
- [ ] Dashboard auto-refreshes after adding risk
- [ ] Table sorts correctly by each column
- [ ] Filter dropdown works for all levels
- [ ] Heatmap cells show correct counts
- [ ] Tooltip appears on heatmap hover
- [ ] CSV export downloads valid file
- [ ] Responsive design works on mobile (use browser DevTools)

---

## Performance Test

Add 50 risks to test:
- Table rendering speed
- Heatmap calculation
- CSV export with large dataset
- Filter/sort performance

The application should handle this smoothly without lag.
