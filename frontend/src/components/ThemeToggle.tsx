import { FaMoon, FaSun } from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {

    const {

        darkMode,

        toggleTheme

    } = useTheme();

    return (

        <button

            onClick={toggleTheme}

            style={{

                background: "none",

                border: "none",

                cursor: "pointer",

                fontSize: "1.2rem",

                color: darkMode
                    ? "#86BC25"
                    : "#222"

            }}

        >

            {

                darkMode
                    ? <FaSun />
                    : <FaMoon />

            }

        </button>

    );
}

export default ThemeToggle;