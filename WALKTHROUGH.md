# Complete Walkthrough Guide

This guide provides a detailed step-by-step walkthrough of setting up and using the GRC Risk Assessment Dashboard. Follow this to ensure everything works correctly.

---

## Part 1: Initial Setup (First Time Only)

### Prerequisites Check

**Step 1: Verify Python Installation**
```cmd
python --version
```
Expected output: `Python 3.8.x` or higher

If not installed:
- Download from https://www.python.org/downloads/
- During installation, CHECK "Add Python to PATH"
- Restart terminal after installation

**Step 2: Verify Node.js Installation**
```cmd
node --version
npm --version
```
Expected output: `v16.x.x` or higher

If not installed:
- Download from https://nodejs.org/
- Install LTS version
- Restart terminal after installation

---

### Backend Setup

**Step 3: Navigate to Project**
```cmd
cd "c:\Users\Anish Raj\Desktop\Assessment Project\grc-risk-tool-ashish"
```

**Step 4: Setup Backend Environment**
```cmd
cd backend
pip install -r requirements.txt
```

Expected output:
```
Collecting fastapi==0.104.1
Collecting uvicorn==0.24.0
Collecting pydantic==2.5.0
...
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 pydantic-2.5.0
```

**Step 5: Test Backend**
```cmd
python app.py
```

Expected output:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Step 6: Verify Backend (Open New Terminal)**
```cmd
curl http://localhost:8000
```

Or open browser: http://localhost:8000

Expected: JSON response with API information

**Step 7: Check API Documentation**
Open browser: http://localhost:8000/docs

You should see Swagger UI with endpoints listed.

---

### Frontend Setup

**Step 8: Open New Terminal (Keep Backend Running)**

**Step 9: Navigate to Frontend**
```cmd
cd "c:\Users\Anish Raj\Desktop\Assessment Project\grc-risk-tool-ashish\frontend"
```

**Step 10: Install Dependencies**
```cmd
npm install
```

This will take 2-5 minutes. Expected output:
```
added 1500+ packages in 3m
```

**Step 11: Start Frontend**
```cmd
npm start
```

Expected output:
```
Compiled successfully!

You can now view grc-risk-dashboard in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser should auto-open to http://localhost:3000

---

## Part 2: First Use - Adding Your First Risk

### Visual Tour

**Step 12: View Dashboard (Empty State)**
- You should see: "No Risks Assessed Yet" message
- Purple gradient header
- Two tabs: "Dashboard" and "Assess New Risk"

**Step 13: Navigate to Assessment Form**
- Click "Assess New Risk" tab
- Form should appear with:
  - Asset input field
  - Threat input field
  - Likelihood slider (default: 3)
  - Impact slider (default: 3)
  - Real-time preview box showing "Score: 9 | Level: Medium"

**Step 14: Fill in Sample Risk**
```
Asset: Customer Database
Threat: SQL Injection Attack
```

**Step 15: Adjust Risk Parameters**
- Drag Likelihood slider to 4
- Watch preview update to "Score: 12"
- Drag Impact slider to 5
- Watch preview update to "Score: 20 | Level: Critical"

**Step 16: Review Mitigation Hint**
Preview box should show:
```
Recommended Action:
Immediate mitigation required + executive reporting (ISO 27001)
```

**Step 17: Submit Risk**
- Click "Submit Risk Assessment" button
- Wait for success message
- Should see: "Risk assessed successfully! Score: 20 | Level: Critical"
- Automatically redirects to Dashboard

**Step 18: View Updated Dashboard**
Dashboard now shows:
- **Stats Cards**:
  - Total Risks: 1
  - High + Critical: 1
  - Critical Only: 1
  - Average Score: 20.0

- **Heatmap**:
  - Cell at Likelihood=4, Impact=5 shows "1"
  - Cell is red (Critical level)

- **Risk Table**:
  - One row with your submitted risk
  - All columns populated correctly

---

## Part 3: Testing All Features

### Test 1: Add Multiple Risks

**Step 19: Add Low Risk**
```
Asset: Email Server
Threat: Spam Filter Bypass
Likelihood: 2
Impact: 2
```
Expected: Score 4, Level Low

**Step 20: Add Medium Risk**
```
Asset: Internal Wiki
Threat: Information Disclosure
Likelihood: 3
Impact: 3
```
Expected: Score 9, Level Medium

**Step 21: Add High Risk**
```
Asset: Payment Gateway
Threat: Data Breach
Likelihood: 4
Impact: 4
```
Expected: Score 16, Level High

**Step 22: View Updated Dashboard**
- Total Risks: 4
- High + Critical: 2
- Heatmap should show:
  - Cell [2,2] = 1 (green - Low)
  - Cell [3,3] = 1 (yellow - Medium)
  - Cell [4,4] = 1 (orange - High)
  - Cell [4,5] = 1 (red - Critical)

---

### Test 2: Filtering

**Step 23: Filter by Level**
- Click "Filter by Level" dropdown
- Select "Critical"
- Table should show only 1 risk (Customer Database)
- Counter shows "Showing 1 of 4 risks"

**Step 24: Filter by High**
- Select "High"
- Table should show only 1 risk (Payment Gateway)

**Step 25: Reset Filter**
- Select "All Levels"
- Table shows all 4 risks

---

### Test 3: Sorting

**Step 26: Sort by Score (Ascending)**
- Click "Score" column header
- Table should reorder:
  1. Email Server (Score: 4)
  2. Internal Wiki (Score: 9)
  3. Payment Gateway (Score: 16)
  4. Customer Database (Score: 20)

**Step 27: Sort by Score (Descending)**
- Click "Score" header again
- Table reverses order:
  1. Customer Database (Score: 20)
  2. Payment Gateway (Score: 16)
  3. Internal Wiki (Score: 9)
  4. Email Server (Score: 4)

**Step 28: Sort by Level**
- Click "Level" header
- Should group by level (alphabetically)

---

### Test 4: Heatmap Interaction

**Step 29: Hover Over Cell**
- Move mouse over the red cell [4,5]
- Tooltip should appear showing:
  ```
  Likelihood: 4 | Impact: 5
  1 Risk:
  • Customer Database - SQL Injection Attack
  ```

**Step 30: Hover Over Empty Cell**
- Move mouse over cell [1,1]
- Tooltip shows "0 risks"

**Step 31: Check Color Coding**
Verify colors match:
- Green cells: Scores 1-5 (Low)
- Yellow cells: Scores 6-12 (Medium)
- Orange cells: Scores 13-18 (High)
- Red cells: Scores 19-25 (Critical)

---

### Test 5: CSV Export

**Step 32: Export Data**
- Click "Export to CSV" button
- File should download: `grc-risks-2026-02-07.csv`

**Step 33: Open CSV**
- Open file in Excel, Google Sheets, or text editor
- Should contain:
  ```
  ID,Asset,Threat,Likelihood,Impact,Score,Level,Mitigation Hint
  1,"Customer Database","SQL Injection Attack",4,5,20,"Critical","Immediate response + executive reporting"
  2,"Email Server","Spam Filter Bypass",2,2,4,"Low","Accept / Monitor"
  ...
  ```

---

### Test 6: Real-Time Preview

**Step 34: Test Live Calculation**
- Go to "Assess New Risk" tab
- Don't fill in Asset/Threat
- Move Likelihood slider from 1 to 5
- Watch preview update instantly (no delay)
- Move Impact slider from 1 to 5
- Verify score updates in real-time

**Step 35: Test Boundary Conditions**
- Set Likelihood=2, Impact=3
- Preview: Score 6, Level Medium (boundary between Low and Medium)
- Set Likelihood=3, Impact=5
- Preview: Score 15, Level High (13-18 range)
- Set Likelihood=4, Impact=5
- Preview: Score 20, Level Critical (19-25 range)

---

### Test 7: Responsive Design

**Step 36: Test Mobile View**
- Press F12 to open DevTools
- Click "Toggle Device Toolbar" icon (or Ctrl+Shift+M)
- Select "iPhone 12 Pro" from dropdown
- Verify:
  - Table is scrollable horizontally
  - Tabs stack properly
  - Form inputs are touch-friendly
  - Heatmap is readable

**Step 37: Test Tablet View**
- Select "iPad" from dropdown
- Verify layout adjusts correctly

**Step 38: Return to Desktop**
- Click "Toggle Device Toolbar" again to return to desktop view

---

### Test 8: Error Handling

**Step 39: Test Empty Form Submission**
- Go to "Assess New Risk"
- Leave Asset and Threat empty
- Click Submit
- Should see error: "Please fill in all required fields"

**Step 40: Test Backend Offline**
- Stop backend server (Ctrl+C in backend terminal)
- Go to Dashboard
- Click refresh or navigate between tabs
- Should see error: "Failed to load risks. Make sure the backend is running on port 8000."

**Step 41: Restart Backend**
- In backend terminal: `python app.py`
- Return to frontend, refresh page
- Dashboard should load normally

---

## Part 4: API Testing (Optional)

### Using Swagger UI

**Step 42: Open API Documentation**
- Browser: http://localhost:8000/docs

**Step 43: Test POST Endpoint**
- Click "POST /assess-risk"
- Click "Try it out"
- Edit request body:
  ```json
  {
    "asset": "API Test Risk",
    "threat": "Test Threat",
    "likelihood": 3,
    "impact": 4
  }
  ```
- Click "Execute"
- Response should show:
  ```json
  {
    "id": 5,
    "asset": "API Test Risk",
    "threat": "Test Threat",
    "likelihood": 3,
    "impact": 4,
    "score": 12,
    "level": "Medium"
  }
  ```

**Step 44: Test GET Endpoint**
- Click "GET /risks"
- Click "Try it out"
- Click "Execute"
- Should return array of all risks including the one just added

**Step 45: Test Filtering**
- In "GET /risks"
- Enter parameter: `level = High`
- Click "Execute"
- Should return only High-level risks

---

### Using cURL (Command Line)

**Step 46: Test with cURL**
```cmd
curl -X POST http://localhost:8000/assess-risk -H "Content-Type: application/json" -d "{\"asset\": \"cURL Test\", \"threat\": \"Command Line Test\", \"likelihood\": 2, \"impact\": 3}"
```

Expected: JSON response with new risk

**Step 47: Retrieve All Risks**
```cmd
curl http://localhost:8000/risks
```

Expected: JSON array of all risks

---

## Part 5: Advanced Testing

### Stress Test

**Step 48: Add 20 Risks Quickly**
- Use the form to rapidly add 20 different risks
- Vary likelihood and impact values
- Goal: Test performance with larger dataset

**Step 49: Check Performance**
- Dashboard should load instantly
- Heatmap should render without lag
- Table sorting should be instant
- Filtering should be responsive

**Step 50: Export Large Dataset**
- Click "Export to CSV"
- File should download quickly (<1 second)
- Open CSV and verify all 20+ risks are present

---

### Edge Cases

**Step 51: Test Minimum Risk**
```
Asset: Minimal Risk Test
Threat: Low Priority
Likelihood: 1
Impact: 1
```
Expected: Score 1, Level Low

**Step 52: Test Maximum Risk**
```
Asset: Maximum Risk Test
Threat: Critical Priority
Likelihood: 5
Impact: 5
```
Expected: Score 25, Level Critical

**Step 53: Test Boundary Scores**
- Add risk with Score 5 (L=1, I=5): Should be Low
- Add risk with Score 6 (L=2, I=3): Should be Medium
- Add risk with Score 12 (L=3, I=4): Should be Medium
- Add risk with Score 13 (L=4, I=4 minus 3): Actually impossible, try L=3, I=5=15: High
- Add risk with Score 18 (L=3, I=6): Impossible (max I=5), try L=4, I=4.5: Not allowed

---

## Part 6: Verification Checklist

After completing all tests, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can submit risks via form
- [ ] Real-time preview works
- [ ] Risks appear in database
- [ ] Dashboard displays risks correctly
- [ ] Heatmap shows accurate distribution
- [ ] Heatmap colors match risk levels
- [ ] Tooltips appear on hover
- [ ] Table sorting works
- [ ] Filtering works
- [ ] Stats cards show correct numbers
- [ ] CSV export downloads valid file
- [ ] Responsive design works
- [ ] Error messages display properly
- [ ] API documentation accessible
- [ ] No console errors (F12 → Console tab)

---

## Part 7: Understanding the Code

### Backend Flow

**Step 54: Examine app.py**
Open `backend/app.py` in a text editor

Key sections to understand:
1. **Imports** (lines 1-10): FastAPI, Pydantic, SQLite
2. **Database Init** (lines 12-30): CREATE TABLE statement
3. **Pydantic Models** (lines 32-50): RiskInput, RiskResponse
4. **Risk Calculation** (lines 52-70): calculate_risk_level function
5. **POST Endpoint** (lines 72-110): assess_risk function
6. **GET Endpoint** (lines 112-150): get_risks function

**Step 55: Understand Risk Logic**
```python
score = risk.likelihood * risk.impact  # Line 85
level = calculate_risk_level(score)    # Line 86
```

This is the core business logic.

---

### Frontend Flow

**Step 56: Examine App.js**
Open `frontend/src/App.js`

Key sections:
1. **State Management**: activeTab, refreshTrigger
2. **Tab Navigation**: Button onClick handlers
3. **Component Rendering**: Conditional rendering based on activeTab

**Step 57: Examine RiskForm.js**
Open `frontend/src/components/RiskForm.js`

Key sections:
1. **Form State**: formData with asset, threat, likelihood, impact
2. **Real-time Calculation**: calculateRisk() function
3. **Form Submission**: handleSubmit() with axios.post
4. **Validation**: Empty field check

**Step 58: Examine Dashboard.js**
Open `frontend/src/components/Dashboard.js`

Key sections:
1. **Data Fetching**: useEffect with axios.get
2. **Filtering Logic**: applyFilter() function
3. **Sorting Logic**: handleSort() function
4. **CSV Export**: exportToCSV() function

**Step 59: Examine Heatmap.js**
Open `frontend/src/components/Heatmap.js`

Key sections:
1. **Matrix Creation**: createMatrix() function
2. **Color Calculation**: getCellColor() function
3. **Tooltip Logic**: handleMouseEnter/Leave

---

## Troubleshooting Common Issues

### Issue 1: "Module not found" Error
**Solution**:
```cmd
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

### Issue 2: Port Already in Use
**Backend (Port 8000)**:
```cmd
# Find process using port 8000
netstat -ano | findstr :8000
# Kill process (replace PID)
taskkill /PID [PID] /F
```

**Frontend (Port 3000)**:
```cmd
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Issue 3: CORS Error
Check backend `app.py` has:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    ...
)
```

### Issue 4: Database Locked
```cmd
cd backend
del risks.db
# Restart backend - it will recreate
python app.py
```

### Issue 5: npm install Fails
```cmd
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

---

## Completion

If you've completed all steps successfully, you now have:
- Fully functional backend API
- Interactive frontend dashboard
- Understanding of the codebase
- Tested all major features
- Verified edge cases
- Ready for submission

Congratulations! Your GRC Risk Assessment Dashboard is complete.

---

## Next Steps

1. **Take Screenshots**: Capture dashboard with populated data
2. **Document Challenges**: Note any issues you faced
3. **Review Code**: Make sure you understand what you built
4. **Prepare Demo**: Be ready to walk through the application
5. **Submit**: Follow SUBMISSION_CHECKLIST.md

---

Total Walkthrough Time: 60-90 minutes
Status: Production Ready
