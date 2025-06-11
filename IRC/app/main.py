"""
FastAPI application for iRead Customer AI Chat
"""
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.security import OAuth2PasswordBearer
from openai import OpenAI, RateLimitError
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
import uvicorn
from app.auth.routes import router as auth_router
from app.auth.utils import verify_token
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the directory containing main.py
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from key.env
env_path = BASE_DIR / "key.env"
load_dotenv(dotenv_path=env_path)

# Get API key and validate
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

try:
    client = OpenAI(api_key=api_key)
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {str(e)}")
    raise

app = FastAPI(
    title="iRead Customer AI Chat",
    description="AI-powered chat application for customer interviews",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",  # Vite dev server alternative
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",  # React dev server alternative
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include authentication routes
app.include_router(auth_router)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)

@app.get("/favicon.ico")
async def favicon():
    return FileResponse(
        path=BASE_DIR / "static" / "favicon.ico",
        media_type="image/x-icon"
    )

@app.get("/scope-summary")
@app.post("/scope-summary")
async def receive_scope_summary(data: dict = None, current_user = Depends(get_current_user)):
    try:
        if data is None:
            return {"status": "success", "message": "Scope summary endpoint is ready"}
        logger.info(f"Received scope summary: {data}")
        return {"status": "success", "received": data}
    except Exception as e:
        logger.error(f"Error processing scope summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    try:
        # สร้าง welcome message จาก AI
        welcome_messages = [
            {"role": "system", "content": "คุณคือ AI ที่ช่วยสัมภาษณ์เพื่อเก็บ Scope งาน"},
            {"role": "user", "content": "สวัสดี"},
        ]
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=welcome_messages,
                max_tokens=150,
                temperature=0.7,
            )
            welcome_message = response.choices[0].message.content
        except RateLimitError:
            welcome_message = "ขออภัยค่ะ ขณะนี้ระบบกำลังประสบปัญหาในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้งในภายหลัง"
            logger.warning("OpenAI API rate limit exceeded")
        except Exception as e:
            welcome_message = "ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง"
            logger.error(f"Error in OpenAI API call: {str(e)}")
        
        return {
            "status": "success",
            "message": "Welcome to iRead Customer AI Chat",
            "ai_response": welcome_message,
            "endpoints": {
                "chat": "/ai-chat",
                "scope_summary": "/scope-summary"
            },
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai-chat")
@app.post("/ai-chat")
async def ai_chat(request: Request, current_user = Depends(get_current_user)):
    try:
        if request.method == "GET":
            return {"status": "success", "message": "AI chat endpoint is ready"}
            
        data = await request.json()
        messages = data.get("messages", [])
        
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
            
        logger.info(f"Processing chat request with {len(messages)} messages")
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=300,
                temperature=0.7,
            )
            reply = response.choices[0].message.content
        except RateLimitError:
            logger.warning("OpenAI API rate limit exceeded")
            return JSONResponse(
                status_code=429,
                content={"error": "OpenAI API rate limit exceeded. Please try again later."}
            )
        except Exception as e:
            logger.error(f"Error in OpenAI API call: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"error": "Error connecting to OpenAI API. Please try again later."}
            )
        
        logger.info(f"Generated reply: {reply[:100]}...")  # Log first 100 chars
        return {"reply": reply}
        
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Store manday matrix in memory (replace with database in production)
manday_matrix = {
    "roles": {
        "developer": {
            "junior": {"manday": 0.5, "description": "Junior Developer"},
            "mid": {"manday": 1.0, "description": "Mid-level Developer"},
            "senior": {"manday": 1.5, "description": "Senior Developer"}
        },
        "designer": {
            "junior": {"manday": 0.5, "description": "Junior Designer"},
            "mid": {"manday": 1.0, "description": "Mid-level Designer"},
            "senior": {"manday": 1.5, "description": "Senior Designer"}
        },
        "qa": {
            "junior": {"manday": 0.5, "description": "Junior QA"},
            "mid": {"manday": 1.0, "description": "Mid-level QA"},
            "senior": {"manday": 1.5, "description": "Senior QA"}
        }
    },
    "tasks": {
        "frontend": {
            "basic": {"manday": 1, "description": "Basic Frontend Task"},
            "medium": {"manday": 2, "description": "Medium Frontend Task"},
            "complex": {"manday": 3, "description": "Complex Frontend Task"}
        },
        "backend": {
            "basic": {"manday": 1, "description": "Basic Backend Task"},
            "medium": {"manday": 2, "description": "Medium Backend Task"},
            "complex": {"manday": 3, "description": "Complex Backend Task"}
        },
        "database": {
            "basic": {"manday": 1, "description": "Basic Database Task"},
            "medium": {"manday": 2, "description": "Medium Database Task"},
            "complex": {"manday": 3, "description": "Complex Database Task"}
        }
    }
}

@app.get("/manday-matrix")
async def get_manday_matrix(current_user: Dict[str, Any] = Depends(verify_token)):
    return manday_matrix

@app.post("/manday-matrix")
async def update_manday_matrix(
    matrix: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(verify_token)
):
    global manday_matrix
    manday_matrix = matrix
    return {"message": "Matrix updated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 