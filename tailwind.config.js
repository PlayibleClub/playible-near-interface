
module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'nunito': ['nunito', 'sans-serif'],
            'MyFont': ['"My Font"', 'serif'] // Ensure fonts with spaces have " " surrounding it.
        },
        extend: {}
        , colors: {
            indigo: {
                light: '#2A2C42',
                DEFAULT: '#5c6ac4',
                dark: '#161623',
                navy: '#36384D',

            },
            white: {
                light: '#FFFFFF'
            }


        }
    },
    variants: {
        extend: {}
    },
    plugins: []
};
