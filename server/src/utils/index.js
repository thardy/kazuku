// (function(utils) {
//     var stringUtils = require("./stringUtils.js");
//     var arrayUtils = require("./arrayUtils.js");
//     utils.errorHandler = require("./errorHandler")();
// })(module.exports);

import stringUtils from './stringUtils.js';
import arrayUtils from './arrayUtils.js';
import errorHandler from './errorHandler.js';

export default {
    stringUtils,
    arrayUtils,
    errorHandler
};