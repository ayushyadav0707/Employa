import json

tsconfig_data = {
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": True,
    "skipLibCheck": True,
    "strict": True,
    "noEmit": True,
    "esModuleInterop": True,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": True,
    "isolatedModules": True,
    "jsx": "preserve",
    "incremental": True,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

with open("tsconfig.json", "w", encoding="utf-8", newline="\n") as f:
    json.dump(tsconfig_data, f, indent=2)

globals_css = """@import "tailwindcss";

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
"""

with open("src/app/globals.css", "w", encoding="utf-8", newline="\n") as f:
    f.write(globals_css)

print("tsconfig.json and globals.css written cleanly.")
