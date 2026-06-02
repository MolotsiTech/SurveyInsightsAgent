import { API_URL } from "../api";

import { useState } from "react";

import axios from "axios";

export default function Overview() {

    const [loading, setLoading] = useState(false);

    const uploadFile = async (

        e: any

    ) => {

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

            localStorage.setItem(

                "dataset_id",

                response.data.dataset_id

            );

            alert("Dataset uploaded successfully.");

        } catch (error) {

            console.log(error);

            alert("Upload failed.");

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen bg-black text-white px-12 py-12">

            <div className="max-w-5xl">

                <h1 className="text-7xl font-bold leading-tight mb-6">

                    Organizational Intelligence Platform

                </h1>

                <p className="text-2xl text-gray-400 leading-relaxed mb-16">

                    Upload organizational survey data and generate
                    AI-powered analytics, qualitative themes
                    and executive intelligence.

                </p>

                <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-10 max-w-2xl">

                    <h2 className="text-4xl font-bold text-[#86BC25] mb-8">

                        Upload Dataset

                    </h2>

                    <input

                        type="file"

                        onChange={uploadFile}

                        className="text-lg"

                    />

                    {loading && (

                        <p className="mt-6 text-gray-400">

                            Uploading dataset...

                        </p>

                    )}

                </div>

            </div>

        </div>

    );

}