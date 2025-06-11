"""
FastAPI application for iRead Customer AI Chat
"""
from fastapi import FastAPI, Request, HTTPException, Depends
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
    allow_origins=["*"],  # หรือระบุ origin ของคุณ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/scope-summary")
async def receive_scope_summary(data: dict):
    try:
        logger.info(f"Received scope summary: {data}")
        return {"status": "success", "received": data}
    except Exception as e:
        logger.error(f"Error processing scope summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
def login_user(login_data: LoginData):
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

        

        # Return success response
        return {"status": "success", "message": "Login successful", "user_id": user["id"]}
    except mysql.connector.Error as err:
        logger.error(f"Database error: {str(err)}")
        return JSONResponse(status_code=500, content={"error": str(err)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


