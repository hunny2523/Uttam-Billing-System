// Color configurations for different theme colors
// This utility provides consistent color shades based on the selected theme

const COLOR_SCHEMES = {
    red: {
        primary: '#dc2626',      // red-600
        light: '#fee2e2',        // red-50
        lighter: '#fef2f2',      // red-100
        medium: '#fca5a5',       // red-300
        dark: '#991b1b',         // red-800
        gradient: 'from-red-600 to-orange-600',
        bgGradient: 'from-orange-50 via-red-50 to-yellow-50',
        categoryBg: 'from-orange-100 to-red-50',
        border: 'border-red-600',
        text: 'text-red-700',
        darkText: 'text-red-800',
        hover: 'hover:bg-orange-50',
        button: 'bg-red-600 hover:bg-red-700',
    },
    blue: {
        primary: '#2563eb',      // blue-600
        light: '#dbeafe',        // blue-50
        lighter: '#eff6ff',      // blue-100
        medium: '#93c5fd',       // blue-300
        dark: '#1e3a8a',         // blue-800
        gradient: 'from-blue-600 to-cyan-600',
        bgGradient: 'from-blue-50 via-cyan-50 to-sky-50',
        categoryBg: 'from-blue-100 to-cyan-50',
        border: 'border-blue-600',
        text: 'text-blue-700',
        darkText: 'text-blue-800',
        hover: 'hover:bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
        primary: '#16a34a',      // green-600
        light: '#dcfce7',        // green-50
        lighter: '#f0fdf4',      // green-100
        medium: '#86efac',       // green-300
        dark: '#14532d',         // green-800
        gradient: 'from-green-600 to-emerald-600',
        bgGradient: 'from-green-50 via-emerald-50 to-lime-50',
        categoryBg: 'from-green-100 to-emerald-50',
        border: 'border-green-600',
        text: 'text-green-700',
        darkText: 'text-green-800',
        hover: 'hover:bg-green-50',
        button: 'bg-green-600 hover:bg-green-700',
    },
    orange: {
        primary: '#ea580c',      // orange-600
        light: '#ffedd5',        // orange-50
        lighter: '#fff7ed',      // orange-100
        medium: '#fdba74',       // orange-300
        dark: '#7c2d12',         // orange-800
        gradient: 'from-orange-600 to-amber-600',
        bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
        categoryBg: 'from-orange-100 to-amber-50',
        border: 'border-orange-600',
        text: 'text-orange-700',
        darkText: 'text-orange-800',
        hover: 'hover:bg-orange-50',
        button: 'bg-orange-600 hover:bg-orange-700',
    },
    purple: {
        primary: '#9333ea',      // purple-600
        light: '#f3e8ff',        // purple-50
        lighter: '#faf5ff',      // purple-100
        medium: '#d8b4fe',       // purple-300
        dark: '#581c87',         // purple-800
        gradient: 'from-purple-600 to-pink-600',
        bgGradient: 'from-purple-50 via-fuchsia-50 to-pink-50',
        categoryBg: 'from-purple-100 to-fuchsia-50',
        border: 'border-purple-600',
        text: 'text-purple-700',
        darkText: 'text-purple-800',
        hover: 'hover:bg-purple-50',
        button: 'bg-purple-600 hover:bg-purple-700',
    },
    indigo: {
        primary: '#4f46e5',      // indigo-600
        light: '#e0e7ff',        // indigo-50
        lighter: '#eef2ff',      // indigo-100
        medium: '#a5b4fc',       // indigo-300
        dark: '#312e81',         // indigo-800
        gradient: 'from-indigo-600 to-blue-600',
        bgGradient: 'from-indigo-50 via-blue-50 to-violet-50',
        categoryBg: 'from-indigo-100 to-blue-50',
        border: 'border-indigo-600',
        text: 'text-indigo-700',
        darkText: 'text-indigo-800',
        hover: 'hover:bg-indigo-50',
        button: 'bg-indigo-600 hover:bg-indigo-700',
    },
    pink: {
        primary: '#db2777',      // pink-600
        light: '#fce7f3',        // pink-50
        lighter: '#fdf2f8',      // pink-100
        medium: '#f9a8d4',       // pink-300
        dark: '#831843',         // pink-800
        gradient: 'from-pink-600 to-rose-600',
        bgGradient: 'from-pink-50 via-rose-50 to-red-50',
        categoryBg: 'from-pink-100 to-rose-50',
        border: 'border-pink-600',
        text: 'text-pink-700',
        darkText: 'text-pink-800',
        hover: 'hover:bg-pink-50',
        button: 'bg-pink-600 hover:bg-pink-700',
    },
    teal: {
        primary: '#0d9488',      // teal-600
        light: '#ccfbf1',        // teal-50
        lighter: '#f0fdfa',      // teal-100
        medium: '#5eead4',       // teal-300
        dark: '#134e4a',         // teal-800
        gradient: 'from-teal-600 to-cyan-600',
        bgGradient: 'from-teal-50 via-cyan-50 to-emerald-50',
        categoryBg: 'from-teal-100 to-cyan-50',
        border: 'border-teal-600',
        text: 'text-teal-700',
        darkText: 'text-teal-800',
        hover: 'hover:bg-teal-50',
        button: 'bg-teal-600 hover:bg-teal-700',
    },
};

/**
 * Get color scheme based on theme color
 * @param {string} themeColor - The theme color name (red, blue, green, etc.)
 * @returns {object} Color scheme object with various shades and utilities
 */
export function getColorScheme(themeColor = 'red') {
    const normalizedColor = themeColor.toLowerCase();
    return COLOR_SCHEMES[normalizedColor] || COLOR_SCHEMES.red;
}

/**
 * Get hex value for primary color
 * @param {string} themeColor - The theme color name
 * @returns {string} Hex color value
 */
export function getPrimaryColor(themeColor = 'red') {
    return getColorScheme(themeColor).primary;
}

export default getColorScheme;
