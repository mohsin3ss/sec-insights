"""
API routes.

These routes are protected by auth. These require valid Auth0 token
to access them.
"""
from fastapi import APIRouter, Depends

from app.api.endpoints import chat, conversation, health, documents
from app.auth.utils import VerifyToken

auth = VerifyToken()

api_router = APIRouter()
api_router.include_router(
    chat.router, prefix="/chat", tags=["chat"],
)
api_router.include_router(
    conversation.router, prefix="/conversation", tags=["conversation"], dependencies=[Depends(auth.verify)]
)
api_router.include_router(
    documents.router, prefix="/document", tags=["document"], dependencies=[Depends(auth.verify)]
)
api_router.include_router(health.router, prefix="/health", tags=["health"])
