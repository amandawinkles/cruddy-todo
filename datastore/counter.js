const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//counter = counter + 1;
//return zeroPaddedNumber(counter);
exports.getNextUniqueId = (callback) => {
  readCounter(function(err, data) {
    if (err) {
      console.log('err', err);
    } else {
      counter = data + 1;
      var counterZeroPad = zeroPaddedNumber(counter);
      //console.log('zeroPad', counterZeroPad);
      writeCounter(counter, function(err, data) { //do something w/data increment inside cb
        //console.log('data counter.js --->', data); //data is counter
        if (err) {
          console.log('error', err);
        } else {
          //counter = data + 1;
          callback(null, counterZeroPad); //pass data here to update counter
        }
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
