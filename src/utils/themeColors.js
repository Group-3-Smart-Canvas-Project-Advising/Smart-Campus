/**
 * Theme color configurations
 * These match the CSS variables defined in osu-theme.css and osu-theme-dark.css
 * Use this for programmatic access to theme colors in components
 */

export const themeColors = {
  light: {
    // OSU brand colors
    orange: '#D73F09',
    orangeBright: '#FF6A00',
    black: '#000000',
    
    // Background colors
    bg: '#F2F2F2',
    surface: '#FFFFFF',
    cardBg: '#FFFFFF',
    inputBg: '#FFFFFF',
    
    // Border colors
    borderSoft: '#E5E5E5',
    inputBorder: '#E5E5E5',
    cardBorder: '#E5E5E5',
    
    // Text colors
    textMain: '#1A1A1A',
    muted: '#6B7280',
    
    // Accent colors (grey)
    accent: '#6b7280',
    accentLight: '#9ca3af',
    accentDark: '#4b5563',
    accentAlpha12: 'rgba(107, 114, 128, 0.12)',
    accentAlpha20: 'rgba(107, 114, 128, 0.2)',
    
    // Table colors
    tableHeaderBg: '#F9FAFB',
    tableRowBg: '#FFFFFF',
    
    // Stat colors
    statBg: '#F9FAFB',
  },
  dark: {
    // OSU brand colors
    orange: '#D73F09',
    orangeBright: '#FF6A00',
    black: '#000000',
    
    // Background colors
    bg: 'rgba(10, 18, 18, 1.0)',
    surface: 'rgba(20, 20, 20, 0.9)',
    cardBg: 'rgba(15, 20, 20, 0.9)',
    inputBg: 'rgba(15, 20, 20, 0.9)',
    
    // Border colors
    borderSoft: 'rgba(148, 163, 184, 0.25)',
    inputBorder: 'rgba(148, 163, 184, 0.6)',
    cardBorder: 'rgba(148, 163, 184, 0.25)',
    
    // Text colors
    textMain: '#e5e7eb',
    muted: '#94a3b8',
    
    // Accent colors (grey)
    accent: '#6b7280',
    accentLight: '#9ca3af',
    accentDark: '#4b5563',
    accentAlpha12: 'rgba(107, 114, 128, 0.12)',
    accentAlpha20: 'rgba(107, 114, 128, 0.2)',
    
    // Table colors
    tableHeaderBg: 'rgba(30, 41, 59, 0.6)',
    tableRowBg: 'rgba(15, 23, 20, 0.5)',
    
    // Stat colors
    statBg: 'rgba(30, 41, 59, 0.45)',
  },
};

/**
 * Get theme colors for a specific theme
 * @param {string} theme - 'light' or 'dark'
 * @returns {Object} Theme color object
 */
export const getThemeColors = (theme) => {
  return themeColors[theme] || themeColors.light;
};

