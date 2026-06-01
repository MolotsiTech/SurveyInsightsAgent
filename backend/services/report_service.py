from reportlab.platypus import (

    SimpleDocTemplate,

    Paragraph,

    Spacer,

    Image,

    PageBreak

)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from reportlab.lib.pagesizes import letter

from reportlab.platypus.tables import (
    Table,
    TableStyle
)

from reportlab.lib import colors

import matplotlib.pyplot as plt

from wordcloud import WordCloud

import os

import re

# -----------------------------------
# CLEAN AI TEXT
# -----------------------------------

def clean_ai_text(text):

    if not text:

        return ""

    # REMOVE MARKDOWN

    text = re.sub(

        r"\*\*",

        "",

        text

    )

    text = re.sub(

        r"\#",

        "",

        text

    )

    text = re.sub(

        r"`",

        "",

        text

    )

    # CLEAN LINE BREAKS

    text = text.replace(

        "\n",

        "<br/><br/>"

    )

    return text.strip()

# -----------------------------------
# CREATE EXECUTIVE BAR CHART
# -----------------------------------

def create_bar_chart(

    chart_data,

    dataset_id

):

    labels = chart_data.get(
        "labels",
        []
    )

    values = chart_data.get(
        "values",
        []
    )

    # SHORTEN LABELS

    shortened_labels = [

        label[:35] + "..."

        if len(label) > 35

        else label

        for label in labels

    ]

    plt.figure(

        figsize=(10, 6)

    )

    bars = plt.barh(

        shortened_labels,

        values,

        color="#86BC25"

    )

    plt.xlabel("Score")

    plt.title(

        "Executive Organizational Insights",

        fontsize=16,

        fontweight="bold"

    )

    plt.grid(

        axis="x",

        linestyle="--",

        alpha=0.3

    )

    plt.tight_layout()

    # VALUE LABELS

    for bar in bars:

        width = bar.get_width()

        plt.text(

            width + 1,

            bar.get_y() + bar.get_height() / 2,

            str(round(width, 1)),

            va='center'

        )

    image_path = os.path.join(

        "reports",

        f"{dataset_id}_bar_chart.png"

    )

    plt.savefig(

        image_path,

        bbox_inches="tight"

    )

    plt.close()

    return image_path

# -----------------------------------
# CREATE PIE CHART
# -----------------------------------

def create_pie_chart(

    chart_data,

    dataset_id

):

    labels = chart_data.get(
        "labels",
        []
    )

    values = chart_data.get(
        "values",
        []
    )

    shortened_labels = [

        label[:25] + "..."

        if len(label) > 25

        else label

        for label in labels

    ]

    plt.figure(figsize=(7, 7))

    plt.pie(

        values,

        labels=shortened_labels,

        autopct="%1.1f%%"

    )

    plt.title(
        "Survey Distribution"
    )

    image_path = os.path.join(

        "reports",

        f"{dataset_id}_pie_chart.png"

    )

    plt.savefig(

        image_path,

        bbox_inches="tight"

    )

    plt.close()

    return image_path

# -----------------------------------
# CREATE WORD CLOUD
# -----------------------------------

def create_wordcloud(

    themes,

    dataset_id

):

    text = " ".join(themes)

    wordcloud = WordCloud(

        width=1400,

        height=700,

        background_color="white",

        colormap="viridis"

    ).generate(text)

    image_path = os.path.join(

        "reports",

        f"{dataset_id}_wordcloud.png"

    )

    plt.figure(figsize=(12, 6))

    plt.imshow(

        wordcloud,

        interpolation="bilinear"

    )

    plt.axis("off")

    plt.tight_layout()

    plt.savefig(

        image_path,

        bbox_inches="tight"

    )

    plt.close()

    return image_path

# -----------------------------------
# GENERATE REPORT
# -----------------------------------

def generate_report(

    dataset_id,

    analytics,

    ai_summary,

    chart_data,

    qualitative_themes,

    recommendations,

    risks

):

    print("Starting report generation...")

    reports_folder = "reports"

    os.makedirs(

        reports_folder,

        exist_ok=True

    )

    pdf_path = os.path.join(

        reports_folder,

        f"{dataset_id}_report.pdf"

    )

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(

        pdf_path,

        pagesize=letter,

        rightMargin=40,

        leftMargin=40,

        topMargin=40,

        bottomMargin=40

    )

    elements = []

    # -----------------------------------
    # TITLE PAGE
    # -----------------------------------

    title = Paragraph(

        "Executive Organizational Report",

        styles["Title"]

    )

    elements.append(title)

    elements.append(
        Spacer(1, 30)
    )

    # -----------------------------------
    # EXECUTIVE SUMMARY
    # -----------------------------------

    summary_title = Paragraph(

        "Executive Summary",

        styles["Heading1"]

    )

    elements.append(summary_title)

    elements.append(
        Spacer(1, 15)
    )

    elements.append(

        Paragraph(

            clean_ai_text(
                ai_summary
            ),

            styles["BodyText"]

        )

    )

    elements.append(
        Spacer(1, 30)
    )

    # -----------------------------------
    # KPI TABLE
    # -----------------------------------

    kpi_title = Paragraph(

        "Key Organizational Metrics",

        styles["Heading1"]

    )

    elements.append(kpi_title)

    elements.append(
        Spacer(1, 15)
    )

    table_data = [

        ["Metric", "Value"],

        [

            "Total Responses",

            str(
                analytics.get(
                    "total_rows",
                    "-"
                )
            )

        ],

        [

            "Survey Fields",

            str(
                analytics.get(
                    "total_columns",
                    "-"
                )
            )

        ],

        [

            "Completion Rate",

            str(
                analytics.get(
                    "completion_rate",
                    "-"
                )
            ) + "%"

        ],

        [

            "Engagement Score",

            str(
                analytics.get(
                    "engagement_score",
                    "-"
                )
            )

        ],

        [

            "Risk Level",

            str(
                analytics.get(
                    "risk_level",
                    "-"
                )
            )

        ]

    ]

    table = Table(

        table_data,

        colWidths=[220, 120]

    )

    table.setStyle(

        TableStyle([

            (

                "BACKGROUND",

                (0, 0),

                (-1, 0),

                colors.HexColor("#86BC25")

            ),

            (

                "TEXTCOLOR",

                (0, 0),

                (-1, 0),

                colors.black

            ),

            (

                "GRID",

                (0, 0),

                (-1, -1),

                1,

                colors.grey

            ),

            (

                "FONTNAME",

                (0, 0),

                (-1, 0),

                "Helvetica-Bold"

            ),

            (

                "BOTTOMPADDING",

                (0, 0),

                (-1, 0),

                10

            )

        ])

    )

    elements.append(table)

    elements.append(
        Spacer(1, 35)
    )

    # -----------------------------------
    # BAR CHART
    # -----------------------------------

    print("Creating bar chart...")

    bar_chart_path = create_bar_chart(

        chart_data,

        dataset_id

    )

    elements.append(

        Paragraph(

            "Executive Insight Analysis",

            styles["Heading1"]

        )

    )

    elements.append(
        Spacer(1, 15)
    )

    elements.append(

        Image(

            bar_chart_path,

            width=500,

            height=300

        )

    )

    elements.append(
        Spacer(1, 35)
    )

    # -----------------------------------
    # PIE CHART
    # -----------------------------------

    print("Creating pie chart...")

    pie_chart_path = create_pie_chart(

        chart_data,

        dataset_id

    )

    elements.append(

        Paragraph(

            "Distribution Overview",

            styles["Heading1"]

        )

    )

    elements.append(
        Spacer(1, 15)
    )

    elements.append(

        Image(

            pie_chart_path,

            width=420,

            height=420

        )

    )

    elements.append(
        Spacer(1, 35)
    )

    # -----------------------------------
    # QUALITATIVE THEMES
    # -----------------------------------

    themes_title = Paragraph(

        "Qualitative Themes",

        styles["Heading1"]

    )

    elements.append(themes_title)

    elements.append(
        Spacer(1, 15)
    )

    themes_text = "<br/>".join([

        f"• {clean_ai_text(theme)}"

        for theme in qualitative_themes

    ])

    elements.append(

        Paragraph(

            themes_text,

            styles["BodyText"]

        )

    )

    elements.append(
        Spacer(1, 30)
    )

    # -----------------------------------
    # WORD CLOUD
    # -----------------------------------

    print("Creating word cloud...")

    wordcloud_path = create_wordcloud(

        qualitative_themes,

        dataset_id

    )

    elements.append(

        Paragraph(

            "Theme Word Cloud",

            styles["Heading1"]

        )

    )

    elements.append(
        Spacer(1, 15)
    )

    elements.append(

        Image(

            wordcloud_path,

            width=500,

            height=260

        )

    )

    elements.append(
        Spacer(1, 35)
    )

    # -----------------------------------
    # RISKS
    # -----------------------------------

    risk_title = Paragraph(

        "Organizational Risk Analysis",

        styles["Heading1"]

    )

    elements.append(risk_title)

    elements.append(
        Spacer(1, 15)
    )

    risk_text = "<br/>".join([

        f"• {clean_ai_text(risk)}"

        for risk in risks

    ])

    elements.append(

        Paragraph(

            risk_text,

            styles["BodyText"]

        )

    )

    elements.append(
        Spacer(1, 30)
    )

    # -----------------------------------
    # RECOMMENDATIONS
    # -----------------------------------

    recommendation_title = Paragraph(

        "Strategic Recommendations",

        styles["Heading1"]

    )

    elements.append(
        recommendation_title
    )

    elements.append(
        Spacer(1, 15)
    )

    recommendation_text = "<br/>".join([

        f"• {clean_ai_text(recommendation)}"

        for recommendation in recommendations

    ])

    elements.append(

        Paragraph(

            recommendation_text,

            styles["BodyText"]

        )

    )

    # -----------------------------------
    # BUILD PDF
    # -----------------------------------

    print("Building PDF...")

    doc.build(elements)

    print("PDF complete.")

    return pdf_path