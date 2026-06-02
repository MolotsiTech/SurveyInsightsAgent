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

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<any[]>([]);

    const [reportUrl, setReportUrl] = useState("");

    const messagesEndRef = useRef<any>(null);

    const datasetId = localStorage.getItem("dataset_id");

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

            alert("Please upload a dataset first.");

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

            const response = await axios.post(

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
                    text: "An error occurred while contacting the AI service."
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

            alert("Please upload a dataset first.");

            return;

        }

        try {

            setLoading(true);

            const response = await axios.post(

                `${API_URL}/generate-report`,

                {
                    dataset_id: datasetId
                }

            );

            const data = response.data;

            if (data.report_path) {

                setReportUrl(
                    `${API_URL}/${data.report_path}`
                );

            } else {

                alert(
                    data.error || "Report generation failed."
                );

            }

        } catch (error) {

            console.log(error);

            alert("Failed to generate report.");

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

        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* HEADER */}

            <div className="px-12 pt-12 pb-6 border-b border-[#1f1f1f]">

                <h1 className="text-5xl font-bold mb-3">

                    AI Insights Engine

                </h1>

                <p className="text-gray-400 text-lg">

                    Conversational organizational intelligence.

                </p>

            </div>

            {/* ACTIONS */}

            <div className="px-12 py-6 flex gap-4 flex-wrap">

                <button

                    onClick={generateReport}

                    className="bg-[#86BC25] text-black px-6 py-4 rounded-2xl font-bold"

                >

                    Generate Executive Report

                </button>

                {reportUrl && (

                    <a

                        href={reportUrl}

                        target="_blank"

                        rel="noreferrer"

                        className="bg-[#1a1a1a] border border-[#2a2a2a] px-6 py-4 rounded-2xl"

                    >

                        Download Report

                    </a>

                )}

            </div>

            {/* CHAT AREA */}

            <div className="flex-1 overflow-y-auto px-12 py-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    {messages.map((message, index) => (

                        <div

                            key={index}

                            className={`flex ${
                                message.type === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}

                        >

                            <div

                                className={`rounded-3xl p-6 max-w-4xl ${
                                    message.type === "user"
                                        ? "bg-[#86BC25] text-black"
                                        : "bg-[#161616] border border-[#2a2a2a]"
                                }`}

                            >

                                <div className="whitespace-pre-wrap leading-relaxed text-lg">

                                    {message.text}

                                </div>

                                {message.chart && (

                                    <div className="mt-8">

                                        {/* BAR CHART */}

                                        {message.chart.type === "bar" && (

                                            <div className="w-full h-[400px]">

                                                <ResponsiveContainer width="100%" height="100%">

                                                    <BarChart

                                                        data={message.chart.labels.map(

                                                            (label: string, i: number) => ({

                                                                name: label,

                                                                value: message.chart.values[i]

                                                            })

                                                        )}

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

                                        )}

                                        {/* PIE CHART */}

                                        {message.chart.type === "pie" && (

                                            <div className="w-full h-[450px]">

                                                <ResponsiveContainer width="100%" height="100%">

                                                    <PieChart>

                                                        <Pie

                                                            data={message.chart.labels.map(

                                                                (label: string, i: number) => ({

                                                                    name: label,

                                                                    value: message.chart.values[i]

                                                                })

                                                            )}

                                                            dataKey="value"

                                                            outerRadius={150}

                                                            label

                                                        >

                                                            {message.chart.values.map(

                                                                (_: any, i: number) => (

                                                                    <Cell

                                                                        key={i}

                                                                        fill={COLORS[i % COLORS.length]}

                                                                    />

                                                                )

                                                            )}

                                                        </Pie>

                                                        <Tooltip />

                                                    </PieChart>

                                                </ResponsiveContainer>

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    ))}

                    {loading && (

                        <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-5 inline-block">

                            AI is thinking...

                        </div>

                    )}

                    <div ref={messagesEndRef} />

                </div>

            </div>

            {/* INPUT */}

            <div className="border-t border-[#1f1f1f] p-6 bg-black">

                <div className="max-w-5xl mx-auto flex gap-4">

                    <input

                        type="text"

                        value={question}

                        onChange={(e) =>
                            setQuestion(e.target.value)
                        }

                        onKeyDown={handleKeyDown}

                        placeholder="Ask about your data..."

                        className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-lg outline-none"

                    />

                    <button

                        onClick={askAI}

                        disabled={loading}

                        className="bg-[#86BC25] text-black px-8 py-4 rounded-2xl font-bold"

                    >

                        Send

                    </button>

                </div>

            </div>

        </div>

    );

}