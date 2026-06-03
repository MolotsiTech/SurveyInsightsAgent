import { API_URL } from "../api";

import {
    useEffect,
    useState,
    useRef
} from "react";

export default function Observability() {

    const [logs, setLogs] =
        useState<string[]>([]);

    const bottomRef =
        useRef<any>(null);

    const fetchLogs = async () => {

        try {

            const response =
                await fetch(
                    `${API_URL}/logs`
                );

            const data =
                await response.json();

            setLogs(data.logs || []);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        fetchLogs();

        const interval =
            setInterval(fetchLogs, 10000);

        return () =>
            clearInterval(interval);

    }, []);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [logs]);

    return (

        <div className="page-container">

            <div
                style={{
                    marginBottom: "2rem"
                }}
            >

                <h1
                    style={{
                        fontSize: "3rem",
                        fontWeight: 800,
                        marginBottom: "1rem"
                    }}
                >

                    Live Observability

                </h1>

                <p
                    style={{
                        color: "#9ca3af"
                    }}
                >

                    Real-time backend processing logs
                    and AI pipeline visibility.

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

                    logs.map((log, index) => (

                        <div
                            key={index}
                            style={{
                                marginBottom: "1rem",
                                color: "#86BC25",
                                fontSize: "0.95rem"
                            }}
                        >

                            {log}

                        </div>

                    ))

                }

                <div ref={bottomRef} />

            </div>

        </div>

    );

}