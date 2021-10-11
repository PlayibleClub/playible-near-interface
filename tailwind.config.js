
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
            light: {
                defaultcolor1: '#8160EF',
                defaultcolor2: '#FFFFFF',
                defaultcolor3: '#F7FAFF',
                defaultcolor4: '#FFFFFF',

            },
            dark: {
                defaultcolor1: '#2A2C42',
                defaultcolor2: '#36384D',
                defaultcolor3: '#161623',
                defaultcolor4: '#2A2C42',
            },
            indigo: {
                light: '#2A2C42',
                DEFAULT: '#5c6ac4',
                dark: '#161623',
                gray: '#212127',
                lightgray: '#808394',
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
            navbarblend: {
                color1: '#5927FF',
                color2: '#8160EF',
            },
            white: {
                light: '#FFFFFF'
            },
            green: {
                pastel: '#5FE3A1'
            },
            red: {
                pastel: '#FF6565'
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
            'iphoneX': '375px',
        }
    },
    variants: {
        extend: {},
        scrollSnapType: ['responsive'],
    },
    plugins: [require('tailwindcss-scroll-snap')],
};
