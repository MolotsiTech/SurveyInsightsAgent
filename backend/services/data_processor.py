import pandas as pd

from services.response_profiler import profile_responses


def detect_column_type(column_name, sample_values):

    name = column_name.lower()

    schema_keywords = {
        "department": [
            "department",
            "function",
            "division"
        ],

        "business_unit": [
            "business unit",
            "business_unit"
        ],

        "score": [
            "score",
            "rating",
            "scale"
        ],

        "feedback": [
            "comment",
            "feedback",
            "suggestion"
        ],

        "date": [
            "date",
            "timestamp"
        ]
    }

    # -------------------------
    # NAME-BASED DETECTION
    # -------------------------

    for schema_type, keywords in schema_keywords.items():

        for keyword in keywords:

            if keyword == name:

                return {
                    "type": schema_type,
                    "confidence": 0.98,
                    "source": "exact_name_match"
                }

            elif keyword in name:

                return {
                    "type": schema_type,
                    "confidence": 0.85,
                    "source": "partial_name_match"
                }

    # -------------------------
    # VALUE-BASED DETECTION
    # -------------------------

    values = [str(v).lower() for v in sample_values if pd.notna(v)]

    sample_text = " ".join(values)

    department_words = [
        "finance",
        "hr",
        "operations",
        "mining",
        "legal",
        "marketing"
    ]

    department_matches = 0

    for word in department_words:

        if word in sample_text:
            department_matches += 1

    if department_matches >= 2:

        confidence = min(
            0.70 + (department_matches * 0.05),
            0.90
        )

        return {
            "type": "department",
            "confidence": confidence,
            "source": "value_based_detection"
        }

    return {
        "type": "unknown",
        "confidence": 0.0,
        "source": "no_match"
    }


def normalize_schema(detected_schema):

    normalized = {
        "department_column": None,
        "business_unit_column": None,
        "score_columns": [],
        "feedback_columns": [],
        "date_columns": []
    }

    for column_name, detection in detected_schema.items():

        detected_type = detection["type"]

        if detected_type == "department":
            normalized["department_column"] = column_name

        elif detected_type == "business_unit":
            normalized["business_unit_column"] = column_name

        elif detected_type == "score":
            normalized["score_columns"].append(column_name)

        elif detected_type == "feedback":
            normalized["feedback_columns"].append(column_name)

        elif detected_type == "date":
            normalized["date_columns"].append(column_name)

    return normalized


def process_dataframe(df):

    rows = len(df)

    columns = list(df.columns)

    numeric_columns = list(
        df.select_dtypes(include="number").columns
    )

    text_columns = list(
        df.select_dtypes(include="object").columns
    )

    detected_schema = {}

    response_profiles = {}

    # -------------------------
    # COLUMN ANALYSIS
    # -------------------------

    for col in columns:

        sample_values = (
            df[col]
            .dropna()
            .head(20)
            .tolist()
        )

        detected_schema[col] = detect_column_type(
            col,
            sample_values
        )

        response_profiles[col] = profile_responses(
            sample_values
        )

    normalized_schema = normalize_schema(
        detected_schema
    )

    return {
        "rows": rows,
        "columns": columns,
        "numeric_columns": numeric_columns,
        "text_columns": text_columns,
        "detected_schema": detected_schema,
        "normalized_schema": normalized_schema,
        "response_profiles": response_profiles
    }