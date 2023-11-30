from fastapi import Depends, APIRouter, HTTPException, status
import anyio
from uuid import uuid4
import datetime
import asyncio
import logging
from collections import OrderedDict
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse
from app.api.deps import get_db
from app.api import crud
from app import schema
from app.chat.messaging import (
    handle_chat_message,
    StreamedMessage,
    StreamedMessageSubProcess,
)
from app.models.db import (
    Message,
    MessageSubProcess,
    MessageRoleEnum,
    MessageStatusEnum,
    MessageSubProcessStatusEnum,
)
from uuid import UUID

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/")
async def create_conversation(
    payload: schema.ConversationCreate,
    db: AsyncSession = Depends(get_db),
) -> schema.Conversation:
    """
    Create a new conversation
    """
    return await crud.create_conversation(db, payload)


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: UUID, db: AsyncSession = Depends(get_db)
) -> schema.Conversation:
    """
    Get a conversation by ID along with its messages and message subprocesses.
    """
    conversation = await crud.fetch_conversation_with_messages(db, str(conversation_id))
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.delete(
    "/{conversation_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
async def delete_conversation(
    conversation_id: UUID, db: AsyncSession = Depends(get_db)
):
    """
    Delete a conversation by ID.
    """
    did_delete = await crud.delete_conversation(db, str(conversation_id))
    if not did_delete:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return


@router.get("/{conversation_id}/test_message")
async def test_message_conversation(
    conversation_id: UUID,
    user_message: str,
    db: AsyncSession = Depends(get_db),
) -> schema.Message:
    """
    Test version of /message endpoint that returns a single message object instead of a SSE stream.
    """
    response: EventSourceResponse = await message_conversation(
        conversation_id, user_message, db
    )
    final_message = None
    async for message in response.body_iterator:
        final_message = message
    if final_message is not None:
        return schema.Message.parse_raw(final_message)
    else:
        raise HTTPException(status_code=500, detail="Internal server error")
