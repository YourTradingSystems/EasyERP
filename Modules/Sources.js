var Department = function (logWriter, mongoose, models) {
    var SourceSchema = mongoose.Schema({
        _id: String,
        neme: String

    }, { collection: 'sources' });

    mongoose.model('sources', SourceSchema);

    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'sources', SourceSchema).find({});
        query.exec(function (err, sources) {
            if (err) {
                console.log(err);
                logWriter.log("Sources.js getForDd find " + err);
                response.send(500, { error: "Can't find Sources" });
            } else {
                res['data'] = sources;
                response.send(res);
            }
        });
    };
    
    return {
        getForDd: getForDd,
        SourceSchema: SourceSchema
    };
};

module.exports = Department;
