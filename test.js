'use strict';
const Console = require("console");

try {
    const sharp = require("sharp");
    const aj_captcha = require("./index.js");

    var startTime = performance.now();

    const res = aj_captcha.create(4, 7);

    Console.log(performance.now() - startTime);

    Console.log(res.wrongAnswers);

    sharp(Buffer.from(res.data))
        .png()
        .toFile("cap.png");

} catch(e) {
    console.log(e);
}