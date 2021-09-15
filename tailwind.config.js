
module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'nunito': ['nunito', 'sans-serif'],
            'MyFont': ['"My Font"', 'serif'], // Ensure fonts with spaces have " " surrounding it.
            'montserrat': ['Montserrat'],
        },
        extend: {}
        , colors: {
            indigo: {
                light: '#2A2C42',
                DEFAULT: '#5c6ac4',
                dark: '#161623',
                gray: '#212127',
                navy: '#36384D',
                blue: '#024799',
                bluegrad: '#81C4FF',
                purple: '#552583',
                purplegrad: '#E3B2FF',
                darkblue: '#1B155C',
                darkbluegrad: '#8479FF',
                buttonblue: '#3B62F6',
                black: '#000000',
                white: '#FFFFFF',
                red: '#922020',
                green: '#61CD73',

            },
            white: {
                light: '#FFFFFF'
            },
            black: {
                dark: '#000000'
            },
            fontFamily: {
                monserat: ['Montserrat']
            }

        },
        rotate: {
            '-180': '-180deg',
            '-90': '-90deg',
            '-45': '-45deg',
            '0': '0',
            '45': '45deg',
            '90': '90deg',
            '135': '135deg',
            '180': '180deg',
            '270': '270deg',
        },
        screens: {
            'iphone5': '320px',
            'iphoneX' : '375px',
        }
    },
    variants: {
        extend: {},
        scrollSnapType: ['responsive'],
    },
    plugins: [require('tailwindcss-scroll-snap')],
};
