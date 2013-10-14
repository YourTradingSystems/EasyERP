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

    var hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    var deleteEvent = function(e, that) {
        e.preventDefault();
        var answer = confirm("Realy DELETE item ?!");
        if (answer == true) {
            that.trigger('deleteEvent');
        }
    };

    return {
        toObject: toObject,
        ISODateToDate: ISODateToDate,
        hexToRgb: hexToRgb,
        deleteEvent: deleteEvent
    }
});