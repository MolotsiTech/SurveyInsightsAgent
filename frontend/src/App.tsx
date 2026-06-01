import {

    BrowserRouter,

    Routes,

    Route,

    NavLink

} from "react-router-dom";

import Overview from "./pages/Overview";

import Analytics from "./pages/Analytics";

import AIEngine from "./pages/AIEngine";

import DynamicDashboard from "./pages/DynamicDashboard";

<Route

    path="/dynamic-dashboard"

    element={<DynamicDashboard />}

/>

import {

    DatasetProvider

} from "./context/DatasetContext";

import "./App.css";

function App() {

    return (

        <DatasetProvider>

            <BrowserRouter>

                <div className="app-shell">

                    {/* SIDEBAR */}

                    <aside className="sidebar">

                        <div>

                            <h1 className="logo">

                                SurveyAI

                            </h1>

                            <p className="tagline">

                                Organizational
                                Intelligence

                            </p>

                        </div>

                        <nav className="nav-links">

                            <NavLink
                                to="/"
                                className="nav-item"
                            >

                                Overview

                            </NavLink>

                            <NavLink
                                to="/analytics"
                                className="nav-item"
                            >

                                Analytics

                            </NavLink>

                            <NavLink
                                to="/ai"
                                className="nav-item"
                            >

                                AI Engine

                            </NavLink>

                        </nav>

                        <div className="sidebar-footer">

                            Deloitte-inspired
                            AI analytics platform

                        </div>

                    </aside>

                    {/* MAIN */}

                    <main className="main-content">

                        <Routes>

                            <Route

                                path="/"

                                element={<Overview />}

                            />

                            <Route

                                path="/analytics"

                                element={<Analytics />}

                            />

                            <Route

                                path="/ai"

                                element={<AIEngine />}

                            />

                        </Routes>

                    </main>

                </div>

            </BrowserRouter>

        </DatasetProvider>

    );
}

export default App;