exports.init = function (app) {
    app.get("/accounts/:siteCode", function (req, res) {
        var siteCode = req.params.siteCode;
        var result = { siteCode: siteCode };

        res.set("Content-Type", "application/json");
        res.send(result);
    });
};
