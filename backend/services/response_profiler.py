import pandas as pd


def profile_responses(values):

    cleaned = []

    for v in values:

        if pd.notna(v):

            cleaned.append(
                str(v).strip().lower()
            )

    unique_values = list(set(cleaned))

    response_count = len(unique_values)

    # -------------------------
    # DEFAULT PROFILE
    # -------------------------

    profile = {
        "response_type": "unknown",
        "confidence": 0.0,
        "unique_values": unique_values,
        "recommended_processing": None
    }

    # -------------------------
    # BINARY DETECTION
    # -------------------------

    binary_patterns = [
        {"yes", "no"},
        {"true", "false"},
        {"agree", "disagree"}
    ]

    for pattern in binary_patterns:

        if pattern.issubset(set(unique_values)):

            profile["response_type"] = (
                "binary_response"
            )

            profile["confidence"] = 0.90

            profile["recommended_processing"] = (
                "binary_encoding"
            )

            return profile

    # -------------------------
    # ORDINAL SENTIMENT
    # -------------------------

    ordinal_keywords = [
        "strongly agree",
        "agree",
        "neutral",
        "disagree",
        "strongly disagree",
        "fully agree",
        "partially agree",
        "sometimes",
        "never",
        "always"
    ]

    sentiment_matches = 0

    for value in unique_values:

        for keyword in ordinal_keywords:

            if keyword in value:
                sentiment_matches += 1

    if sentiment_matches >= 3:

        confidence = min(
            0.70 + (sentiment_matches * 0.04),
            0.92
        )

        profile["response_type"] = (
            "ordinal_sentiment_scale"
        )

        profile["confidence"] = round(
            confidence,
            2
        )

        profile["recommended_processing"] = (
            "semantic_scale_normalization"
        )

        return profile

    # -------------------------
    # NUMERIC SCALE
    # -------------------------

    numeric_values = []

    for value in unique_values:

        try:
            numeric_values.append(float(value))

        except:
            pass

    if len(numeric_values) >= 3:

        profile["response_type"] = (
            "numeric_scale"
        )

        profile["confidence"] = 0.85

        profile["recommended_processing"] = (
            "numeric_analytics"
        )

        return profile

    # -------------------------
    # OPEN TEXT FEEDBACK
    # -------------------------

    long_text_count = 0

    for value in unique_values:

        if len(value.split()) >= 5:
            long_text_count += 1

    if long_text_count >= 3:

        profile["response_type"] = (
            "open_text_feedback"
        )

        profile["confidence"] = 0.88

        profile["recommended_processing"] = (
            "embeddings_and_sentiment_analysis"
        )

        return profile

    # -------------------------
    # CATEGORICAL
    # -------------------------

    if response_count <= 20:

        profile["response_type"] = (
            "categorical_response"
        )

        profile["confidence"] = 0.65

        profile["recommended_processing"] = (
            "categorical_analysis"
        )

        return profile

    return profile