from fastapi import APIRouter, UploadFile, File
import pandas as pd

from services.data_processor import process_dataframe

from services.analytics_service import (
    generate_analytics
)

from services.embedding_service import (
    create_semantic_chunks,
    generate_chunk_embeddings
)

from services.dataset_storage import (
    create_dataset_directory,
    save_uploaded_file,
    save_metadata,
    save_semantic_chunks,
    save_embeddings,
    save_analytics
)

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    # -------------------------
    # CREATE DATASET STORAGE
    # -------------------------

    dataset_id, dataset_path = (
        create_dataset_directory()
    )

    # -------------------------
    # SAVE ORIGINAL FILE
    # -------------------------

    saved_file_path = save_uploaded_file(
        file,
        dataset_path
    )

    # -------------------------
    # LOAD DATAFRAME
    # -------------------------

    if file.filename.endswith(".csv"):

        df = pd.read_csv(saved_file_path)

    else:

        df = pd.read_excel(saved_file_path)

    # -------------------------
    # PROCESS DATASET
    # -------------------------

    metadata = process_dataframe(df)

    normalized_schema = metadata[
        "normalized_schema"
    ]

    # -------------------------
    # GENERATE ANALYTICS
    # -------------------------

    analytics = generate_analytics(
        df,
        metadata
    )

    # -------------------------
    # CREATE SEMANTIC CHUNKS
    # -------------------------

    semantic_chunks = create_semantic_chunks(
        df,
        normalized_schema
    )

    # -------------------------
    # GENERATE EMBEDDINGS
    # -------------------------

    embedded_chunks = (
        generate_chunk_embeddings(
            semantic_chunks
        )
    )

    # -------------------------
    # SAVE METADATA
    # -------------------------

    save_metadata(
        metadata,
        dataset_path
    )

    # -------------------------
    # SAVE ANALYTICS
    # -------------------------

    save_analytics(
        analytics,
        dataset_path
    )

    # -------------------------
    # SAVE CHUNKS
    # -------------------------

    save_semantic_chunks(
        semantic_chunks,
        dataset_path
    )

    # -------------------------
    # SAVE EMBEDDINGS
    # -------------------------

    save_embeddings(
        embedded_chunks,
        dataset_path
    )

    return {

        "dataset_id": dataset_id,

        "stored_file": saved_file_path,

        "chunk_count": len(
            semantic_chunks
        ),

        "embedding_count": len(
            embedded_chunks
        ),

        "analytics": analytics,

        "metadata": metadata
    }