import {
    BrowserRouter,
    Routes,
    Route,
    NavLink
} from "react-router-dom";

import {
    LayoutDashboard,
    BarChart3,
    Bot
} from "lucide-react";

import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import AIEngine from "./pages/AIEngine";

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
                                DataGenie<span style={{ color: "white" }}>AI</span>
                            </h1>

                            <p className="tagline">
                                Organizational Intelligence
                            </p>

                            <nav className="nav-links">

                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "nav-item active"
                                            : "nav-item"
                                    }
                                >
                                    <LayoutDashboard size={20} />

                                    <span>
                                        Overview
                                    </span>

                                </NavLink>

                                <NavLink
                                    to="/analytics"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "nav-item active"
                                            : "nav-item"
                                    }
                                >
                                    <BarChart3 size={20} />

                                    <span>
                                        Analytics
                                    </span>

                                </NavLink>

                                <NavLink
                                    to="/ai"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "nav-item active"
                                            : "nav-item"
                                    }
                                >
                                    <Bot size={20} />

                                    <span>
                                        AI Engine
                                    </span>

                                </NavLink>

                            </nav>

                        </div>

                        <div className="sidebar-footer">

                            Deloitte-inspired AI analytics platform

                        </div>

                    </aside>

                    {/* MAIN CONTENT */}

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