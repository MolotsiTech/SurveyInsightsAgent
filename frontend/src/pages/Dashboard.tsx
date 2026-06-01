import { useEffect, useState } from "react";

function Dashboard() {

    const [datasetId, setDatasetId] = useState("");

    const [analytics, setAnalytics] = useState<any>(null);

    const fetchAnalytics = async () => {

        const response = await fetch(

            `http://127.0.0.1:8000/analytics/${datasetId}`

        );

        const data = await response.json();

        setAnalytics(data);
    };

    return (

        <div style={{ padding: "2rem" }}>

            <h1>Survey Insights Dashboard</h1>

            <input

                type="text"

                placeholder="Enter Dataset ID"

                value={datasetId}

                onChange={(e) =>
                    setDatasetId(e.target.value)
                }

                style={{
                    width: "400px",
                    padding: "10px",
                    marginRight: "10px"
                }}
            />

            <button onClick={fetchAnalytics}>

                Load Analytics

            </button>

            {analytics && (

                <div style={{ marginTop: "2rem" }}>

                    <h2>Overview</h2>

                    <p>
                        Total Rows:
                        {" "}
                        {analytics.total_rows}
                    </p>

                    <p>
                        Total Columns:
                        {" "}
                        {analytics.total_columns}
                    </p>

                    <h2>Score Analysis</h2>

                    <pre>

                        {JSON.stringify(
                            analytics.score_analysis,
                            null,
                            2
                        )}

                    </pre>

                    <h2>Feedback Analysis</h2>

                    <pre>

                        {JSON.stringify(
                            analytics.feedback_analysis,
                            null,
                            2
                        )}

                    </pre>

                </div>

            )}

        </div>

    );
}

export default Dashboard;