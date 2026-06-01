from fastapi import APIRouter
from pydantic import BaseModel

from services.query_service import (
    semantic_search
)

router = APIRouter()


class QueryRequest(BaseModel):

    dataset_id: str

    question: str


@router.post("/query")
async def query_dataset(
    request: QueryRequest
):

    results = semantic_search(

        request.dataset_id,

        request.question

    )

    return {

        "dataset_id": request.dataset_id,

        "question": request.question,

        "results": results

    }