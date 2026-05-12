/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
        "colors": {
                "secondary": "#545f72",
                "background": "#f9faf2",
                "on-surface-variant": "#42493e",
                "tertiary-fixed-dim": "#ffb0cc",
                "inverse-surface": "#2e312c",
                "surface-dim": "#d9dbd3",
                "secondary-fixed-dim": "#bcc7dd",
                "outline-variant": "#c2c9bb",
                "on-secondary-fixed-variant": "#3c475a",
                "on-primary-fixed-variant": "#23501e",
                "surface-container-high": "#e7e9e1",
                "tertiary-container": "#7c3a55",
                "on-secondary-container": "#586377",
                "error": "#ba1a1a",
                "on-secondary": "#ffffff",
                "secondary-fixed": "#d8e3fa",
                "on-tertiary": "#ffffff",
                "on-tertiary-fixed": "#3b0520",
                "surface-container-highest": "#e2e3dc",
                "on-error": "#ffffff",
                "on-surface": "#191c18",
                "surface-container-low": "#f3f4ed",
                "on-tertiary-fixed-variant": "#71314c",
                "outline": "#72796e",
                "surface-variant": "#e2e3dc",
                "on-secondary-fixed": "#111c2c",
                "surface": "#f9faf2",
                "primary-fixed-dim": "#a1d494",
                "surface-bright": "#f9faf2",
                "inverse-primary": "#a1d494",
                "on-tertiary-container": "#ffaac8",
                "inverse-on-surface": "#f0f1ea",
                "tertiary-fixed": "#ffd9e4",
                "surface-container-lowest": "#ffffff",
                "tertiary": "#60233e",
                "on-background": "#191c18",
                "on-primary-container": "#9dd090",
                "error-container": "#ffdad6",
                "on-primary": "#ffffff",
                "on-primary-fixed": "#002201",
                "on-error-container": "#93000a",
                "secondary-container": "#d5e0f7",
                "primary-container": "#2d5a27",
                "surface-tint": "#3b6934",
                "surface-container": "#edefe7",
                "primary": "#154212",
                "primary-fixed": "#bcf0ae"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "spacing": {
                "margin": "24px",
                "sm": "8px",
                "unit": "4px",
                "md": "16px",
                "xl": "40px",
                "xs": "4px",
                "lg": "24px",
                "gutter": "16px"
        },
        "fontFamily": {
                "body-sm": ["Inter"],
                "body-md": ["Inter"],
                "headline-md": ["Inter"],
                "title-sm": ["Inter"],
                "display-lg": ["Inter"],
                "label-caps": ["Inter"]
        },
        "fontSize": {
                "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                "title-sm": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
                "display-lg": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "700"}]
        }
        }
    }
}