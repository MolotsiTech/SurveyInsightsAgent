import {

    Link,

    Outlet,

    useLocation

} from "react-router-dom";

import ThemeToggle from
"../components/ThemeToggle";

import { useTheme } from
"../context/ThemeContext";

function MainLayout() {

    const location = useLocation();

    const { darkMode } = useTheme();

    const sidebarBg =
        darkMode
            ? "#1A1A1A"
            : "#F4F4F4";

    const contentBg =
        darkMode
            ? "#121212"
            : "#FFFFFF";

    const textColor =
        darkMode
            ? "#FFFFFF"
            : "#222";

    const navItems = [

        {
            path: "/",
            label: "Overview"
        },

        {
            path: "/analytics",
            label: "Analytics"
        },

        {
            path: "/ai-engine",
            label: "AI Engine"
        }

    ];

    return (

        <div
            style={{
                display: "flex",
                height: "100vh",
                background: contentBg,
                color: textColor,
                fontFamily: "Arial"
            }}
        >

            {/* SIDEBAR */}

            <div
                style={{
                    width: "260px",
                    background: sidebarBg,
                    padding: "2rem",
                    borderRight:
                        darkMode
                            ? "1px solid #2A2A2A"
                            : "1px solid #DDD"
                }}
            >

                <h2
                    style={{
                        color: "#86BC25"
                    }}
                >

                    Survey AI

                </h2>

                <div
                    style={{
                        marginTop: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >

                    {

                        navItems.map((item) => {

                            const active =
                                location.pathname ===
                                item.path;

                            return (

                                <Link

                                    key={item.path}

                                    to={item.path}

                                    style={{

                                        textDecoration:
                                            "none",

                                        color:
                                            active
                                                ? "#86BC25"
                                                : textColor,

                                        fontWeight:
                                            active
                                                ? "bold"
                                                : "normal"

                                    }}

                                >

                                    {item.label}

                                </Link>

                            );

                        })

                    }

                </div>

                <div
                    style={{
                        marginTop: "3rem"
                    }}
                >

                    <ThemeToggle />

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div
                style={{
                    flex: 1,
                    padding: "3rem",
                    overflow: "auto"
                }}
            >

                <Outlet />

            </div>

        </div>

    );
}

export default MainLayout;