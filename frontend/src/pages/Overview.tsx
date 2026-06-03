import { API_URL } from "../api";

import { useState } from "react";

import axios from "axios";

export default function Overview() {

    const [loading, setLoading] = useState(false);

    const [datasetId, setDatasetId] = useState("");

    const uploadFile = async (e: any) => {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("file", file);

        try {

            setLoading(true);

            const response = await axios.post(

                `${API_URL}/upload`,

                formData,

                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }

            );

            const id = response.data.dataset_id;

            localStorage.setItem(
                "dataset_id",
                id
            );

            setDatasetId(id);

        } catch (error) {

            console.error(error);

            alert("Upload failed.");

        }

        setLoading(false);

    };

    return (

        <div className="page-container">

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}
            >

                {/* HERO SECTION */}

                <div
    style={{
        marginBottom: "3rem",
        maxWidth: "900px"
    }}
>

    <h1
        style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            marginBottom: "1rem"
        }}
    >

        Organizational Intelligence

    </h1>

    <p
        style={{
            fontSize: "1.05rem",
            color: "#9ca3af",
            maxWidth: "700px",
            lineHeight: 1.7
        }}
    >

        Upload organizational survey data and generate
        AI-powered analytics, insights, qualitative themes
        and executive intelligence.

    </p>

</div>

                {/* UPLOAD CARD */}

                <div
                    style={{
                        background: "#0a0a0a",
                        border: "1px solid #1f1f1f",
                        borderRadius: "28px",
                        padding: "3rem",
                        maxWidth: "900px"
                    }}
                >

                    <h2
                        style={{
                            color: "#86BC25",
                            fontSize: "3rem",
                            marginBottom: "2rem",
                            fontWeight: 800
                        }}
                    >

                        Upload Dataset

                    </h2>

                    <label
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#86BC25",
                            color: "black",
                            padding: "1rem 2rem",
                            borderRadius: "18px",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >

                        Choose Dataset

                        <input
                            type="file"
                            onChange={uploadFile}
                            hidden
                        />

                    </label>

                    {/* LOADING STATE */}

                    {
                        loading && (

                            <div
                                style={{
                                    marginTop: "2rem"
                                }}
                            >

                                <div
                                    style={{
                                        width: "100%",
                                        height: "10px",
                                        background: "#1f1f1f",
                                        borderRadius: "999px",
                                        overflow: "hidden"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "70%",
                                            height: "100%",
                                            background: "#86BC25",
                                            animation: "pulse 1.5s infinite"
                                        }}
                                    />

                                </div>

                                <p
                                    style={{
                                        marginTop: "1rem",
                                        color: "#9ca3af"
                                    }}
                                >

                                    Analyzing organizational dataset...

                                </p>

                            </div>

                        )
                    }

                    {/* SUCCESS STATE */}

                    {
                        datasetId && (

                            <div
                                style={{
                                    marginTop: "2rem",
                                    padding: "2rem",
                                    background: "#111111",
                                    borderRadius: "20px",
                                    border: "1px solid #222"
                                }}
                            >

                                <h3
                                    style={{
                                        color: "#86BC25",
                                        marginBottom: "1rem",
                                        fontSize: "1.5rem"
                                    }}
                                >

                                    Dataset Uploaded Successfully

                                </h3>

                                <p
                                    style={{
                                        marginBottom: "0.75rem",
                                        color: "#9ca3af"
                                    }}
                                >

                                    Dataset ID

                                </p>

                                <code
                                    style={{
                                        color: "#d1d5db",
                                        fontSize: "1rem",
                                        wordBreak: "break-all"
                                    }}
                                >

                                    {datasetId}

                                </code>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );

}