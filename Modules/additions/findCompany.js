var findCompany = function (model) {
    var res = {};
    res['data'] = [];
    var findCompany = function (objectArray, index, response) {
        console.log(index);
        if (index < objectArray.length) {
            var query;
            if (objectArray[index].company && objectArray[index].company.id) {
                query = objectArray[index].company.id;
            } else if (objectArray[index].profile && objectArray[index].profile.company && objectArray[index].profile.company.id) {
                query = objectArray[index].profile.company.id;
            }
            if (query) {
                model.findById(query, function (err, doc) {
                    if (doc) {
                        if (objectArray[index].company) {
                            objectArray[index].company.name = doc.name;
                        } else {
                            objectArray[index].profile.company.name = doc.name;
                        }
                        findCompany(objectArray, ++index, response);
                    } else if (err) {
                        console.log(err);
                        findCompany(objectArray, ++index, response);
                    } else {
                        findCompany(objectArray, ++index, response);
                    }
                });
            } else {
                findCompany(objectArray, ++index, response);
            }
        } else {
            res['data'] = objectArray;
            response.send(res);
        }
    };
    return {
        findCompany: findCompany
    }
};
module.exports = findCompany;