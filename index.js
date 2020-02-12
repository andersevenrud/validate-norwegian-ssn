/*!
 * validate-norwegian-ssn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Anders Evenrud <andersevenrud@gmail.com>
 */

/**
 * Checks if given string is a valid SSN
 */
const isInvalidFormat = str => String(str).length < 11 ||
  isNaN(parseInt(str, 10))

/**
 * Split SSN into an array of strings and numbers
 */
const splitSsn = str => String(str)
  .match(/^(\d{2})(\d{2})(\d{2})(\d{3})(\d)(\d)$/)
  .splice(1)
  .map((value, index) => index > 3 ? parseInt(value, 10) : value)

/**
 * Split a string into numbers
 */
const splitNumber = str => String(str)
  .split('')
  .map(value => parseInt(value, 10))

/**
 * Breaks SSN into sections
 */
const parseSsn = str => {
  const [day, month, year, individual, k1, k2] = splitSsn(str)
  const [d1, d2] = splitNumber(day)
  const [m1, m2] = splitNumber(month)
  const [y1, y2] = splitNumber(year)
  const [i1, i2, i3] = splitNumber(individual)
  const isDnumber = d1 > 3
  const isHnumber = m1 > 3

  return {
    isDnumber,
    isHnumber,
    day,
    month,
    year,
    individual,
    k1,
    k2,
    d1,
    d2,
    m1,
    m2,
    y1,
    y2,
    i1,
    i2,
    i3
  }
}

/**
 * Checksum 1
 */
const calculateK1 = ({ d1, d2, m1, m2, y1, y2, i1, i2, i3 }) => {
  let k1calculated = 11 - (((3 * d1) + (7 * d2) + (6 * m1) + (1 * m2) + (8 * y1) + (9 * y2) + (4 * i1) + (5 * i2) + (2 * i3)) % 11)
  return k1calculated === 11 ? 0 : k1calculated
}

/**
 * Checksum 2
 */
const calculateK2 = ({ d1, d2, m1, m2, y1, y2, i1, i2, i3 }, k1calculated) => {
  let k2calculated = 11 - (((5 * d1) + (4 * d2) + (3 * m1) + (2 * m2) + (7 * y1) + (6 * y2) + (5 * i1) + (4 * i2) + (3 * i3) + (2 * k1calculated)) % 11)
  return k2calculated === 11 ? 0 : k2calculated
}

/**
 * Validates the checksums
 */
const validateNumber = ({ isHnumber, k1, k2 }, k1calculated, k2calculated) => {
  if (isHnumber) {
    return true
  }

  return k1calculated === 10 || k2calculated === 10
    ? false
    : k1calculated === k1 && k2calculated === k2
}

/*
 * Validates given date
 */
const validateDate = ({
  day,
  month,
  year,
  d1,
  m1,
  isHnumber,
  isDnumber
}, dnumber, hnumber) => {
  let checkDay = parseInt(day, 10)
  let checkMonth = parseInt(month, 10)
  let checkYear = 2000 + parseInt(year, 10)

  if (isDnumber && dnumber) {
    checkDay = d1 - 4
  }

  if (isHnumber && hnumber) {
    checkMonth = parseInt(`${m1 - 4}${m1}`, 10)
  }

  var test = new Date(`${checkYear}-${checkMonth}-${checkDay}`)

  return test.getDate() === checkDay &&
    test.getMonth() === checkMonth - 1 &&
    test.getFullYear() === checkYear
}

/**
 * Validates a Norwegian SSN
 *
 * @param {string|number} str The number
 * @param {boolean} [dnumber=true] Check if valid D-Number (if detected)
 * @param {boolean} [hnumber=true] Check if valid N-Number (if detected)
 * @throws {Error} On invalid input format
 * @return {boolean} If number was validated or not
 */
const validate = (str, dnumber = true, hnumber = true) => {
  if (isInvalidFormat(str)) {
    throw new Error('Invalid number. Must be in format DDMMYYCCCCC')
  }

  const parsed = parseSsn(str)
  const k1calculated = calculateK1(parsed)
  const k2calculated = calculateK2(parsed, k1calculated)

  const validDate = validateDate(parsed, dnumber, hnumber)
  const validNumber = validateNumber(parsed, k1calculated, k2calculated)

  return validDate && validNumber
}

export default validate
