import os

files = {
    "python_ai/requirements.txt": """fastapi==0.104.1
uvicorn==0.23.2
pydantic==2.4.2
langchain==0.0.335
openai==0.28.1
pytest==7.4.3
httpx==0.25.1""",
    "python_ai/app/__init__.py": "",
    "python_ai/services/__init__.py": "",
    "python_ai/tests/__init__.py": "",
    "python_ai/app/main.py": """from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.rag_service import RAGService

app = FastAPI(title="Portfolio AI Assistant API")
rag_service = RAGService()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        reply = rag_service.generate_reply(request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
""",
    "python_ai/services/rag_service.py": """import os

class RAGService:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

    def generate_reply(self, message: str) -> str:
        if "スキル" in message or "できること" in message:
            return "私はRuby on RailsとPythonを用いたWebバックエンド開発が得意です。最近はFastAPIやLLMの組み込みにも注力しています！"
        return f"「{message}」についてのご質問ですね。現在、私のブログ記事やプロフィールから関連する回答を探しています..."
""",
    "python_ai/tests/test_rag_service.py": """import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.rag_service import RAGService

class TestRAGService:
    @pytest.fixture
    def rag_service(self):
        return RAGService()

    def test_generate_reply_with_skill_keyword(self, rag_service):
        reply = rag_service.generate_reply("あなたのスキルを教えてください")
        assert "Ruby on RailsとPythonを用いたWebバックエンド開発が得意です" in reply

    def test_generate_reply_general_question(self, rag_service):
        reply = rag_service.generate_reply("おすすめの技術書は？")
        assert "「おすすめの技術書は？」についてのご質問ですね" in reply
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
print("Python AI files generated successfully.")