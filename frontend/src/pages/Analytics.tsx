import { API_URL } from "../api";
import {

    useEffect,

    useState

} from "react";

import {

    useDataset

} from "../context/DatasetContext";

function Analytics() {

    const { datasetId } =
        useDataset();

    const [

        analytics,

        setAnalytics

    ] = useState<any>(null);

    useEffect(() => {

        if (!datasetId) return;

        fetchAnalytics();

    }, [datasetId]);

    const fetchAnalytics =
        async () => {

        try {

            const response =
                await fetch(

                    `http://${API_URL}/analytics/${datasetId}`

                );

            const data =
                await response.json();

            setAnalytics(data);

        } catch (error) {

            console.error(error);

        }

    };

    if (!datasetId) {

        return (

            <div className="page-container">

                <h2>

                    Upload a dataset first.

                </h2>

            </div>

        );

    }

    if (!analytics) {

        return (

            <div className="page-container">

                <h2>
                    Loading analytics...
                </h2>

            </div>

        );

    }

    return (

        <div className="page-container">

            <div
                style={{
                    marginBottom: "3rem"
                }}
            >

                <h1
                    style={{
                        fontSize: "3rem",
                        marginBottom: "1rem"
                    }}
                >

                    Organizational Analytics

                </h1>

                <p
                    style={{
                        opacity: 0.7
                    }}
                >

                    Real-time organizational
                    intelligence generated
                    from uploaded survey data.

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

export default Analytics;