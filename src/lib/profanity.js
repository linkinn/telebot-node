const profanity = require("profanity-util");

const blockWords = text => {
  if (profanity.check(text).length) {
    return true;
  }
  return false;
};

module.exports = blockWords;
