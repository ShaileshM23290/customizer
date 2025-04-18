import React, { ReactNode } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`min-h-screen transition-colors duration-200 
      bg-gray-50 dark:bg-gray-900 
      text-gray-900 dark:text-gray-100 ${className}`}>
            <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">3D Product Customizer</h1>
                    <div className="flex items-center space-x-4">
                        <ThemeSwitcher />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} 3D Product Customizer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout; 