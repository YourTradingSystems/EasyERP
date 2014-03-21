var Campaigns = function (logWriter, mongoose, models) {
    var CampaignSchema = mongoose.Schema({
        _id: { type: String, default: '' },
		name: { type: String, default: '' }
    }, { collection: 'campaign' });

    mongoose.model('campaign', CampaignSchema);

      function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'campaigns', CampaignSchema).find({});
        query.exec(function (err, campaigns) {
            if (err) {
                logWriter.log("Sources.js getForDd find " + err);
                response.send(500, { error: "Can't find Sources" });
            } else {
                res['data'] = campaigns;
                response.send(res);
            }
        });
    };


    return {
        getForDd: getForDd,
        CampaignSchema: CampaignSchema
    };
};
module.exports = Campaigns;
