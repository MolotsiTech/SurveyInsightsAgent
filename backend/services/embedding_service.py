import pandas as pd

from services.embedding_model import (
    generate_embedding
)


def create_semantic_chunks(
    df,
    normalized_schema
):

    chunks = []

    department_column = (
        normalized_schema.get(
            "department_column"
        )
    )

    score_columns = (
        normalized_schema.get(
            "score_columns",
            []
        )
    )

    feedback_columns = (
        normalized_schema.get(
            "feedback_columns",
            []
        )
    )

    # -------------------------
    # PROCESS EACH ROW
    # -------------------------

    for _, row in df.iterrows():

        chunk_parts = []

        # -------------------------
        # DEPARTMENT CONTEXT
        # -------------------------

        if department_column:

            department_value = row.get(
                department_column
            )

            if pd.notna(department_value):

                chunk_parts.append(
                    f"Department: {department_value}"
                )

        # -------------------------
        # SCORE CONTEXT
        # -------------------------

        for score_col in score_columns:

            value = row.get(score_col)

            if pd.notna(value):

                chunk_parts.append(
                    f"{score_col}: {value}"
                )

        # -------------------------
        # FEEDBACK CONTEXT
        # -------------------------

        for feedback_col in feedback_columns:

            value = row.get(feedback_col)

            if pd.notna(value):

                chunk_parts.append(
                    f"{feedback_col}: {value}"
                )

        # -------------------------
        # FINAL CHUNK
        # -------------------------

        if len(chunk_parts) > 0:

            chunk_text = " | ".join(
                chunk_parts
            )

            chunks.append(chunk_text)

    return chunks


def generate_chunk_embeddings(
    chunks
):

    embedded_chunks = []

    for chunk in chunks:

        embedding = generate_embedding(
            chunk
        )

        embedded_chunks.append({

            "text": chunk,

            "embedding": embedding

        })

    return embedded_chunks