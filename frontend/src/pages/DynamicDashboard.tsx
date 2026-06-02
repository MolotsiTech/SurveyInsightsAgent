import { API_URL } from "../api";
import {

    useEffect,

    useState

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

export default function DynamicDashboard() {

    const [

        dashboard,

        setDashboard

    ] = useState<any>(null);

    const datasetId = localStorage.getItem(
        "dataset_id"
    );

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/dashboard/${datasetId}`

            );

            setDashboard(
                response.data
            );

        } catch (error) {

            console.log(error);

        }

    };

    if (!dashboard) {

        return (

            <div className="text-white p-10">

                Loading dashboard...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-black text-white p-10">

            {/* ----------------------------------- */}
            {/* TITLE */}
            {/* ----------------------------------- */}

            <h1 className="text-6xl font-bold mb-4">

                AI Dynamic Dashboard

            </h1>

            <p className="text-gray-400 mb-10">

                Autonomous analytics generated from your dataset.

            </p>

            {/* ----------------------------------- */}
            {/* KPI CARDS */}
            {/* ----------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {dashboard.cards?.map(

                    (

                        card: any,

                        index: number

                    ) => (

                        <div

                            key={index}

                            className="bg-[#161616] rounded-3xl p-8 border border-[#2a2a2a]"

                        >

                            <h2 className="text-[#86BC25] text-2xl font-bold mb-4">

                                {card.title}

                            </h2>

                            <p className="text-5xl font-bold">

                                {card.value}

                            </p>

                        </div>

                    )

                )}

            </div>

            {/* ----------------------------------- */}
            {/* CHARTS */}
            {/* ----------------------------------- */}

            <div className="space-y-10">

                {dashboard.charts?.map(

                    (

                        chart: any,

                        index: number

                    ) => (

                        <div

                            key={index}

                            className="bg-[#161616] rounded-3xl p-8 border border-[#2a2a2a]"

                        >

                            <h2 className="text-[#86BC25] text-3xl font-bold mb-8">

                                {chart.title}

                            </h2>

                            {/* ----------------------------------- */}
                            {/* BAR CHART */}
                            {/* ----------------------------------- */}

                            {chart.type === "bar" && (

                                <ResponsiveContainer

                                    width="100%"

                                    height={350}

                                >

                                    <BarChart

                                        data={chart.labels.map(

                                            (

                                                label: string,

                                                i: number

                                            ) => ({

                                                name: label,

                                                value: chart.values[i]

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

                            )}

                            {/* ----------------------------------- */}
                            {/* PIE CHART */}
                            {/* ----------------------------------- */}

                            {chart.type === "pie" && (

                                <ResponsiveContainer

                                    width="100%"

                                    height={400}

                                >

                                    <PieChart>

                                        <Pie

                                            data={chart.labels.map(

                                                (

                                                    label: string,

                                                    i: number

                                                ) => ({

                                                    name: label,

                                                    value: chart.values[i]

                                                })

                                            )}

                                            dataKey="value"

                                            outerRadius={140}

                                            label

                                        >

                                            {chart.values.map(

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

                            )}

                            {/* ----------------------------------- */}
                            {/* WORD CLOUD */}
                            {/* ----------------------------------- */}

                            {chart.type === "wordcloud" && (

                                <div className="overflow-hidden">

                                    <WordCloud

                                        data={chart.text

                                            .split(" ")

                                            .slice(0, 120)

                                            .map(

                                                (

                                                    word: string,

                                                    _index: number

                                                ) => ({

                                                    text: word,

                                                    value:

                                                        Math.floor(

                                                            Math.random() * 80

                                                        ) + 20

                                                })

                                            )}

                                        width={900}

                                        height={450}

                                        font="Arial"

                                        fontSize={(word: any) =>

                                            word.value / 2

                                        }

                                        rotate={() => 0}

                                        padding={4}

                                    />

                                </div>

                            )}

                        </div>

                    )

                )}

            </div>

            {/* ----------------------------------- */}
            {/* AI INSIGHTS */}
            {/* ----------------------------------- */}

            <div className="mt-10 bg-[#161616] rounded-3xl p-8 border border-[#2a2a2a]">

                <h2 className="text-[#86BC25] text-3xl font-bold mb-6">

                    AI Insights

                </h2>

                <div className="space-y-4">

                    {dashboard.insights?.map(

                        (

                            insight: string,

                            index: number

                        ) => (

                            <div

                                key={index}

                                className="bg-[#202020] rounded-2xl p-4"

                            >

                                {insight}

                            </div>

                        )

                    )}

                </div>

            </div>

        </div>

    );

}