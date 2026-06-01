import pandas as pd


def generate_analytics(file_path):

    # LOAD DATASET

    if file_path.endswith(".csv"):

        df = pd.read_csv(file_path)

    else:

        df = pd.read_excel(file_path)

    # BASIC METRICS

    total_rows = len(df)

    total_columns = len(df.columns)

    missing_values = (
        df.isnull().sum().sum()
    )

    completion_rate = round(

        (
            1
            -
            (
                missing_values
                /
                (total_rows * total_columns)
            )
        )
        * 100,

        2

    )

    # TEXT ANALYSIS

    negative_keywords = [

        "poor",

        "bad",

        "stress",

        "burnout",

        "unhappy",

        "toxic",

        "low",

        "frustrated"

    ]

    negative_count = 0

    text_columns = df.select_dtypes(
        include=["object"]
    ).columns

    for column in text_columns:

        values = (
            df[column]
            .astype(str)
            .str.lower()
        )

        for keyword in negative_keywords:

            negative_count += (
                values.str.contains(
                    keyword,
                    na=False
                )
            ).sum()

    # ENGAGEMENT SCORE

    engagement_score = max(

        0,

        min(

            100,

            100 - (negative_count / 5)

        )

    )

    # RISK LEVEL

    if engagement_score >= 75:

        risk_level = "Low"

    elif engagement_score >= 50:

        risk_level = "Moderate"

    else:

        risk_level = "High"

    # ANALYTICS OUTPUT

    analytics = {

        "total_rows":
            total_rows,

        "total_columns":
            total_columns,

        "completion_rate":
            completion_rate,

        "negative_mentions":
            int(negative_count),

        "engagement_score":
            round(engagement_score),

        "risk_level":
            risk_level,

        "text_columns":
            list(text_columns)

    }

    return analytics