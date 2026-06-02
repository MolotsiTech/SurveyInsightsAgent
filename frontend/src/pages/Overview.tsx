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
                    marginBottom: "3rem"
                }}
            >

                <h1
                    style={{
                        fontSize: "5rem",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        marginBottom: "2rem"
                    }}
                >

                    Organizational Intelligence Platform

                </h1>

                <p
                    style={{
                        fontSize: "1.5rem",
                        opacity: 0.7,
                        maxWidth: "1100px",
                        lineHeight: 1.7
                    }}
                >

                    Upload organizational survey data and generate
                    AI-powered analytics, insights, qualitative themes
                    and executive intelligence.

                </p>

            </div>

            <div
                className="card"
                style={{
                    maxWidth: "1200px",
                    padding: "3rem"
                }}
            >

                <h2
                    style={{
                        color: "#86BC25",
                        fontSize: "3rem",
                        marginBottom: "2rem"
                    }}
                >

                    Upload Dataset

                </h2>

                <input
                    type="file"
                    onChange={uploadFile}
                />

                {loading && (

                    <p
                        style={{
                            marginTop: "2rem"
                        }}
                    >

                        Uploading dataset...

                    </p>

                )}

                {datasetId && (

                    <div
                        style={{
                            marginTop: "3rem"
                        }}
                    >

                        <h2>

                            Dataset Uploaded

                        </h2>

                        <p
                            style={{
                                marginTop: "1rem",
                                fontSize: "1.3rem"
                            }}
                        >

                            <strong>

                                Dataset ID:

                            </strong>{" "}

                            {datasetId}

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}