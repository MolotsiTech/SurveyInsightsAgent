from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import uuid
import shutil
import os
import pandas as pd

from services.analytics_service import (
    generate_analytics
)

from services.bedrock_service import (
    ask_claude
)

from services.query_service import (
    query_dataframe
)

from services.report_service import (
    generate_report
)

from services.profile_service import (
    profile_dataset
)

from services.dashboard_service import (
    generate_dashboard
)

from services.semantic_service import (
    generate_semantic_schema
)

app = FastAPI()

# -----------------------------------
# CREATE FOLDERS
# -----------------------------------

os.makedirs(

    "reports",

    exist_ok=True

)

os.makedirs(

    "uploads",

    exist_ok=True

)

# -----------------------------------
# STATIC REPORTS
# -----------------------------------

app.mount(

    "/reports",

    StaticFiles(directory="reports"),

    name="reports"

)

# -----------------------------------
# CORS
# -----------------------------------

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)

# -----------------------------------
# STORAGE
# -----------------------------------

UPLOAD_FOLDER = "uploads"

datasets = {}

conversation_history = {}

# -----------------------------------
# ROOT
# -----------------------------------

@app.get("/")

def root():

    return {

        "message":
            "Survey Insights API Running"

    }

# -----------------------------------
# UPLOAD ENDPOINT
# -----------------------------------

@app.post("/upload")

async def upload_file(

    file: UploadFile = File(...)

):

    dataset_id = str(uuid.uuid4())

    file_path = os.path.join(

        UPLOAD_FOLDER,

        f"{dataset_id}_{file.filename}"

    )

    # -----------------------------------
    # SAVE FILE
    # -----------------------------------

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )

    # -----------------------------------
    # LOAD DATAFRAME
    # -----------------------------------

    try:

        if file.filename.endswith(".csv"):

            df = pd.read_csv(file_path)

        else:

            df = pd.read_excel(file_path)

    except Exception as e:

        print(e)

        return {

            "error":
                "Could not process file"

        }

    # -----------------------------------
    # ANALYTICS
    # -----------------------------------

    analytics = generate_analytics(
        file_path
    )

    # -----------------------------------
    # PROFILE DATASET
    # -----------------------------------

    dataset_profile = profile_dataset(
        df
    )

    # -----------------------------------
    # SEMANTIC SCHEMA
    # -----------------------------------

    semantic_schema = generate_semantic_schema(
    df
    )

    # -----------------------------------
    # GENERATE DASHBOARD
    # -----------------------------------

    dashboard = generate_dashboard(

        df,

        analytics,

        dataset_profile

    )

    # -----------------------------------
    # STORE DATASET
    # -----------------------------------

    datasets[dataset_id] = {

        "file_path":
            file_path,

        "analytics":
            analytics,

        "dataframe":
            df,

        "profile":
            dataset_profile,

	"semantic_schema":
   	    semantic_schema,

        "dashboard":
            dashboard

    }

    return {

        "dataset_id":
            dataset_id,

        "analytics":
            analytics,

        "profile":
            dataset_profile,

        "dashboard":
            dashboard

    }

# -----------------------------------
# ANALYTICS ENDPOINT
# -----------------------------------

@app.get("/analytics/{dataset_id}")

def get_analytics(

    dataset_id: str

):

    dataset = datasets.get(
        dataset_id
    )

    if not dataset:

        return {

            "error":
                "Dataset not found"

        }

    return dataset["analytics"]

# -----------------------------------
# DASHBOARD ENDPOINT
# -----------------------------------

@app.get("/dashboard/{dataset_id}")

def get_dashboard(

    dataset_id: str

):

    dataset = datasets.get(
        dataset_id
    )

    if not dataset:

        return {

            "error":
                "Dataset not found"

        }

    return dataset.get(
        "dashboard",
        {}
    )

# -----------------------------------
# AI QUERY ENDPOINT
# -----------------------------------

@app.post("/ai-query")

async def ai_query(

    payload: dict

):

    dataset_id = payload.get(
        "dataset_id"
    )

    question = payload.get(
        "question"
    )

    dataset = datasets.get(
        dataset_id
    )

    if not dataset:

        return {

            "error":
                "Dataset not found"

        }

    analytics = dataset["analytics"]

    df = dataset["dataframe"]

    profile = dataset["profile"]

    # -----------------------------------
    # QUERY DATAFRAME
    # -----------------------------------

    query_result = query_dataframe(

        df,

        question

    )

    # -----------------------------------
    # MEMORY
    # -----------------------------------

    history = conversation_history.get(

        dataset_id,

        []

    )

    conversation_text = ""

    for item in history:

        conversation_text += (

            f"User: {item['question']}\n"

            f"Assistant: {item['answer']}\n\n"

        )

    # -----------------------------------
    # AI QUESTION
    # -----------------------------------

    full_question = f"""

Dataset Profile:

{profile}

Conversation History:

{conversation_text}

Current User Question:

{question}

Real Data Query Result:

{query_result}

"""

    # -----------------------------------
    # ASK CLAUDE
    # -----------------------------------

    answer = ask_claude(

        full_question,

        str(query_result),

        analytics

    )

    # -----------------------------------
    # SAVE MEMORY
    # -----------------------------------

    history.append({

        "question":
            question,

        "answer":
            answer.get(
                "summary",
                ""
            )

    })

    conversation_history[
        dataset_id
    ] = history[-10:]

    return answer

# -----------------------------------
# GENERATE REPORT
# -----------------------------------

@app.post("/generate-report")

async def generate_executive_report(

    payload: dict

):

    dataset_id = payload.get(
        "dataset_id"
    )

    dataset = datasets.get(
        dataset_id
    )

    if not dataset:

        return {

            "error":
                "Dataset not found"

        }

    analytics = dataset["analytics"]

    dataframe = dataset["dataframe"]

    # -----------------------------------
    # SAMPLE DATA
    # -----------------------------------

    sample_data = dataframe.head(
        20
    ).to_string()

    # -----------------------------------
    # EXECUTIVE SUMMARY
    # -----------------------------------

    summary_response = ask_claude(

        """

        Generate an executive summary
        for this organizational dataset.

        Focus on:
        - engagement
        - leadership
        - organizational culture
        - communication
        - employee sentiment
        - workforce risks

        Keep it professional.

        """

        ,

        sample_data,

        analytics

    )

    # -----------------------------------
    # THEMES
    # -----------------------------------

    themes_response = ask_claude(

        """

        Extract the most important
        qualitative themes.

        Return ONLY comma-separated
        themes.

        """

        ,

        sample_data,

        analytics

    )

    qualitative_themes = [

        theme.strip()

        for theme in

        themes_response.get(
            "summary",
            ""
        ).split(",")

        if theme.strip()

    ]

    # -----------------------------------
    # RECOMMENDATIONS
    # -----------------------------------

    recommendations_response = ask_claude(

        """

        Generate strategic
        organizational recommendations.

        Return ONLY comma-separated
        recommendations.

        """

        ,

        sample_data,

        analytics

    )

    recommendations = [

        recommendation.strip()

        for recommendation in

        recommendations_response.get(
            "summary",
            ""
        ).split(",")

        if recommendation.strip()

    ]

    # -----------------------------------
    # RISKS
    # -----------------------------------

    risks_response = ask_claude(

        """

        Identify organizational risks.

        Return ONLY comma-separated
        risks.

        """

        ,

        sample_data,

        analytics

    )

    risks = [

        risk.strip()

        for risk in

        risks_response.get(
            "summary",
            ""
        ).split(",")

        if risk.strip()

    ]

    # -----------------------------------
    # CHART DATA
    # -----------------------------------

    chart_response = ask_claude(

        """

        Generate executive chart data.

        Return valid JSON only.

        """

        ,

        sample_data,

        analytics

    )

    chart_data = chart_response.get(
        "chart",
        {}
    )

    # -----------------------------------
    # GENERATE PDF
    # -----------------------------------

    try:

        print("Starting report generation...")

        pdf_path = generate_report(

            dataset_id,

            analytics,

            summary_response.get(
                "summary",
                ""
            ),

            chart_data,

            qualitative_themes,

            recommendations,

            risks

        )

        print("Report generated successfully")

    except Exception as e:

        print("REPORT ERROR:")

        print(e)

        return {

            "error":
                str(e)

        }

    return {

        "message":
            "Executive report generated",

        "report_path":
            pdf_path

    }