import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        # MVP用のダミードキュメント
        dummy_docs = [
            Document(page_content="私はRuby on RailsとPythonを用いたWebバックエンド開発が得意です。最近はFastAPIやLLMの組み込みにも注力しています。"),
            Document(page_content="趣味は個人開発と、新しい技術のキャッチアップです。"),
            Document(page_content="過去のプロジェクトでは、Eコマースサイトの決済基盤のリプレイスを担当しました。")
        ]

        self.is_ready = False
        if self.api_key and self.api_key != "dummy_key_for_now":
            try:
                embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", google_api_key=self.api_key)
                self.vectorstore = FAISS.from_documents(dummy_docs, embeddings)
                
                # ご指定いただいた「Gemini Flash」モデルを使用します
                # ※現在利用可能な最新のFlashモデル（gemini-1.5-flash等）にフォールバックされる場合があります
                self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0, google_api_key=self.api_key)
                
                self.qa_chain = RetrievalQA.from_chain_type(
                    llm=self.llm,
                    chain_type="stuff",
                    retriever=self.vectorstore.as_retriever()
                )
                self.is_ready = True
            except Exception as e:
                print(f"Failed to initialize RAG: {e}")
        else:
            print("Warning: GEMINI_API_KEY is not set or invalid. AI responses will fail.")

    def generate_reply(self, message: str) -> str:
        if not self.is_ready:
            return "現在AIシステムは調整中です。（GEMINI_API_KEYが設定されていない可能性があります。 python_ai/.env ファイルにGEMINI_API_KEYを設定してください。）"
            
        try:
            response = self.qa_chain.run(message)
            return response
        except Exception as e:
            print(f"Error generating reply: {e}")
            return f"回答の生成中にエラーが発生しました: {str(e)}"
