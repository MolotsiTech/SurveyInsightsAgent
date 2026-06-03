import { API_URL } from "../api";

import {
    useEffect,
    useState
} from "react";

export default function Analytics() {

    const datasetId =
        localStorage.getItem("dataset_id");

    const [
        analytics,
        setAnalytics
    ] = useState<any>(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    // -----------------------------------
    // FETCH ANALYTICS
    // -----------------------------------

    useEffect(() => {

        if (!datasetId) {

            setLoading(false);

            return;

        }

        fetchAnalytics();

    }, [datasetId]);

    const fetchAnalytics = async () => {

        try {

            const response =
                await fetch(

                    `${API_URL}/analytics/${datasetId}`

                );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch analytics"
                );

            }

            const data =
                await response.json();

            setAnalytics(data);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load analytics."
            );

        }

        setLoading(false);

    };

    // -----------------------------------
    // NO DATASET
    // -----------------------------------

    if (!datasetId) {

        return (

            <div className="page-container">

                <h2>

                    Upload a dataset first.

                </h2>

            </div>

        );

    }

    // -----------------------------------
    // LOADING
    // -----------------------------------

    if (loading) {

        return (

            <div className="page-container">

                <h2>

                    Loading analytics...

                </h2>

            </div>

        );

    }

    // -----------------------------------
    // ERROR
    // -----------------------------------

    if (error) {

        return (

            <div className="page-container">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }

    // -----------------------------------
    // MAIN UI
    // -----------------------------------

    return (

        <div className="page-container">

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

                    Organizational Analytics

                </h1>

                <p
                    style={{
                        opacity: 0.7,
                        fontSize: "1.2rem"
                    }}
                >

                    Real-time organizational intelligence
                    generated from uploaded survey data.

                </p>

            </div>

            <div
                style={{

                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",

                    gap: "1.5rem"

                }}
            >

                {/* TOTAL RESPONSES */}

                <div className="card">

                    <h3
                        style={{
                            color: "#86BC25",
                            marginBottom: "1rem"
                        }}
                    >

                        Total Responses

                    </h3>

                    <h1>

                        {
                            analytics.total_rows
                        }

                    </h1>

                </div>

                {/* SURVEY FIELDS */}

                <div className="card">

                    <h3
                        style={{
                            color: "#86BC25",
                            marginBottom: "1rem"
                        }}
                    >

                        Survey Fields

                    </h3>

                    <h1>

                        {
                            analytics.total_columns
                        }

                    </h1>

                </div>

                {/* COMPLETION RATE */}

                <div className="card">

                    <h3
                        style={{
                            color: "#86BC25",
                            marginBottom: "1rem"
                        }}
                    >

                        Completion Rate

                    </h3>

                    <h1>

                        {
                            analytics.completion_rate
                        }%

                    </h1>

                </div>

                {/* ENGAGEMENT SCORE */}

                <div className="card">

                    <h3
                        style={{
                            color: "#86BC25",
                            marginBottom: "1rem"
                        }}
                    >

                        Engagement Score

                    </h3>

                    <h1>

                        {
                            analytics.engagement_score
                        }

                    </h1>

                </div>

            </div>

        </div>

    );

}