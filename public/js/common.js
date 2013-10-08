define(function () {
    var toObject = function (_id, collection) {
        var _tempObject = {};
        if (_id && collection) {
            _tempObject = (collection.get(_id)) ? collection.get(_id).toJSON() : null;
        }
        return _tempObject;
    };

    return {
        toObject: toObject
    }
});