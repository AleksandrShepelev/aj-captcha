'use strict';
const Console = require("console");
const path = require("path");
const opentype = require("opentype.js");
const Options = require("./options.js");

function charToPatch(ch, opt) {

    const Config = Options.config;

    const glyph = Config.font.charToGlyph(ch);

    const width = glyph.advanceWidth ? glyph.advanceWidth * Config.fontScale : 0;

    const allTextWidth = opt.letterCount * width + (opt.letterCount - 1) * Config.letterSpacing;
    const leftSpace = (Config.captchaWidth - allTextWidth) / 2;

    const left = leftSpace + opt.letterPos * width + (opt.letterPos) * Config.letterSpacing;

    const height = (Config.font.ascender + Config.font.descender) * Config.fontScale;
    const top = ((Config.captchaHeight - height) / 2) + height;
    const pathc = glyph.getPath(left, top, Config.fontSize);

    const pathData = pathc.toPathData();

    const xCentre = left + (width / 2);
    const yCentre = Config.captchaHeight / 2;


    return {data: pathData, x: xCentre, y: yCentre};

}

function randDegree(maxDeg) {

    const randDeg = Math.floor(Math.random() * maxDeg);
    const znakRand = Math.floor(Math.random() * 2);
    let znak = 1;

    if (znakRand === 0) {
        znak = -1;
    }

    return znak * randDeg;
}

function generateCaptchaText(captchaLength) {

    const text = [];

    for (let i=0; i<captchaLength; i++) {

        let rndNum = '0';

        do {
            rndNum = Math.floor(Math.random() * 10).toString();
        }
        while (text.includes(rndNum));

        text.push(rndNum);
    }

    return text;
}

function generateWrongAnswer(rigthAnswer) {

    const text = [];

    for (let i=0; i<rigthAnswer.length; i++) {

        let rndNum = '0';

        do {
            rndNum = Math.floor(Math.random() * 10).toString();
        }
        while (rigthAnswer.includes(rndNum) || text.includes(rndNum));

        text.push(rndNum);
    }

    return text;
}

function generateCaptchaColors(colors = [Options.config.colors.dark, Options.config.colors.white, Options.config.colors.ligth]) {

    const retColors = {
      right: null,
      wrong: null,
      back: null
    };

    if (Math.floor(Math.random() * 2) === 0) {
        retColors.right = colors[0];
        retColors.wrong = colors[1];
    }
    else {
        retColors.right = colors[1];
        retColors.wrong = colors[0];
    }

    retColors.back = colors[2];

    return retColors;
}

function generateWrongAnswers(rightAnswer, captchaText, answersCount) {

    const Config = Options.config;

    let wrongAnswers = [];

    const answerLength = rightAnswer.length;
    const maxCountAnswers = Config.maxCountAnswer[answerLength];

    if (answersCount > maxCountAnswers) {
        answersCount = maxCountAnswers;
    }

    for (let i=0; i<answersCount; i++) {

        let tmpAnswer = [];

        do {
            for (let q=0; q<answerLength; q++) {

                let ind = 0;

                do {
                    ind = Math.floor(Math.random() * captchaText.length);
                }
                while (tmpAnswer.includes(captchaText[ind][0]));

                tmpAnswer.push(captchaText[ind][0]);
            }
        }
        while (wrongAnswers.includes(tmpAnswer));

        wrongAnswers.push(tmpAnswer);

    }

    for (let i=0; i<wrongAnswers.length; i++) {
        wrongAnswers[i] = wrongAnswers[i].join('');
    }

    return wrongAnswers;
}

module.exports.create = function (captchaLength = 3, countWrongAnswer = 5, captchaFont = Options.config.fonts.bold) {

    const Config = Options.config;

    if (captchaLength < Config.minLength || captchaLength > Config.maxLength) {
        captchaLength = Config.stdLength;
    }

    let captchaAnswerText = generateCaptchaText(captchaLength);
    const captchaWrongText = generateWrongAnswer(captchaAnswerText);
    const captchaColors = generateCaptchaColors();
    const captchaText = [];

    for (let i=0; i<captchaLength * 2; i++) {
        captchaText.push([null, null]);
    }

    for (let i=0; i<captchaAnswerText.length; i++) {

        let ind = 0;

        do {
            ind = Math.floor(Math.random() * captchaLength * 2);
        }
        while (captchaText[ind][0] !== null);

        captchaText[ind][0] = captchaAnswerText[i];
        captchaText[ind][1] = captchaColors.right;
    }

    captchaAnswerText = [];

    for (let i=0; i<captchaLength * 2; i++) {

        if (captchaText[i][0] !== null) {
            captchaAnswerText.push(captchaText[i][0]);
        }
    }


    let ind = 0;

    for (let i=0; i<captchaLength * 2; i++) {

        if (captchaText[i][0] === null) {
            captchaText[i][0] = captchaWrongText[ind];
            captchaText[i][1] = captchaColors.wrong;

            ind++;
        }
    }

    const wrongAnswers = generateWrongAnswers(captchaAnswerText, captchaText, countWrongAnswer);

    const fontPath = path.join(__dirname, `./fonts/${captchaFont}`);
    Config.font = opentype.loadSync(fontPath);
    Config.fontScale = Config.fontSize / Config.font.unitsPerEm;

    const glyph = Config.font.charToGlyph('0');
    Config.fontWidth = glyph.advanceWidth ? glyph.advanceWidth * Config.fontScale : 0;

    Config.captchaWidth = Config.indent * 2 + Config.fontWidth * captchaLength * 2 + Config.letterSpacing * (captchaLength * 2 - 1);

    const svgStart = `<svg width="${Config.captchaWidth}" height="${Config.captchaHeight}" viewBox="0 0 ${Config.captchaWidth} ${Config.captchaHeight}">`;
    const svgEnd = '</svg>';

    const svgBackground = `<rect x="0" y="0" width="${Config.captchaWidth}" height="${Config.captchaHeight}" fill="${captchaColors.back}"/>`;

    const svgData = [];
    svgData.push(svgStart);
    svgData.push(svgBackground);

    for (let i=0; i<captchaText.length; i++) {

        const charPatch = charToPatch(captchaText[i][0], {letterPos: i, letterCount: captchaText.length});
        svgData.push(`<path fill="${captchaText[i][1]}" d="${charPatch.data}" transform="rotate(${randDegree(Config.maxDeg)} ${charPatch.x} ${charPatch.y})"/>`);
    }

    svgData.push(svgEnd);

    let txtColor = '';

    switch (captchaColors.right) {

        case Config.colors.ligth: {
            txtColor = 'light';
        }
        break;

        case Config.colors.dark: {
            txtColor = 'dark';
        }
        break;

        case Config.colors.white: {
            txtColor = 'white';
        }
        break;
    }

    return {rightAnswer: captchaAnswerText.join(''), wrongAnswers: wrongAnswers, rightAnswerColor: txtColor, data: svgData.join('')};
}