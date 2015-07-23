var config = require("../env-config");
var monk = require("monk");

// connect to the database
var db = monk(config.mongoDbUrl);
var database = {
    db: db,
    close: close,
    pages: db.get("pages"),
    customData: db.get("customData")
};

function close() {
    db.close();
}

module.exports = database;
