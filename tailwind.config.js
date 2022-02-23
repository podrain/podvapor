module.exports = {
  content: [
    "./frontend/**/*.{vue,js,ts,jsx,tsx}",
    "./backend/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),

            a: {
              color: theme('colors.teal.200')
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
