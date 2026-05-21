import pytest
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
