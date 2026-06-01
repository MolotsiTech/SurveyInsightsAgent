from fastapi import APIRouter
from pydantic import BaseModel

from services.query_service import (
    semantic_search
)

from services.bedrock_service import (
    ask_claude
)

router = APIRouter()


class AIQueryRequest(BaseModel):

    dataset_id: str

    question: str


@router.post("/ai-query")
async def ai_query(
    request: AIQueryRequest
):

    # -------------------------
    # RETRIEVE SEMANTIC CONTEXT
    # -------------------------

    results = semantic_search(

        request.dataset_id,

        request.question,

        top_k=5

    )

    context = "\n\n".join(

        [
            item["chunk"]

            for item in results
        ]

    )

    # -------------------------
    # BUILD PROMPT
    # -------------------------

    prompt = f"""

You are an AI survey analyst.

Use the survey context below
to answer the business question.

SURVEY CONTEXT:
{context}

QUESTION:
{request.question}

Provide a concise,
professional business insight.

"""

    # -------------------------
    # ASK CLAUDE
    # -------------------------

    answer = ask_claude(prompt)

    return {

        "question": request.question,

        "answer": answer,

        "retrieved_context": results

    }