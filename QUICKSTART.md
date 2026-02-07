# Quick Start Guide

## Fastest Way to Get Started (Windows)

### Terminal 1 - Backend:
```cmd
cd backend
pip install -r requirements.txt
python app.py
```

Keep this terminal open! Backend runs on http://localhost:8000

### Terminal 2 - Frontend:
Open a NEW terminal window:
```cmd
cd frontend
npm install
npm start
```

Browser will auto-open to http://localhost:3000

## Quick Test
1. Click "Assess New Risk"
2. Fill in:
   - Asset: "Test Server"
   - Threat: "Malware Attack"
   - Likelihood: 4 (drag slider)
   - Impact: 5 (drag slider)
3. Click Submit
4. View Dashboard to see your risk!

## Troubleshooting

### Backend won't start?
- Make sure Python 3.8+ is installed: `python --version`
- Try: `pip install --upgrade pip`
- Then: `pip install -r requirements.txt` again

### Frontend won't start?
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder
- Run: `npm install` again

### "Connection refused" error?
- Backend must be running first (Terminal 1)
- Check http://localhost:8000 in browser
- You should see: {"message": "GRC Risk Assessment API"}

### Port 3000 already in use?
- Either close other apps using port 3000
- Or frontend will prompt you to use 3001 instead (press Y)

## Verify Installation

### Check Backend:
Open browser: http://localhost:8000/docs
You should see interactive API documentation (Swagger UI)

### Check Frontend:
Open browser: http://localhost:3000
You should see the purple gradient dashboard

## What to Test
1. ✅ Add 3-5 risks with different likelihood/impact values
2. ✅ Check heatmap shows correct distribution
3. ✅ Filter by "Critical" level
4. ✅ Sort table by "Score" column
5. ✅ Export to CSV
6. ✅ Hover over heatmap cells for tooltips

## Need Help?
Check the main README.md for detailed documentation.
