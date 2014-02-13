var Languages = function (logWriter, mongoose, models) {
    var LanguageSchema = mongoose.Schema({
        name: String

    }, { collection: 'languages' });

    mongoose.model('languages', LanguageSchema);

    function getForDd(req, response) {
        var res = {};
        res.data = [];
        var query = models.get(req.session.lastDb - 1, 'languages', LanguageSchema).find({});
        query.exec(function (err, languages) {
            if (err) {
                console.log(err);
                logWriter.log("Sources.js getForDd find " + err);
                response.send(500, { error: "Can't find Sources" });
            } else {
                res.data = languages;
                response.send(res);
            }
        });
    };
    
    return {
        getForDd: getForDd,
        LanguageSchema: LanguageSchema
    };
};

module.exports = Languages;
