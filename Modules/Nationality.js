var Nationality = function (logWriter, mongoose, models) {
    var nationalitySchema = mongoose.Schema({
        _id: String,

    }, { collection: 'nationality' });

    mongoose.model('nationality', nationalitySchema);

    function getForDd(req, response) {
        var res = {};
        res.data = [];
        var query = models.get(req.session.lastDb - 1, 'nationality', nationalitySchema).find({});
        query.exec(function (err, jobType) {
            if (err) {
                console.log(err);
                logWriter.log("JobType.js getForDd find " + err);
                response.send(500, { error: "Can't find jobType" });
            } else {
                res.data = jobType;
                response.send(res);
            }
        });
    }

    return {
        getForDd: getForDd,
        nationalitySchema: nationalitySchema
    };
};

module.exports = Nationality;
