// // Modern color design tokens
export const colorTokens = {
  grey: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  primary: {
    0: "#ffffff",
    10: "#f8fafc",
    50: "#e0f2fe",
    100: "#bae6fd",
    200: "#7dd3fc",
    300: "#38bdf8",
    400: "#0ea5e9",
    500: "#0284c7",
    600: "#0369a1",
    700: "#075985",
    800: "#0c4a6e",
    900: "#082f49",
    1000: "#000000",
  },
  accent: {
    100: "#f0fdf4",
    200: "#dcfce7",
    300: "#bbf7d0",
    400: "#86efac",
    500: "#4ade80",
    600: "#22c55e",
    700: "#16a34a",
    800: "#15803d",
    900: "#166534",
  }
};

// Enhanced theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Dark mode palette
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[500],
              light: colorTokens.primary[700],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[300],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[500],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
            },
            accent: {
              main: colorTokens.accent[500],
              contrastText: colorTokens.grey[900],
            }
          }
        : {
            // Light mode palette
            primary: {
              dark: colorTokens.primary[800],
              main: colorTokens.primary[500],
              light: colorTokens.primary[200],
            },
            neutral: {
              dark: colorTokens.grey[800],
              main: colorTokens.grey[600],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[100],
            },
            background: {
              default: colorTokens.primary[10],
              alt: colorTokens.primary[0],
            },
            accent: {
              main: colorTokens.accent[500],
              contrastText: colorTokens.primary[0],
            }
          }),
    },
    typography: {
      fontFamily: ["'Inter', sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontWeight: 800,
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: "clamp(1.2rem, 3vw, 2rem)",
      },
      h4: {
        fontWeight: 600,
        fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.1rem",
      },
      h6: {
        fontWeight: 500,
        fontSize: "1rem",
        textTransform: "uppercase",
      },
      button: {
        fontWeight: 500,
        letterSpacing: "0.5px",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "8px 16px",
            textTransform: "none",
          },
        },
      },
    },
  };
};

