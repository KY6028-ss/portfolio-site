import os
from pathlib import Path
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Load environment variables from .env file
load_dotenv()

class RAGService:
    """
    RAG (Retrieval-Augmented Generation) Service for Portfolio AI Assistant.
    Built with Python 3.14 + LangChain 1.x + LCEL.
    """
    def __init__(self) -> None:
        self.api_key: Optional[str] = os.getenv("GEMINI_API_KEY")
        
        # Path configuration using Pathlib
        base_dir: Path = Path(__file__).parent.parent
        self.data_path: Path = base_dir / "data" / "portfolio_data.md"
        self.index_dir: Path = base_dir / "faiss_index"

        self.is_ready: bool = False
        self.qa_chain: Any = None
        
        # Initialize only if valid API key is present
        if self.api_key and self.api_key != "dummy_key_for_now":
            self._initialize_rag()
        else:
            print("Warning: GEMINI_API_KEY is not set or invalid. RAG features are disabled.")

    def _initialize_rag(self) -> None:
        """
        Initializes the RAG pipeline including embeddings, vector store, and LCEL chains.
        """
        try:
            # 1. Initialize Embeddings
            embeddings = GoogleGenerativeAIEmbeddings(
                model="gemini-embedding-001", 
                google_api_key=self.api_key
            )
            
            # 2. Load or Create FAISS Index
            if self.index_dir.exists() and (self.index_dir / "index.faiss").exists():
                print(f"Loading existing FAISS index from {self.index_dir}")
                self.vectorstore = FAISS.load_local(
                    folder_path=str(self.index_dir), 
                    embeddings=embeddings, 
                    allow_dangerous_deserialization=True
                )
            else:
                print(f"Creating new FAISS index from {self.data_path}")
                if not self.data_path.exists():
                    raise FileNotFoundError(f"Markdown data not found at: {self.data_path}")
                
                loader = TextLoader(str(self.data_path), encoding="utf-8")
                docs = loader.load()
                
                self.vectorstore = FAISS.from_documents(docs, embeddings)
                
                # Persist index for faster subsequent boots
                self.index_dir.mkdir(parents=True, exist_ok=True)
                self.vectorstore.save_local(folder_path=str(self.index_dir))
                print(f"FAISS index persisted to {self.index_dir}")

            # 3. Initialize LLM (Gemini 2.5 Flash)
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash", 
                temperature=0, 
                google_api_key=self.api_key
            )
            
            # 4. Define Prompt Template (Strictly adhering to requirement 5)
            system_prompt = (
                "あなたはポートフォリオサイトの助手として、誠実に質問に答えてください。"
                "回答の冒頭には、必ずユーザーの質問を引用して「「{input}」についてのご質問ですね」という一文を必ず含めてください。"
                "提供された以下のコンテキスト情報を優先的に使用して回答してください。"
                "コンテキストに直接的な回答がない場合でも、冒頭の引用フレーズは必ず含め、あなたが持っている一般的な知識で回答してください。"
                "\n\n"
                "【コンテキスト】\n"
                "{context}"
            )
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "{input}"),
            ])
            
            # 5. Build pure LCEL Chain
            retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
            
            def format_docs(docs) -> str:
                return "\n\n".join(doc.page_content for doc in docs)
            
            self.qa_chain = (
                {"context": retriever | format_docs, "input": RunnablePassthrough()}
                | prompt
                | llm
                | StrOutputParser()
            )
            
            self.is_ready = True
            print("RAG Service initialized successfully with LCEL pipeline.")
            
        except Exception as e:
            print(f"CRITICAL: Failed to initialize RAG Service: {e}")

    def generate_reply(self, message: str) -> str:
        """
        Generates a reply using the RAG pipeline.
        """
        if not self.is_ready or self.qa_chain is None:
            return (
                "現在AIシステムは調整中です。"
                "（GEMINI_API_KEYの設定と依存関係のビルドを確認してください。）"
            )
            
        try:
            # Use pure LCEL .invoke() pipeline
            answer: str = self.qa_chain.invoke(message)
            return answer
        except Exception as e:
            print(f"Error during reply generation: {e}")
            return f"回答の生成中にエラーが発生しました。しばらく時間をおいて再度お試しください。 (Detail: {str(e)})"
