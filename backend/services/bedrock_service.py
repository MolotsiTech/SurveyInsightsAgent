import boto3
import json

# -----------------------------------
# BEDROCK CLIENT
# -----------------------------------

client = boto3.client(

    "bedrock-runtime",

    region_name="us-east-1"

)

# -----------------------------------
# MODEL
# -----------------------------------

MODEL_ID = "YOUR_INFERENCE_PROFILE_ARN"

# -----------------------------------
# ASK CLAUDE
# -----------------------------------

def ask_claude(

    question,

    context,

    analytics

):

    prompt = f"""

You are an enterprise analytics AI.

Analyze survey data intelligently.

Return ONLY valid JSON.

DO NOT include markdown.

-----------------------------------
DATASET ANALYTICS
-----------------------------------

{json.dumps(analytics, indent=2)}

-----------------------------------
REAL DATA QUERY RESULTS
-----------------------------------

{context}

-----------------------------------
QUESTION
-----------------------------------

{question}

-----------------------------------
RESPONSE FORMAT
-----------------------------------

{{
    "summary": "...",

    "chart": {{

        "type": "bar | pie | line | scatter | wordcloud",

        "title": "...",

        "labels": ["A", "B", "C"],

        "values": [12, 44, 88]

    }}

}}

"""

    body = {

        "anthropic_version":
            "bedrock-2023-05-31",

        "max_tokens": 1200,

        "messages": [

            {

                "role": "user",

                "content": prompt

            }

        ]

    }

    response = client.invoke_model(

        modelId="arn:aws:bedrock:us-east-1:303767824861:application-inference-profile/ra0mv3ze3tws",

        body=json.dumps(body)

    )

    response_body = json.loads(

        response["body"].read()

    )

    raw_text = (
        response_body["content"][0]["text"]
    )

    cleaned = raw_text.replace(

        "```json",

        ""

    ).replace(

        "```",

        ""

    ).strip()

    try:

        parsed = json.loads(cleaned)

        return parsed

    except Exception as e:

        print(e)

        print(cleaned)

        return {

            "summary": cleaned,

            "chart": None

        }