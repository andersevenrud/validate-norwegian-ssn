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

// Generator: http://www.fnrinfo.no/Verktoy/FinnLovlige_Tilfeldig.aspx
// Spesification: http://www.skatteetaten.no/no/Person/Folkeregister/Fodsel-og-navnevalg/Barn-fodt-i-Norge/Fodselsnummer/

(function() {
  'use strict';

  function isValidDate(str) {
    var newdate = new Date();
    var yyyy = 2000 + Number(str.substr(4, 2));
    var mm = Number(str.substr(2, 2)) - 1;
    var dd = Number(str.substr(0, 2));
    newdate.setFullYear(yyyy);
    newdate.setMonth(mm);
    newdate.setDate(dd);

    return dd === newdate.getDate() && mm === newdate.getMonth() && yyyy === newdate.getFullYear();
  }

  /**
   * Validates a Norwegian SSN
   *
   * @param {String|Number} number            The number
   * @param {Boolean}       [dnumber=true]    Check if valid D-Number (if detected)
   * @param {Boolean}       [hnumber=true]    Check if valid N-Number (if detected)
   * @throws {Error} On invalid input format
   * @return {Boolean} If number was validated or not
   */
  function validate(number, dnumber, hnumber) {
    number = String(number);
    dnumber = typeof dnumber === 'undefined' || dnumber === true;
    hnumber = typeof hnumber === 'undefined' || hnumber === true;

    if ( isNaN(parseInt(number, 10)) || number.length < 11 ) {
      throw new Error('Invalid number. Must be in format DDMMYYCCCCC');
    }

    var day = number.substr(0, 2);
    var month = number.substr(2, 2);
    var year = number.substr(4, 2);
    var individual = number.substr(6, 3);
    var k1 = parseInt(number.substr(9, 1), 10);
    var k2 = parseInt(number.substr(10, 1), 10);

    var d1 = parseInt(day.substr(0, 1), 10);
    var d2 = parseInt(day.substr(1, 1), 10);
    var m1 = parseInt(month.substr(0, 1), 10);
    var m2 = parseInt(month.substr(1, 1), 10);
    var y1 = parseInt(year.substr(0, 1), 10);
    var y2 = parseInt(year.substr(1, 1), 10);
    var i1 = parseInt(individual.substr(0, 1), 10);
    var i2 = parseInt(individual.substr(1, 1), 10);
    var i3 = parseInt(individual.substr(2, 1), 10);

    var isDnumber = d1 > 3;
    var isHnumber = m1 > 3;
    /*
    var isFemale = !(i3 % 2);
    var isAfter1990 = (isDnumber || isHnumber) ? false : (function(i) {
      return !(i >= 500 && i <= 750);
    })(parseInt(individual, 10));
    */

    var checkValidDate = function checkValidDate() {
      if ( isDnumber && isHnumber ) {
        return false;
      }

      var date = number.substr(0, 6);

      if ( isDnumber && dnumber ) {
        date = String(d1 - 4) + number.substr(1, 5);
      }

      if ( isHnumber && hnumber ) {
        date = String(day) + String(m1 - 4) + String(m1) + String(year);
      }

      return isValidDate(date);
    };

    var checkNumber1 = function checkNumber1() {
      if ( isHnumber ) {
        return true;
      }

      var k1Calculated = 11 - (((3 * d1) + (7 * d2) + (6 * m1) + (1 * m2) + (8 * y1) + (9 * y2) + (4 * i1) + (5 * i2) + (2 * i3)) % 11);
      k1Calculated = (k1Calculated === 11 ? 0 : k1Calculated);

      if ( k1Calculated === 10 ) {
        return false;
      }

      return k1Calculated === k1;
    };

    var checkNumber2 = function checkNumber2() {
      if ( isHnumber ) {
        return true;
      }

      var k1Calculated = 11 - (((3 * d1) + (7 * d2) + (6 * m1) + (1 * m2) + (8 * y1) + (9 * y2) + (4 * i1) + (5 * i2) + (2 * i3)) % 11);
      k1Calculated = (k1Calculated === 11 ? 0 : k1Calculated);

      var k2Calculated = 11 - (((5 * d1) + (4 * d2) + (3 * m1) + (2 * m2) + (7 * y1) + (6 * y2) + (5 * i1) + (4 * i2) + (3 * i3) + (2 * k1Calculated)) % 11);
      k2Calculated = (k2Calculated === 11 ? 0 : k2Calculated);

      if ( k2Calculated === 10 ) {
        return false;
      }
      return k2Calculated === k2;
    };

    return checkValidDate() && checkNumber1() && checkNumber2();
  }

  if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports = validate;
  } else {
    if ( typeof define === 'function' && define.amd ) {
      define([], function() {
        return validate;
      });
    } else {
      window.validateNorwegianSSN = validate;
    }
  }

})();
