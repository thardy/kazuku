'use strict';

// A middleware that checks to see if the user is authenticated & logged in
let apiResult = (body) => {
    return {data: body};
};

module.exports = {
    apiResult
};
