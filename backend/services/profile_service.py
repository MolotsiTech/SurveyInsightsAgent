import pandas as pd

# -----------------------------------
# PROFILE DATASET
# -----------------------------------

def profile_dataset(df):

    profile = {

        "numeric_columns": [],

        "categorical_columns": [],

        "text_columns": [],

        "date_columns": [],

        "recommended_charts": [],

        "possible_questions": [],

        "data_quality_issues": []

    }

    # -----------------------------------
    # COLUMN DETECTION
    # -----------------------------------

    for column in df.columns:

        dtype = str(df[column].dtype)

        unique_count = df[column].nunique()

        # NUMERIC

        if "int" in dtype or "float" in dtype:

            profile["numeric_columns"].append(column)

        # DATE

        elif "date" in dtype:

            profile["date_columns"].append(column)

        # TEXT / CATEGORICAL

        else:

            avg_length = (

                df[column]

                .astype(str)

                .str.len()

                .mean()

            )

            if avg_length > 40:

                profile["text_columns"].append(column)

            else:

                profile["categorical_columns"].append(column)

        # -----------------------------------
        # DATA QUALITY
        # -----------------------------------

        missing = df[column].isnull().sum()

        if missing > 0:

            profile[
                "data_quality_issues"
            ].append(

                f"{column} has {missing} missing values"

            )

    # -----------------------------------
    # RECOMMENDED CHARTS
    # -----------------------------------

    if len(profile["numeric_columns"]) >= 1:

        profile["recommended_charts"].append(

            "bar_chart"

        )

        profile["recommended_charts"].append(

            "line_chart"

        )

    if len(profile["categorical_columns"]) >= 1:

        profile["recommended_charts"].append(

            "pie_chart"

        )

    if len(profile["text_columns"]) >= 1:

        profile["recommended_charts"].append(

            "wordcloud"

        )

    # -----------------------------------
    # POSSIBLE QUESTIONS
    # -----------------------------------

    for column in profile["numeric_columns"]:

        profile["possible_questions"].append(

            f"What are the trends in {column}?"

        )

    for column in profile["categorical_columns"]:

        profile["possible_questions"].append(

            f"Show distribution of {column}"

        )

    for column in profile["text_columns"]:

        profile["possible_questions"].append(

            f"What themes appear in {column}?"

        )

    return profile