import json

from services.bedrock_service import (
    ask_claude
)

# -----------------------------------
# GENERATE SEMANTIC MAPPING
# -----------------------------------

def generate_semantic_schema(

    df

):

    # -----------------------------------
    # COLUMN NAMES
    # -----------------------------------

    columns = df.columns.tolist()

    # -----------------------------------
    # SAMPLE VALUES
    # -----------------------------------

    sample_data = {}

    for column in columns:

        try:

            sample_values = (

                df[column]

                .dropna()

                .astype(str)

                .unique()

                .tolist()[:5]

            )

            sample_data[column] = sample_values

        except:

            sample_data[column] = []

    # -----------------------------------
    # AI PROMPT
    # -----------------------------------

    prompt = f"""

You are an enterprise AI analytics engine.

Analyze this dataset schema and infer the BUSINESS meaning of the columns.

Dataset Columns:

{json.dumps(sample_data, indent=2)}

Return ONLY valid JSON.

Required structure:

{{
    "organizational_dimensions": [],
    "time_dimensions": [],
    "rating_metrics": [],
    "categorical_dimensions": [],
    "qualitative_fields": [],
    "demographic_dimensions": [],
    "financial_metrics": [],
    "operational_metrics": [],
    "recommended_primary_kpis": [],
    "executive_focus_areas": []
}}

Rules:

- organizational_dimensions:
Columns representing business units,
departments, regions, teams,
or organizational structure.

- time_dimensions:
Dates, periods, years,
months, quarters.

- rating_metrics:
Scores, ratings,
survey scales,
sentiment scores.

- categorical_dimensions:
General groupings/categories.

- qualitative_fields:
Open-ended text,
comments,
feedback,
responses.

- demographic_dimensions:
Gender, age,
tenure,
level,
role,
location.

- financial_metrics:
Revenue, cost,
profit,
budget,
financial KPIs.

- operational_metrics:
Operational performance,
delivery,
production,
efficiency metrics.

- recommended_primary_kpis:
Most important metrics executives
should focus on.

- executive_focus_areas:
Main business themes executives
should monitor.

IMPORTANT:
Return JSON ONLY.
No markdown.
No explanations.

"""

    # -----------------------------------
    # ASK CLAUDE
    # -----------------------------------

    response = ask_claude(

        prompt,

        str(sample_data),

        {}

    )

    # -----------------------------------
    # PARSE JSON
    # -----------------------------------

    try:

        semantic_schema = json.loads(

            response.get(
                "summary",
                "{}"
            )

        )

    except Exception as e:

        print("SEMANTIC PARSE ERROR")

        print(e)

        semantic_schema = {

            "organizational_dimensions": [],

            "time_dimensions": [],

            "rating_metrics": [],

            "categorical_dimensions": [],

            "qualitative_fields": [],

            "demographic_dimensions": [],

            "financial_metrics": [],

            "operational_metrics": [],

            "recommended_primary_kpis": [],

            "executive_focus_areas": []

        }

    return semantic_schema