"""
FastAPI application for iRead Customer AI Chat
"""
from fastapi import FastAPI, Request, HTTPException, Depends,Response,Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from openai import OpenAI, RateLimitError
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
import mysql.connector
from pydantic import BaseModel
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta


#JWT
SECRET_KEY = "p9!Xz7@wQ4#vL2$kT8^mN6&bS1*eR3%hJ0+uC5=ZsY8!qW2@tG4#rV6$"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    


#FastAPI
app = FastAPI(
    title="iRead Customer AI Chat",
    description="AI-powered chat application for customer interviews",
    version="1.0.0"
)
load_dotenv() 
def get_db_connection():
   cnx= mysql.connector.connect(
      host="localhost",
      user="root",
      port=3307,
      database="iread"
       # host=os.getenv("MYSQL_HOST"),
       # user=os.getenv("MYSQL_username"),
       # prot=int(os.getenv("MYSQL_PORT")),
       #database=os.getenv("MYSQL_DATABASE")

   )
   return cnx



#API
@app.get("/user")
def get_attraction():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = "SELECT id, email, password FROM customer"
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        cnx.close()

        user=[]
        for row in rows:
            user.append({
                "id": row[0],
                "email": row[1],
                "password": row[2]
            })
        return user
    except mysql.connector.Error as err:
        return JSONResponse(status_code=500, content={"error": str(err)})
    
class User(BaseModel):
    id: int
    email: str
    password: str
@app.post("/user")
def create_user(user: User):
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = "INSERT INTO customer (email, password) VALUES (%s, %s)"
        cursor.execute(query, (user.email, user.password))
        cnx.commit()
        cursor.close()
        cnx.close()
        return {"status": "success", "message": "User created successfully"}
    except mysql.connector.Error as err:
        return JSONResponse(status_code=500, content={"error": str(err)})
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the directory containing main.py
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from key.env
env_path = BASE_DIR / "key.env"
load_dotenv(dotenv_path=env_path)
##




# อนุญาตให้ frontend (React) เรียก API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # หรือระบุ origin ของคุณ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def read_root():
    try:
        # Static welcome message
        welcome_message = "ยินดีต้อนรับสู่ iRead Customer AI Chat! กรุณาเริ่มต้นการสนทนา."
        
        return {
            "status": "success",
            "message": "Welcome to iRead Customer AI Chat",
            "ai_response": welcome_message,
            "endpoints": {
                "chat": "/ask",
                "scope_summary": "/scope-summary"
            },
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/scope-summary")
async def receive_scope_summary(data: dict):
    try:
        logger.info(f"Received scope summary: {data}")
        return {"status": "success", "received": data}
    except Exception as e:
        logger.error(f"Error processing scope summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ask")
async def ai_chat(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
            
        logger.info(f"Processing chat request with {len(messages)} messages")
        
        # Static response logic
        reply = "ขอบคุณสำหรับคำถามค่ะ! นี่คือข้อความตอบกลับแบบคงที่จากระบบ."
        logger.info(f"Generated reply: {reply[:100]}...")  # Log first 100 chars
        
        return {"reply": reply}
        
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
# Define a Pydantic model for user registration data
class UserRegistration(BaseModel):
    email: str
    password: str

@app.post("/auth/register")
def register_user(user: UserRegistration):
    try:
        # Connect to the database
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Check if the email already exists
        query = "SELECT id FROM customer WHERE email = %s"
        cursor.execute(query, (user.email,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            cnx.close()
            raise HTTPException(status_code=400, detail="Email already registered")

        # Insert user data into the database
        query = "INSERT INTO customer (email, password) VALUES (%s, %s)"
        cursor.execute(query, (user.email, user.password))
        cnx.commit()

        # Close the connection
        cursor.close()
        cnx.close()

        return {"status": "success", "message": "User registered successfully"}
    except mysql.connector.Error as err:
        logger.error(f"Database error: {str(err)}")
        return JSONResponse(status_code=500, content={"error": str(err)})
    

# Define a Pydantic model for login data
class LoginData(BaseModel):
    email: str
    password: str

@app.post("/auth/login")
def login_user(login_data: LoginData, response: Response):

    try:
        # Connect to the database
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Query to check if the user exists
        query = "SELECT id,Email, password FROM customer WHERE Email = %s and password = %s"
        cursor.execute(query, (login_data.email,login_data.password))
        user = cursor.fetchone()

        cursor.close()
        cnx.close()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

         # Create JWT token
        token = create_access_token({"user_id": user["id"], "email": user["Email"]})
        # Set token in httpOnly cookie
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            max_age=60*60*24,
            samesite="lax",
            secure=False  # Set True in production with HTTPS
        )

        # Return success response
        return {"status": "success", "message": "Login successful", "user_id": user["id"]}
    except mysql.connector.Error as err:
        logger.error(f"Database error: {str(err)}")
        return JSONResponse(status_code=500, content={"error": str(err)})
    
# JWT utility (ต้องมี SECRET_KEY, ALGORITHM, create_access_token, verify_token)

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = verify_token(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@app.get("/protected-endpoint")
def protected_endpoint(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

@app.post("/auth/logout")
def logout_user(response: Response):
    response.delete_cookie("access_token")
    return {"status": "success", "message": "Logged out"}


default_matrix = {
    "roles": {
        "developer": {
            "junior": {"manday": 0.5, "description": "Junior Developer"},
            "mid": {"manday": 1.0, "description": "Mid-level Developer"},
            "senior": {"manday": 1.5, "description": "Senior Developer"},
        },
        "designer": {
            "junior": {"manday": 0.5, "description": "Junior Designer"},
            "mid": {"manday": 1.0, "description": "Mid-level Designer"},
            "senior": {"manday": 1.5, "description": "Senior Designer"},
        },
        "qa": {
            "junior": {"manday": 0.5, "description": "Junior QA"},
            "mid": {"manday": 1.0, "description": "Mid-level QA"},
            "senior": {"manday": 1.5, "description": "Senior QA"},
        },
    },
    "tasks": {
        "frontend": {
            "basic": {"manday": 1, "description": "Basic Frontend Task"},
            "medium": {"manday": 2, "description": "Medium Frontend Task"},
            "complex": {"manday": 3, "description": "Complex Frontend Task"},
        },
        "backend": {
            "basic": {"manday": 1, "description": "Basic Backend Task"},
            "medium": {"manday": 2, "description": "Medium Backend Task"},
            "complex": {"manday": 3, "description": "Complex Backend Task"},
        },
        "database": {
            "basic": {"manday": 1, "description": "Basic Database Task"},
            "medium": {"manday": 2, "description": "Medium Database Task"},
            "complex": {"manday": 3, "description": "Complex Database Task"},
        },
    },
}

# Store the matrix in memory for simplicity
matrix = default_matrix

@app.get("/manday-matrix")
async def get_manday_matrix():
    return matrix

@app.post("/manday-matrix")
async def update_manday_matrix(new_matrix: dict):
    global matrix
    try:
        matrix = new_matrix
        return {"status": "success", "message": "Matrix updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


