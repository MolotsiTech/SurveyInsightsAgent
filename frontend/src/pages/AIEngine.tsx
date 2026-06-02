import { API_URL } from "../api";

import {
    useState,
    useRef,
    useEffect
} from "react";

import axios from "axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = [
    "#86BC25",
    "#5bc0eb",
    "#f25f5c",
    "#ffe066",
    "#9b5de5",
    "#00bbf9"
];

export default function AIEngine() {

    const [question, setQuestion] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [messages, setMessages] =
        useState<any[]>([]);

    const [reportUrl, setReportUrl] =
        useState("");

    const messagesEndRef =
        useRef<any>(null);

    const datasetId =
        localStorage.getItem("dataset_id");

    // -----------------------------------
    // AUTO SCROLL
    // -----------------------------------

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    // -----------------------------------
    // ASK AI
    // -----------------------------------

    const askAI = async () => {

        if (!question.trim()) return;

        if (!datasetId) {

            alert(
                "Please upload a dataset first."
            );

            return;

        }

        const userMessage = {

            type: "user",

            text: question

        };

        setMessages(prev => [

            ...prev,

            userMessage

        ]);

        setLoading(true);

        try {

            const response =
                await axios.post(

                    `${API_URL}/ai-query`,

                    {

                        dataset_id: datasetId,

                        question: question

                    }

                );

            const aiMessage = {

                type: "assistant",

                text:
                    response.data.summary ||
                    response.data.error ||
                    "No response.",

                chart:
                    response.data.chart || null

            };

            setMessages(prev => [

                ...prev,

                aiMessage

            ]);

        } catch (error) {

            console.log(error);

            setMessages(prev => [

                ...prev,

                {

                    type: "assistant",

                    text:
                        "An error occurred while contacting the AI service."

                }

            ]);

        }

        setQuestion("");

        setLoading(false);

    };

    // -----------------------------------
    // GENERATE REPORT
    // -----------------------------------

    const generateReport = async () => {

        if (!datasetId) {

            alert(
                "Please upload a dataset first."
            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await axios.post(

                    `${API_URL}/generate-report`,

                    {

                        dataset_id: datasetId

                    }

                );

            const data =
                response.data;

            if (data.report_path) {

                setReportUrl(

                    `${API_URL}/${data.report_path}`

                );

            } else {

                alert(

                    data.error ||
                    "Report generation failed."

                );

            }

        } catch (error) {

            console.log(error);

            alert(
                "Failed to generate report."
            );

        }

        setLoading(false);

    };

    // -----------------------------------
    // ENTER KEY
    // -----------------------------------

    const handleKeyDown = (e: any) => {

        if (e.key === "Enter") {

            askAI();

        }

    };

    return (

        <div className="page-container">

            {/* HEADER */}

            <div
                style={{
                    marginBottom: "3rem"
                }}
            >

                <h1
                    style={{
                        fontSize: "4rem",
                        marginBottom: "1rem"
                    }}
                >

                    AI Insights Engine

                </h1>

                <p
                    style={{
                        opacity: 0.7,
                        fontSize: "1.2rem"
                    }}
                >

                    Conversational organizational intelligence.

                </p>

            </div>

            {/* ACTIONS */}

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "2rem",
                    flexWrap: "wrap"
                }}
            >

                <button

                    onClick={generateReport}

                    style={{
                        background: "#86BC25",
                        color: "black",
                        border: "none",
                        padding: "1rem 2rem",
                        borderRadius: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem"
                    }}

                >

                    Generate Executive Report

                </button>

                {reportUrl && (

                    <a

                        href={reportUrl}

                        target="_blank"

                        rel="noreferrer"

                        style={{
                            background: "#161616",
                            border: "1px solid #333",
                            color: "white",
                            padding: "1rem 2rem",
                            borderRadius: "14px",
                            textDecoration: "none",
                            fontWeight: "bold"
                        }}

                    >

                        Download Report

                    </a>

                )}

            </div>

            {/* CHAT AREA */}

            <div
                style={{
                    marginBottom: "2rem"
                }}
            >

                {messages.map((message, index) => (

                    <div

                        key={index}

                        style={{
                            display: "flex",
                            justifyContent:
                                message.type === "user"
                                    ? "flex-end"
                                    : "flex-start",
                            marginBottom: "1.5rem"
                        }}

                    >

                        <div

                            style={{
                                background:
                                    message.type === "user"
                                        ? "#86BC25"
                                        : "#161616",

                                color:
                                    message.type === "user"
                                        ? "black"
                                        : "white",

                                padding: "1.5rem",

                                borderRadius: "18px",

                                maxWidth: "900px",

                                width: "fit-content",

                                border:
                                    message.type === "assistant"
                                        ? "1px solid #2a2a2a"
                                        : "none"
                            }}

                        >

                            <div
                                style={{
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.7,
                                    fontSize: "1.05rem"
                                }}
                            >

                                {message.text}

                            </div>

                            {/* BAR CHART */}

                            {

                                message.chart &&
                                message.chart.type === "bar" && (

                                    <div
                                        style={{
                                            width: "700px",
                                            height: "400px",
                                            marginTop: "2rem"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart

                                                data={
                                                    message.chart.labels.map(

                                                        (
                                                            label: string,
                                                            i: number
                                                        ) => ({

                                                            name: label,

                                                            value:
                                                                message.chart.values[i]

                                                        })

                                                    )
                                                }

                                            >

                                                <XAxis dataKey="name" />

                                                <YAxis />

                                                <Tooltip />

                                                <Bar
                                                    dataKey="value"
                                                    fill="#86BC25"
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )

                            }

                            {/* PIE CHART */}

                            {

                                message.chart &&
                                message.chart.type === "pie" && (

                                    <div
                                        style={{
                                            width: "700px",
                                            height: "450px",
                                            marginTop: "2rem"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <PieChart>

                                                <Pie

                                                    data={
                                                        message.chart.labels.map(

                                                            (
                                                                label: string,
                                                                i: number
                                                            ) => ({

                                                                name: label,

                                                                value:
                                                                    message.chart.values[i]

                                                            })

                                                        )
                                                    }

                                                    dataKey="value"

                                                    outerRadius={150}

                                                    label

                                                >

                                                    {

                                                        message.chart.values.map(

                                                            (
                                                                _: any,
                                                                i: number
                                                            ) => (

                                                                <Cell

                                                                    key={i}

                                                                    fill={
                                                                        COLORS[
                                                                            i %
                                                                            COLORS.length
                                                                        ]
                                                                    }

                                                                />

                                                            )

                                                        )

                                                    }

                                                </Pie>

                                                <Tooltip />

                                            </PieChart>

                                        </ResponsiveContainer>

                                    </div>

                                )

                            }

                        </div>

                    </div>

                ))}

                {loading && (

                    <div
                        className="card"
                    >

                        AI is thinking...

                    </div>

                )}

                <div ref={messagesEndRef} />

            </div>

            {/* INPUT */}

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "2rem"
                }}
            >

                <input

                    type="text"

                    value={question}

                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }

                    onKeyDown={handleKeyDown}

                    placeholder="Ask about your data..."

                    style={{
                        flex: 1,
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        background: "#111",
                        color: "white",
                        fontSize: "1rem"
                    }}

                />

                <button

                    onClick={askAI}

                    disabled={loading}

                    style={{
                        background: "#86BC25",
                        color: "black",
                        border: "none",
                        padding: "1rem 2rem",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}

                >

                    Send

                </button>

            </div>

        </div>

    );

}