import os
import json
import uuid


BASE_STORAGE_PATH = "storage/datasets"


def create_dataset_directory():

    dataset_id = str(uuid.uuid4())

    dataset_path = os.path.join(
        BASE_STORAGE_PATH,
        dataset_id
    )

    os.makedirs(dataset_path)

    return dataset_id, dataset_path


def save_uploaded_file(
    file,
    dataset_path
):

    file_path = os.path.join(
        dataset_path,
        file.filename
    )

    with open(file_path, "wb") as f:

        contents = file.file.read()

        f.write(contents)

    return file_path


def save_metadata(
    metadata,
    dataset_path
):

    metadata_path = os.path.join(
        dataset_path,
        "metadata.json"
    )

    with open(metadata_path, "w") as f:

        json.dump(
            metadata,
            f,
            indent=4
        )

    return metadata_path


def save_semantic_chunks(
    chunks,
    dataset_path
):

    chunks_path = os.path.join(
        dataset_path,
        "semantic_chunks.json"
    )

    with open(chunks_path, "w") as f:

        json.dump(
            chunks,
            f,
            indent=4
        )

    return chunks_path


def save_embeddings(
    embeddings,
    dataset_path
):

    embeddings_path = os.path.join(
        dataset_path,
        "embeddings.json"
    )

    with open(embeddings_path, "w") as f:

        json.dump(
            embeddings,
            f
        )

    return embeddings_path


def save_analytics(
    analytics,
    dataset_path
):

    analytics_path = os.path.join(
        dataset_path,
        "analytics.json"
    )

    with open(analytics_path, "w") as f:

        json.dump(
            analytics,
            f,
            indent=4
        )

    return analytics_path