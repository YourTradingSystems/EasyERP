define(function () {
    var toObject = function (_id, collection) {
        var _tempObject = null;
        if (_id && collection) {
            _tempObject = (collection.get(_id)) ? collection.get(_id).toJSON() : null;
        }
        return _tempObject;
    };

    var ISODateToDate = function (ISODate) {
        var date = ISODate.split('T')[0];
        return date;
    };

    return {
        toObject: toObject,
        ISODateToDate: ISODateToDate
    }
});