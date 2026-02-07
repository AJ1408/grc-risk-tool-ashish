from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from contextlib import asynccontextmanager
import sqlite3
from typing import Optional, List
import uvicorn

# Database initialization
def init_db():
    conn = sqlite3.connect('risks.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS risks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset TEXT NOT NULL,
            threat TEXT NOT NULL,
            likelihood INTEGER NOT NULL,
            impact INTEGER NOT NULL,
            score INTEGER NOT NULL,
            level TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    init_db()
    yield
    # Shutdown: cleanup if needed
    pass

app = FastAPI(title="GRC Risk Assessment API", version="1.0.0", lifespan=lifespan)

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RiskInput(BaseModel):
    asset: str = Field(..., min_length=1, max_length=200)
    threat: str = Field(..., min_length=1, max_length=200)
    likelihood: int = Field(..., ge=1, le=5)
    impact: int = Field(..., ge=1, le=5)
    
    @field_validator('likelihood', 'impact')
    @classmethod
    def validate_range(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Likelihood and Impact must be between 1 and 5')
        return v

class RiskResponse(BaseModel):
    id: int
    asset: str
    threat: str
    likelihood: int
    impact: int
    score: int
    level: str

# Risk calculation logic
def calculate_risk_level(score: int) -> str:
    """
    Maps risk score to level following NIST/ISO standards:
    1-5: Low, 6-12: Medium, 13-18: High, 19-25: Critical
    """
    if 1 <= score <= 5:
        return "Low"
    elif 6 <= score <= 12:
        return "Medium"
    elif 13 <= score <= 18:
        return "High"
    elif 19 <= score <= 25:
        return "Critical"
    else:
        return "Unknown"

def get_compliance_hint(level: str) -> str:
    """Returns GRC compliance hints based on risk level"""
    hints = {
        "Low": "Accept / Monitor - Review quarterly per NIST SP 800-30",
        "Medium": "Plan mitigation within 6 months - Document in risk register",
        "High": "Prioritize action + compensating controls (NIST PR.AC-7: Rate Limiting)",
        "Critical": "Immediate mitigation required + executive reporting (ISO 27001 Clause 6.1.2)"
    }
    return hints.get(level, "Review and assess")

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "GRC Risk Assessment API",
        "endpoints": {
            "POST /assess-risk": "Submit a new risk assessment",
            "GET /risks": "Retrieve all risks (optional ?level= filter)",
            "GET /risks/{id}": "Get specific risk by ID"
        }
    }

@app.post("/assess-risk", response_model=RiskResponse)
async def assess_risk(risk: RiskInput):
    """
    Assess a new risk and store it in the database.
    Validates input, calculates score and level, returns the created risk.
    """
    try:
        # Calculate risk score and level
        score = risk.likelihood * risk.impact
        level = calculate_risk_level(score)
        
        # Insert into database
        conn = sqlite3.connect('risks.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO risks (asset, threat, likelihood, impact, score, level)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (risk.asset, risk.threat, risk.likelihood, risk.impact, score, level))
        conn.commit()
        risk_id = cursor.lastrowid
        conn.close()
        
        return RiskResponse(
            id=risk_id,
            asset=risk.asset,
            threat=risk.threat,
            likelihood=risk.likelihood,
            impact=risk.impact,
            score=score,
            level=level
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/risks", response_model=List[RiskResponse])
async def get_risks(level: Optional[str] = None):
    """
    Retrieve all risks from database.
    Optional query parameter: ?level=High to filter by risk level.
    """
    try:
        conn = sqlite3.connect('risks.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if level:
            # Validate level parameter
            valid_levels = ["Low", "Medium", "High", "Critical"]
            if level not in valid_levels:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid level. Must be one of: {', '.join(valid_levels)}"
                )
            cursor.execute('SELECT * FROM risks WHERE level = ?', (level,))
        else:
            cursor.execute('SELECT * FROM risks')
        
        rows = cursor.fetchall()
        conn.close()
        
        risks = [
            RiskResponse(
                id=row['id'],
                asset=row['asset'],
                threat=row['threat'],
                likelihood=row['likelihood'],
                impact=row['impact'],
                score=row['score'],
                level=row['level']
            )
            for row in rows
        ]
        
        return risks
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/risks/{risk_id}", response_model=RiskResponse)
async def get_risk(risk_id: int):
    """Get a specific risk by ID"""
    try:
        conn = sqlite3.connect('risks.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM risks WHERE id = ?', (risk_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Risk not found")
        
        return RiskResponse(
            id=row['id'],
            asset=row['asset'],
            threat=row['threat'],
            likelihood=row['likelihood'],
            impact=row['impact'],
            score=row['score'],
            level=row['level']
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/compliance-hint/{level}")
async def get_hint(level: str):
    """Get compliance hint for a specific risk level"""
    hint = get_compliance_hint(level)
    return {"level": level, "hint": hint}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
