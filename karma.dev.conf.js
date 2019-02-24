var properties = null;
var originalConfigFn = require('./karma.conf.js');
originalConfigFn({ set: function(arg) { properties = arg; } });

// Disable Headless mode for debugging
properties.browsers = ['Chrome', 'Firefox'];

// Coverage pre-processors make viewing source in the browser
// harder to read.
properties.preprocessors = {};

module.exports = function (config) {
  config.set(properties);
};
