import React, { useEffect, useState } from 'react'

const ThemeToggle = () => {

    let getInitialTheme = (() => {
        let storedTheme = localStorage.getItem("theme")
        if (storedTheme) return storedTheme;

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";

    })

    const [theme, setTheme] = useState(getInitialTheme)

    let handleTheme = (() => {
        setTheme((prev) => {
            prev === "light" ? "dark" : "light"
        })

        localStorage.setItem("theme", theme)
    })

    useEffect(() => {
        let root = window.document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark")
        }
        else {
            root.classList.remove("dark")
        }

        localStorage.setItem("theme",theme)
    }, [theme])

    
    return (
        <>
            <button className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-lg font-medium transition-all"
                onClick={handleTheme}
            >
                🌙 Dark
            </button>
        </>
    )
}

export default ThemeToggle
