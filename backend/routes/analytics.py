from fastapi import APIRouter
import os
import json


router = APIRouter()

BASE_STORAGE_PATH = "storage/datasets"


@router.get("/analytics/{dataset_id}")
async def get_analytics(
    dataset_id: str
):

    analytics_path = os.path.join(

        BASE_STORAGE_PATH,

        dataset_id,

        "analytics.json"

    )

    with open(analytics_path, "r") as f:

        analytics = json.load(f)

    return analytics