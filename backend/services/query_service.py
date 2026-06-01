import pandas as pd

# -----------------------------------
# DATAFRAME QUERY ENGINE
# -----------------------------------

def query_dataframe(

    df,

    question

):

    question_lower = question.lower()

    # -----------------------------------
    # TOTAL RESPONSES
    # -----------------------------------

    if (

        "how many" in question_lower

        or

        "total responses" in question_lower

    ):

        return {

            "chart_type":
                "bar",

            "title":
                "Total Responses",

            "labels":
                ["Responses"],

            "values":
                [len(df)]

        }

    # -----------------------------------
    # DEPARTMENT DISTRIBUTION
    # -----------------------------------

    department_col = None

    for col in df.columns:

        if "department" in col.lower():

            department_col = col

            break

    if (

        department_col

        and

        (

            "department" in question_lower

            or

            "team" in question_lower

        )

    ):

        counts = (

            df[department_col]

            .astype(str)

            .value_counts()

            .head(10)

        )

        return {

            "chart_type":
                "bar",

            "title":
                "Department Distribution",

            "labels":
                counts.index.tolist(),

            "values":
                counts.values.tolist()

        }

    # -----------------------------------
    # WORD CLOUD THEMES
    # -----------------------------------

    if (

        "theme" in question_lower

        or

        "word cloud" in question_lower

        or

        "comments" in question_lower

    ):

        text_columns = df.select_dtypes(

            include=["object"]

        )

        combined_text = ""

        for col in text_columns.columns:

            combined_text += (

                " "

                +

                " ".join(

                    text_columns[col]

                    .dropna()

                    .astype(str)

                    .tolist()

                )

            )

        words = combined_text.lower().split()

        stop_words = {

            "the",

            "and",

            "to",

            "of",

            "a",

            "is",

            "in",

            "for",

            "it",

            "that",

            "this"

        }

        filtered = [

            w for w in words

            if len(w) > 3

            and w not in stop_words

        ]

        freq = {}

        for word in filtered:

            freq[word] = (

                freq.get(word, 0)

                + 1

            )

        sorted_words = sorted(

            freq.items(),

            key=lambda x: x[1],

            reverse=True

        )[:15]

        labels = [

            w[0]

            for w in sorted_words

        ]

        values = [

            w[1]

            for w in sorted_words

        ]

        return {

            "chart_type":
                "wordcloud",

            "title":
                "Qualitative Themes",

            "labels":
                labels,

            "values":
                values

        }

    # -----------------------------------
    # FALLBACK
    # -----------------------------------

    return {

        "chart_type":
            "bar",

        "title":
            "Dataset Overview",

        "labels":
            ["Rows", "Columns"],

        "values":
            [

                len(df),

                len(df.columns)

            ]

    }