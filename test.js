'use strict';
const Console = require("console");

try {
    const sharp = require("sharp");
    const aj_captcha = require("./index.js");

    for (let i = 0; i< 10000; i++) {
        const res = aj_captcha.create(4, 7);

        const set = new Set();

        for (const answer of res.wrongAnswers) {
            set.add(answer);
        }

        if (set.size < 7) {
            console.log(res.wrongAnswers);
            console.log(res.rightAnswer);
            console.log('PIZDEC');
        }
    }

    /*var startTime = performance.now();

    const res = aj_captcha.create(4, 7);

    Console.log(performance.now() - startTime);

    Console.log(res.wrongAnswers);

    sharp(Buffer.from(res.data))
        .png()
        .toFile("cap.png");*/

} catch(e) {
    console.log(e);
}