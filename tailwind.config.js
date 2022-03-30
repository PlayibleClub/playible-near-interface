
module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'nunito': ['nunito', 'sans-serif'],
            'MyFont': ['"My Font"', 'serif'], // Ensure fonts with spaces have " " surrounding it.
            'montserrat': ['Montserrat'],
            'monument': ['Monument'],
        },
        extend: {
            backgroundImage: {
                'avg-icon': "url('/images/avgscore.png')"
            },
        },
        colors: {
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
                navbargrad1: '#4DBEEE',
                navbargrad2: '#5556A5',
                lightgreen: '#64D17A',
                darkgray: '#282828',
                lightblue: '#E6EFFF',
                yellow: '#F2C946',
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
            'iphoneX' : '375px',
            'md' : '768px',
            'lg' : '1024px',
        },
        animation: {
            'bounce' : 'bounce 0.75s infinite'
        },
        keyframes: {
            'bounce' : {
            '0%, 100%' : {
                'transform': 'translateY(-10.5%)',
                'animationTimingFunction': 'cubic-bezier(0.8, 0, 1, 1)'
              },
              '50%' : {
                'transform': 'translateY(0)',
                'animationTimingFunction': 'cubic-bezier(0, 0, 0.2, 1)'
              }
            }
        },
        scale: {
            '200':'2',
        }
    },
    variants: {
        extend: {},
        scrollSnapType: ['responsive'],
    },
    plugins: [require('tailwindcss-scroll-snap')],
};
