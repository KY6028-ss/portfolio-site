from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from services.rag_service import RAGService

# Global service instance
rag_service = RAGService()

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Handle startup and shutdown events.
    The RAGService is initialized during global scope, 
    but we can add cleanup logic here if needed in the future.
    """
    yield

app = FastAPI(
    title="Portfolio AI Assistant API",
    description="Advanced RAG-based AI Assistant for Portfolio Site (Python 3.14 + LangChain 1.x)",
    version="1.0.0",
    lifespan=lifespan
)

class ChatRequest(BaseModel):
    message: str = Field(..., example="あなたのスキルを教えてください", description="User's question to the AI")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI's response generated via RAG pipeline")

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    status = "ready" if rag_service.is_ready else "initializing"
    return {"status": status}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Primary endpoint for processing user messages.
    Uses the modern RAG pipeline with LCEL.
    """
    try:
        reply = rag_service.generate_reply(request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        # Log the error here in a production environment
        raise HTTPException(
            status_code=500, 
            detail=f"An internal error occurred in the AI service: {str(e)}"
        )
