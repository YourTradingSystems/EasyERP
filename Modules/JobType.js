var JobType = function (logWriter, mongoose, models) {
    var jobTypeSchema = mongoose.Schema({
        _id: String,
        neme: String

    }, { collection: 'jobType' });

    mongoose.model('jobType', jobTypeSchema);

    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'jobType', jobTypeSchema).find({});
        query.exec(function (err, jobType) {
            if (err) {
                console.log(err);
                logWriter.log("JobType.js getForDd find " + err);
                response.send(500, { error: "Can't find jobType" });
            } else {
                res['data'] = jobType;
                response.send(res);
            }
        });
    };

    return {
        getForDd: getForDd,
        jobTypeSchema: jobTypeSchema
    };
};

module.exports = JobType;
