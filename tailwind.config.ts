import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        grade: {
          general: '#9ca3af',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#f59e0b',
          '1of1': '#ec4899',
        },
      },
    },
  },
  plugins: [],
}

export default config
