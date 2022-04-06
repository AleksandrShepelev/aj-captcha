'use strict';

module.exports.config = {

    minLength: 1,
    maxLength: 5,
    stdLength: 3,

    maxCountAnswer: {
        1: 1,
        2: 5,
        3: 19,
        4: 69,
        5: 251
    },

    fontPath: "./fonts/",

    fonts: {
        semibold: "Mulish-SemiBold.ttf",
        bold: "Mulish-Bold.ttf"
    },

    colors: {
        dark: "#303757",
        ligth: "#0088CC",
        white: "#FFFFFF"
    },

    ratio: 3,

    captchaWidth: null,
    captchaHeight: null,

    fontSize: 70,
    font: null,
    fontScale: null,
    letterSpacing: 10,

    fontWidth: null,

    indent: 20,

    maxDeg: 20
};