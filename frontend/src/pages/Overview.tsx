import {

    useState

} from "react";

import {

    useDataset

} from "../context/DatasetContext";

function Overview() {

    const {

        datasetId,

        setDatasetId

    } = useDataset();

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        analytics,

        setAnalytics

    ] = useState<any>(null);

    const uploadFile = async (

        event: any

    ) => {

        const file =
            event.target.files[0];

        if (!file) return;

        const formData =
            new FormData();

        formData.append(

            "file",

            file

        );

        try {

            setLoading(true);

            const response =
                await fetch(

                    "http://127.0.0.1:8000/upload",

                    {

                        method: "POST",

                        body: formData

                    }

                );

            const data =
                await response.json();

            setDatasetId(
                data.dataset_id
            );

            setAnalytics(
                data.analytics
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

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
                        fontSize: "3.5rem",
                        marginBottom: "1rem"
                    }}
                >

                    Organizational
                    Intelligence Platform

                </h1>

                <p
                    style={{
                        opacity: 0.7,
                        lineHeight: 1.8,
                        maxWidth: 700
                    }}
                >

                    Upload organizational
                    survey data and generate
                    AI-powered analytics,
                    insights, qualitative
                    themes and executive
                    intelligence.

                </p>

            </div>

            <div className="card">

                <h2
                    style={{
                        marginBottom: "1.5rem",
                        color: "#86BC25"
                    }}
                >

                    Upload Dataset

                </h2>

                <input

                    type="file"

                    onChange={uploadFile}

                    style={{
                        marginBottom: "1.5rem"
                    }}

                />

                {

                    loading && (

                        <p>
                            Uploading and
                            analyzing dataset...
                        </p>

                    )

                }

                {

                    datasetId && (

                        <div
                            style={{
                                marginTop: "2rem"
                            }}
                        >

                            <h3
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >

                                Dataset Uploaded

                            </h3>

                            <p>

                                <strong>
                                    Dataset ID:
                                </strong>

                                {" "}

                                {datasetId}

                            </p>

                            {

                                analytics && (

                                    <div
                                        style={{
                                            marginTop: "1.5rem"
                                        }}
                                    >

                                        <p>

                                            <strong>
                                                Responses:
                                            </strong>

                                            {" "}

                                            {
                                                analytics.total_rows
                                            }

                                        </p>

                                        <p>

                                            <strong>
                                                Fields:
                                            </strong>

                                            {" "}

                                            {
                                                analytics.total_columns
                                            }

                                        </p>

                                    </div>

                                )

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );
}

export default Overview;