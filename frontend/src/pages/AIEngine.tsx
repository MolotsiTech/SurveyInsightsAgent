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

import WordCloud from "react-d3-cloud";

const COLORS = [

    "#86BC25",

    "#5bc0eb",

    "#f25f5c",

    "#ffe066",

    "#9b5de5",

    "#00bbf9"

];

export default function AIEngine() {

    const [

        question,

        setQuestion

    ] = useState("");

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        messages,

        setMessages

    ] = useState<any[]>([]);

    const [

        reportUrl,

        setReportUrl

    ] = useState("");

    const messagesEndRef = useRef<any>(null);

    const datasetId = localStorage.getItem(
        "dataset_id"
    );

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

                    "No response.",

                chart:

                    response.data.chart

            };

            setMessages(prev => [

                ...prev,

                aiMessage

            ]);

        } catch (error) {

            console.log(error);

        }

        setQuestion("");

        setLoading(false);

    };

    // -----------------------------------
    // GENERATE REPORT
    // -----------------------------------

    const generateReport = async () => {

        try {

            setLoading(true);

            const response = await axios.post(

                `${API_URL}/generate-report`,

                {

                    dataset_id: datasetId

                }

            );

            const data = response.data;

            setReportUrl(

                `${API_URL}/${data.report_path}`

            );

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    // -----------------------------------
    // ENTER KEY
    // -----------------------------------

    const handleKeyDown = (

        e: any

    ) => {

        if (e.key === "Enter") {

            askAI();

        }

    };

    return (

        <div className="bg-black min-h-screen text-white flex flex-col">

            {/* ----------------------------------- */}
            {/* HEADER */}
            {/* ----------------------------------- */}

            <div className="p-10 border-b border-[#1f1f1f]">

                <h1 className="text-6xl font-bold mb-4">

                    AI Insights Engine

                </h1>

                <p className="text-gray-400 text-xl">

                    Conversational organizational intelligence.

                </p>

            </div>

            {/* ----------------------------------- */}
            {/* ACTIONS */}
            {/* ----------------------------------- */}

            <div className="px-10 pt-8 flex gap-4">

                <button

                    onClick={generateReport}

                    className="bg-[#86BC25] text-black px-8 py-4 rounded-3xl font-bold text-lg"

                >

                    Generate Executive Report

                </button>

                {reportUrl && (

                    <a

                        href={reportUrl}

                        target="_blank"

                        rel="noreferrer"

                        className="bg-[#1a1a1a] border border-[#2a2a2a] px-8 py-4 rounded-3xl text-lg"

                    >

                        Download Report

                    </a>

                )}

            </div>

            {/* ----------------------------------- */}
            {/* CHAT AREA */}
            {/* ----------------------------------- */}

            <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8">

                {messages.map(

                    (

                        message,

                        index

                    ) => (

                        <div

                            key={index}

                            className={`flex ${

                                message.type === "user"

                                    ? "justify-end"

                                    : "justify-start"

                            }`}

                        >

                            <div

                                className={`max-w-4xl rounded-3xl p-8 ${

                                    message.type === "user"

                                        ? "bg-[#86BC25] text-black"

                                        : "bg-[#161616] border border-[#2a2a2a]"

                                }`}

                            >

                                {/* ----------------------------------- */}
                                {/* TEXT */}
                                {/* ----------------------------------- */}

                                <div className="text-lg leading-relaxed whitespace-pre-wrap">

                                    {message.text}

                                </div>

                                {/* ----------------------------------- */}
                                {/* CHARTS */}
                                {/* ----------------------------------- */}

                                {message.chart && (

                                    <div className="mt-8">

                                        {/* ----------------------------------- */}
                                        {/* BAR CHART */}
                                        {/* ----------------------------------- */}

                                        {message.chart.type === "bar" && (

                                            <div className="w-full h-[400px]">

                                                <ResponsiveContainer

                                                    width="100%"

                                                    height="100%"

                                                >

                                                    <BarChart

                                                        data={message.chart.labels.map(

                                                            (

                                                                label: string,

                                                                i: number

                                                            ) => ({

                                                                name: label,

                                                                value:

                                                                    message.chart.values[i]

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

                                        {/* ----------------------------------- */}
                                        {/* PIE CHART */}
                                        {/* ----------------------------------- */}

                                        {message.chart.type === "pie" && (

                                            <div className="w-full h-[450px]">

                                                <ResponsiveContainer

                                                    width="100%"

                                                    height="100%"

                                                >

                                                    <PieChart>

                                                        <Pie

                                                            data={message.chart.labels.map(

                                                                (

                                                                    label: string,

                                                                    i: number

                                                                ) => ({

                                                                    name: label,

                                                                    value:

                                                                        message.chart.values[i]

                                                                })

                                                            )}

                                                            dataKey="value"

                                                            outerRadius={150}

                                                            label

                                                        >

                                                            {message.chart.values.map(

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

                                                            )}

                                                        </Pie>

                                                        <Tooltip />

                                                    </PieChart>

                                                </ResponsiveContainer>

                                            </div>

                                        )}

                                        {/* ----------------------------------- */}
                                        {/* WORD CLOUD */}
                                        {/* ----------------------------------- */}

                                        {message.chart.type === "wordcloud" && (

                                            <div className="w-full overflow-hidden bg-[#0f0f0f] rounded-3xl p-6 mt-6">

                                                <WordCloud

                                                    data={Object.entries(

                                                        message.chart.text

                                                            .toLowerCase()

                                                            .replace(/[^\w\s]/g, "")

                                                            .split(/\s+/)

                                                            .filter(

                                                                (

                                                                    word: string

                                                                ) =>

                                                                    word.length > 4

                                                            )

                                                            .reduce(

                                                                (

                                                                    acc: any,

                                                                    word: string

                                                                ) => {

                                                                    acc[word] = (

                                                                        acc[word] || 0

                                                                    ) + 1;

                                                                    return acc;

                                                                },

                                                                {}

                                                            )

                                                    )

                                                    .sort(

                                                        (

                                                            a: any,

                                                            b: any

                                                        ) =>

                                                            b[1] - a[1]

                                                    )

                                                    .slice(0, 40)

                                                    .map(

                                                        ([

                                                            text,

                                                            value

                                                        ]: any) => ({

                                                            text,

                                                            value: Math.min(

                                                                value * 12,

                                                                70

                                                            )

                                                        })

                                                    )}

                                                    width={700}

                                                    height={300}

                                                    font="Arial"

                                                    fontStyle="normal"

                                                    fontWeight="bold"

                                                    padding={2}

                                                    spiral="archimedean"

                                                    rotate={() => 0}

                                                    fontSize={(word: any) =>

                                                        Math.max(

                                                            16,

                                                            Math.min(

                                                                word.value,

                                                                60

                                                            )

                                                        )

                                                    }

                                                />

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    )

                )}

                {/* ----------------------------------- */}
                {/* LOADING */}
                {/* ----------------------------------- */}

                {loading && (

                    <div className="flex justify-start">

                        <div className="bg-[#161616] border border-[#2a2a2a] rounded-3xl p-6">

                            AI is thinking...

                        </div>

                    </div>

                )}

                <div ref={messagesEndRef} />

            </div>

            {/* ----------------------------------- */}
            {/* INPUT */}
            {/* ----------------------------------- */}

            <div className="border-t border-[#1f1f1f] p-6 bg-black sticky bottom-0">

                <div className="max-w-6xl mx-auto flex gap-4">

                    <input

                        type="text"

                        value={question}

                        onChange={(e) =>

                            setQuestion(

                                e.target.value

                            )

                        }

                        onKeyDown={handleKeyDown}

                        placeholder="Ask about your data..."

                        className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-3xl px-8 py-6 text-xl outline-none"

                    />

                    <button

                        onClick={askAI}

                        disabled={loading}

                        className="bg-[#86BC25] text-black px-10 py-6 rounded-3xl font-bold text-xl"

                    >

                        Send

                    </button>

                </div>

            </div>

        </div>

    );

}