var models = function (dbsArray) {
    function get(id, collection, schema) {
        return dbsArray[id].model(collection, schema);
    }
    return {
        get: get
    }
};
module.exports = models;