/**
 * result of captcha generation
 */
interface CaptchaObj {

    /**
     * captcha right answer
     */
    rightAnswer: string,

    /**
     * captcha wrong answers, array of strings, length set countWrongAnswer in create function
     */
    wrongAnswers: [],

    /**
     * captcha right answer color, string (light, dark, white)
     */
    rightAnswerColor: string,

    /**
     * svg markup for captcha image
     */
    data: string
}

/**
 * This method returns a object that has four props:
 * rightAnswer: string with right answer for captcha
 * wrongAnswers: array of strings with wrong answers for captcha (count elements set countWrongAnswer in create function
 * rightAnswerColor: string (light, dark, white) color right answer on captcha
 * data: svg markup for captcha img
 *
 * captchaLength: length captcha from 1 to 5 (from config.minLength to config.maxLength) {optional; default: 3}
 * countWrongAnswer: count wrong answer, max count wrong answer for captchaLength in config.maxCountAnswer {optional; default: 5}
 * captchaFont: font for captcha (variants in config.fonts) {optional; default: Options.config.fonts.bold}
 *
 * @param {number} captchaLength
 * @param {number} countWrongAnswer
 * @param {string} captchaFont
 * @return {CaptchaObj}
 */
export function create(captchaLength?: number, countWrongAnswer?: number, captchaFont?: string): CaptchaObj;