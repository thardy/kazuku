var config = require("../env-config");
var monk = require("monk");

// connect to the database
var db = monk(config.mongoDbUrl);
var database = {
    db: db,
    close: close,
    customData: db.get("customData"),
    customSchemas: db.get("customSchemas"),
    templates: db.get("templates"),
    queries: db.get("queries")
};

function close() {
    db.close();
}

module.exports = database;
