import React, { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeSwitcherProps {
    className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (systemPrefersDark) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Update DOM
        document.documentElement.classList.toggle('dark', newTheme === 'dark');

        // Save preference
        localStorage.setItem('theme', newTheme);
    };

    return (<></>
        // <button
        //     onClick={toggleTheme}
        //     className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${className}`}
        //     aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        // >
        //     {theme === 'light' ? (
        //         <svg
        //             xmlns="http://www.w3.org/2000/svg"
        //             viewBox="0 0 24 24"
        //             fill="none"
        //             stroke="currentColor"
        //             className="w-5 h-5"
        //         >
        //             <path
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 strokeWidth={2}
        //                 d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        //             />
        //         </svg>
        //     ) : (
        //         <svg
        //             xmlns="http://www.w3.org/2000/svg"
        //             viewBox="0 0 24 24"
        //             fill="none"
        //             stroke="currentColor"
        //             className="w-5 h-5"
        //         >
        //             <path
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 strokeWidth={2}
        //                 d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        //             />
        //         </svg>
        //     )}
        // </button>
    );
};

export default ThemeSwitcher; 