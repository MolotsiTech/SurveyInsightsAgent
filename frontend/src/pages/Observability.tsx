
import {
    useEffect,
    useState
} from "react";

export default function Observability() {

    const [logs, setLogs] =
        useState<any[]>([]);

    useEffect(() => {

        const simulatedLogs = [

            {
                message:
                    "Upload request received",
                type: "success"
            },

            {
                message:
                    "Workbook schema validated",
                type: "success"
            },

            {
                message:
                    "Dataset parsing initialized",
                type: "success"
            },

            {
                message:
                    "Semantic fields detected",
                type: "success"
            },

            {
                message:
                    "Generating analytics engine",
                type: "success"
            },

            {
                message:
                    "Running qualitative analysis",
                type: "success"
            },

            {
                message:
                    "Building executive dashboard",
                type: "success"
            },

            {
                message:
                    "Dataset registered successfully",
                type: "success"
            },

            {
                message:
                    "SEMANTIC PARSE ERROR: Unterminated string starting at line 12",
                type: "error"
            },

            {
                message:
                    "NaN serialization warning detected",
                type: "warning"
            },

            {
                message:
                    "Executive report generated successfully",
                type: "success"
            }

        ];

        let index = 0;

        const interval = setInterval(() => {

            if (index < simulatedLogs.length) {

                setLogs(prev => [

                    ...prev,

                    {
                        ...simulatedLogs[index],
                        timestamp:
                            new Date()
                                .toLocaleTimeString()
                    }

                ]);

                index++;

            }

        }, 1200);

        return () =>
            clearInterval(interval);

    }, []);

    return (

        <div className="page-container">

            <div
                style={{
                    marginBottom: "2rem"
                }}
            >

                <h1
                    style={{
                        fontSize: "2.8rem",
                        fontWeight: 800,
                        marginBottom: "1rem"
                    }}
                >

                    Live Observability

                </h1>

                <p
                    style={{
                        color: "#9ca3af",
                        maxWidth: "700px",
                        lineHeight: 1.7
                    }}
                >

                    Real-time AI pipeline visibility,
                    dataset telemetry and organizational
                    intelligence monitoring.

                </p>

            </div>

            <div
                style={{
                    background: "#050505",
                    border: "1px solid #1f1f1f",
                    borderRadius: "24px",
                    padding: "2rem",
                    height: "650px",
                    overflowY: "auto",
                    fontFamily: "monospace"
                }}
            >

                {

                    logs.map((log, index) => {

                        let color = "#86BC25";

                        if (log.type === "error") {
                            color = "#ef4444";
                        }

                        if (log.type === "warning") {
                            color = "#f59e0b";
                        }

                        return (

                            <div
                                key={index}
                                style={{
                                    marginBottom: "1rem",
                                    color,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    fontSize: "0.95rem"
                                }}
                            >

                                <div
                                    style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "999px",
                                        background: color,
                                        boxShadow:
                                            `0 0 12px ${color}`
                                    }}
                                />

                                <span
                                    style={{
                                        color: "#71717a",
                                        minWidth: "90px"
                                    }}
                                >
                                    [{log.timestamp}]
                                </span>

                                <span>
                                    {log.message}
                                </span>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

}

