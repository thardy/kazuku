'use strict';
const ObjectId = require('mongodb').ObjectID;

const convertFilterStringIdsToObjectIds = (filter) => {
    if (filter['_id']) {
        for (let property in  filter['_id']) {
            if (filter['_id'].hasOwnProperty(property)) {
                filter['_id'][property] = new ObjectId(filter['_id'][property]);
            }
        }
    }
};

const convertArrayOfStringIdsToObjectIds = (array) => {
    const convertedArray = [];
    if (array && Array.isArray(array)) {
        for (let stringId of array) {
            convertedArray.push(new ObjectId(stringId));
        }
    }
    return convertedArray;
};

const convertObjectIdToStringId = (doc) => {
    if (doc && doc._id) {
        doc._id = doc._id.toHexString();
    }
    return doc;
};

module.exports = {
    convertObjectIdToStringId,
    convertFilterStringIdsToObjectIds,
    convertArrayOfStringIdsToObjectIds
};
