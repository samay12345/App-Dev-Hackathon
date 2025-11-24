from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import csv
from typing import List
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware


# CREATE A VIRTUAL ENVIRONMENT AND INSTALL THE REQUIRED FASTAPI PACKAGES

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",  
    "http://localhost:3000",   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------
# CSV "Database" Setup
# ---------------------------
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

USERS_CSV = DATA_DIR / "users.csv"
TWEETS_CSV = DATA_DIR / "tweets.csv"

# Ensure CSV files exist with headers
if not USERS_CSV.exists():
    with open(USERS_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["username", "email"])  # Only username and email

if not TWEETS_CSV.exists():
    with open(TWEETS_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["username", "image_link", "description", "likes"])

# ---------------------------
# Models
# ---------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

# ---------------------------
# Helper Functions
# ---------------------------
def read_csv(path: Path) -> List[dict]:
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)

def append_csv(path: Path, row: dict):
    with open(path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        writer.writerow(row)

# ---------------------------
# ROUTES
# ---------------------------
# REGISTER USER
@app.post("/register")
def register_user(data: RegisterRequest):
    users = read_csv(USERS_CSV)

    # Check if username or email already exists
    for u in users:
        if u["username"] == data.username:
            raise HTTPException(status_code=400, detail="Username already exists")
        if u["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    append_csv(USERS_CSV, data.dict())
    return {"message": "User registered successfully"}

# LOGIN USER
@app.post("/login")
def login_user(data: LoginRequest):
    users = read_csv(USERS_CSV)
    user = next((u for u in users if u["username"] == data.username and u["password"] == data.password), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"Login successful for {data.username}"}
