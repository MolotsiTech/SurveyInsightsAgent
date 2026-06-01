import pandas as pd

# -----------------------------------
# GENERATE AI DASHBOARD
# -----------------------------------

def generate_dashboard(

    df,

    analytics,

    profile

):

    dashboard = {

        "cards": [],

        "charts": [],

        "insights": []

    }

    # -----------------------------------
    # KPI CARDS
    # -----------------------------------

    dashboard["cards"].append({

        "title":
            "Total Records",

        "value":
            analytics.get(
                "total_rows",
                0
            )

    })

    dashboard["cards"].append({

        "title":
            "Dataset Fields",

        "value":
            analytics.get(
                "total_columns",
                0
            )

    })

    dashboard["cards"].append({

        "title":
            "Completion Rate",

        "value":
            f"{analytics.get('completion_rate', 0)}%"

    })

    # -----------------------------------
    # NUMERIC CHARTS
    # -----------------------------------

    numeric_columns = profile.get(
        "numeric_columns",
        []
    )

    for column in numeric_columns[:3]:

        try:

            avg_value = round(

                df[column].mean(),

                2

            )

            dashboard["charts"].append({

                "type":
                    "bar",

                "title":
                    f"{column} Distribution",

                "labels":
                    [column],

                "values":
                    [avg_value]

            })

            dashboard["insights"].append(

                f"Average {column} is {avg_value}"

            )

        except:

            pass

    # -----------------------------------
    # CATEGORICAL CHARTS
    # -----------------------------------

    categorical_columns = profile.get(
        "categorical_columns",
        []
    )

    for column in categorical_columns[:2]:

        try:

            counts = (

                df[column]

                .astype(str)

                .value_counts()

                .head(6)

            )

            dashboard["charts"].append({

                "type":
                    "pie",

                "title":
                    f"{column} Breakdown",

                "labels":
                    counts.index.tolist(),

                "values":
                    counts.values.tolist()

            })

        except:

            pass

    # -----------------------------------
    # TEXT WORD CLOUD
    # -----------------------------------

    text_columns = profile.get(
        "text_columns",
        []
    )

    if text_columns:

        try:

            text_data = " ".join(

                df[text_columns[0]]

                .astype(str)

                .dropna()

                .tolist()

            )

            dashboard["charts"].append({

                "type":
                    "wordcloud",

                "title":
                    f"{text_columns[0]} Themes",

                "text":
                    text_data

            })

        except:

            pass

    # -----------------------------------
    # DATA QUALITY INSIGHTS
    # -----------------------------------

    for issue in profile.get(

        "data_quality_issues",

        []

    ):

        dashboard["insights"].append(issue)

    return dashboard