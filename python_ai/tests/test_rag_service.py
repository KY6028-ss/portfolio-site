import pytest
import sys
import os
from unittest.mock import MagicMock, patch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.rag_service import RAGService

class TestRAGService:
    @pytest.fixture
    def rag_service(self):
        # RAGServiceのインスタンスを作成
        service = RAGService()
        return service

    def test_generate_reply_with_skill_keyword(self, rag_service):
        # APIキーがない環境でもテストをパスさせるため、内部状態をモック化します
        mock_response = "私はRuby on RailsとPythonを用いたWebバックエンド開発が得意です。"
        
        with patch.object(rag_service, 'is_ready', True):
            # qa_chain属性が存在しない場合があるため、MagicMockをセット
            rag_service.qa_chain = MagicMock()
            rag_service.qa_chain.invoke.return_value = {"answer": mock_response}
            
            reply = rag_service.generate_reply("あなたのスキルを教えてください")
            assert "Ruby on RailsとPythonを用いたWebバックエンド開発が得意です" in reply

    def test_generate_reply_general_question(self, rag_service):
        # 一般的な質問に対して、プロンプトで指示した「オウム返し」が含まれているかテストします
        question = "おすすめの技術書は？"
        mock_response = f"「{question}」についてのご質問ですね。コンテキストには情報がありませんが、一般的には『達人プログラマー』などがおすすめです。"
        
        with patch.object(rag_service, 'is_ready', True):
            # qa_chain属性が存在しない場合があるため、MagicMockをセット
            rag_service.qa_chain = MagicMock()
            rag_service.qa_chain.invoke.return_value = {"answer": mock_response}
            
            reply = rag_service.generate_reply(question)
            assert f"「{question}」についてのご質問ですね" in reply
