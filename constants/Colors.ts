import { ColorSchemeName } from 'react-native';

export const Colors = {
  light: {
    waterPrimary: '#3b82f6',
    waterSecondary: '#06b6d4',
    waterAccent: '#0ea5e9',
    waterLight: '#dbeafe',
    waterSurface: '#f0f9ff',
    waterGlassBg: '#f8fafc',
    waterGlassBorder: '#e2e8f0',
    waterSuccess: '#10b981',
    waterWarning: '#f59e0b',
    waterDanger: '#ef4444',
    waterMuted: '#64748b',
    mutedForeground: '#717182',
    headlineForeground: '#3b3b3f',
    subheadlineForeground: '#9ca3af',
    pointsBackground: '#eceef2',
    cardGradientStart: '#EFF6FF',
    cardGradientEnd: '#F1FDFA',
    borderLight: '#D7DDE5',
    inactive: 'gray',
    appBackground: '#f9fafb',
    foreground: '#030213',
  },
  dark: {
    waterPrimary: '#60a5fa',
    waterSecondary: '#22d3ee',
    waterAccent: '#38bdf8',
    waterLight: '#1e293b',
    waterSurface: '#0f172a',
    waterGlassBg: '#334155',
    waterGlassBorder: '#475569',
    waterSuccess: '#34d399',
    waterWarning: '#fbbf24',
    waterDanger: '#f87171',
    waterMuted: '#94a3b8',
    mutedForeground: '#a1a1aa',
    headlineForeground: '#e4e4e7',
    subheadlineForeground: '#a1a1aa',
    pointsBackground: '#27272a',
    cardGradientStart: '#27272a',
    cardGradientEnd: '#18181b',
    borderLight: '#3f3f46',
    inactive: '#737373',
    appBackground: '#18181b',
    foreground: '#f9fafb',
  },
};

export const getTheme = (scheme: ColorSchemeName) => {
  return scheme === 'dark' ? Colors.dark : Colors.light;
};