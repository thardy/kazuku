var config = require("../env-config");
var monk = require("monk");

// connect to the database
//var _db = monk(config.mongoDbUrl);

class Database {
    constructor() {
        // connect to the database
        this.db = monk(config.mongoDbUrl);
        this.customData = this.db.get("customData");
        this.customSchemas = this.db.get("customSchemas");
        this.templates = this.db.get("templates");
        this.queries = this.db.get("queries");
        this.users = this.db.get("users");
    }

    // get db() { return this._db; }
    // get customData() { return this._customData; }
    // get customSchemas() { return this._customSchemas; }
    // get templates() { return this._templates; }
    // get queries() { return this._queries; }

    close() {
        this.db.close();
    }
}

// var database = {
//     db: db,
//     close: close,
//     customData: db.get("customData"),
//     customSchemas: db.get("customSchemas"),
//     templates: db.get("templates"),
//     queries: db.get("queries")
// };
//
// function close() {
//     db.close();
// }

//module.exports = Database;
module.exports = {
    database: new Database(),
    Database: Database
};
