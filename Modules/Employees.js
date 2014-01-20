// JavaScript source code
var Employee = function (logWriter, mongoose, event, department, models) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var employeeSchema = new mongoose.Schema({
        isEmployee: { type: Boolean, default: false },
        imageSrc: { type: String, default: '' },
        subject: { type: String, default: '' },
        name: {
            first: { type: String, default: '' },
            last: { type: String, default: '' }
        },
        tags: { type: Array, default: [] },
        workAddress: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        workEmail: { type: String, default: '' },
        personalEmail: { type: String, default: '' },
        workPhones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        skype: { type: String, default: '' },
        officeLocation: { type: String, default: '' },
        relatedUser: { type: ObjectId, ref: 'Users', default: null },
        visibility: { type: String, default: 'Public' },
        department: { type: ObjectId, ref: 'Department', default: null },
        jobPosition: { type: ObjectId, ref: 'JobPosition', default: null },
        manager: { type: ObjectId, ref: 'Employees', default: null },
        coach: { type: ObjectId, ref: 'Employees', default: null },
        nationality: { type: String, default: '' },
        identNo: String,
        passportNo: String,
        bankAccountNo: { type: String, default: '' },
        otherId: { type: String, default: '' },
        homeAddress: {
            street: { type: String, default: '' },
            //street2: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        dateBirth: Date,
        age: { type: Number, default: 0 },
        daysForBirth: Number,
        nextAction: Date,
        source: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        referredBy: { type: String, default: '' },
        active: { type: Boolean, default: true },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        otherInfo: { type: String, default: '' },
        expectedSalary: Number,
        proposedSalary: Number,
        color: { type: String, default: '#4d5a75' },
        creationDate: { type: Date, default: Date.now },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        attachments: [{
            id: { type: Number, default: '' },
            name: { type: String, default: '' },
            path: { type: String, default: '' },
            size: Number,
            uploaderName: { type: String, default: '' },
            uploadDate: { type: Date, default: Date.now }
        }],
        contractEnd: {
            reason: {type: String, default: '' },
            date: { type: Date, default: Date.now }
        },
        martial: { type: String, enum: ['married', 'unmarried'], default: 'unmarried' },
        gender: { type: String, enum:['male','female'], default: 'male' }
    }, { collection: 'Employees' });

    mongoose.model('Employees', employeeSchema);

    function getAge(birthday) {
        birthday = new Date(birthday);
        var today = new Date();
        var years = today.getFullYear() - birthday.getFullYear();

        birthday.setFullYear(today.getFullYear());

        if (today < birthday) {
            years--;
        }
        console.log(years);
        return (years < 0) ? 0 : years;
    };

    function getDate(date) {
        var _date = new Date(date);
        var currentTimeZoneOffsetInMiliseconds = -_date.getTimezoneOffset() * 60 * 1000;
        var valaueOf_date = _date.valueOf();
        valaueOf_date += currentTimeZoneOffsetInMiliseconds;
        return new Date(valaueOf_date);
    };

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('Employees.create Incorrect Incoming Data');
                res.send(400, { error: 'Employees.create Incorrect Incoming Data' });
                return;
            } else {
                var query = {
                    $and: [{ 'name.first': data.name.first },
                        { 'name.last': data.name.last }]
                };
                models.get(req.session.lastDb - 1, "Employees", employeeSchema).find(query, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log('Employees.js. create Employee.find' + error);
                        res.send(500, { error: 'Employees.create find error' });
                    }
                    if (doc.length > 0) {
                        if (doc[0].name === data.name) {
                            res.send(400, { error: 'An Employees with the same Name already exists' });
                        }
                    } else if (doc.length === 0) {
                        savetoDb(data);
                    }
                });
            }

            function savetoDb(data) {
                try {
                    _employee = new models.get(req.session.lastDb - 1, "Employees", employeeSchema)();
                    if (data.uId) {

                        _employee.createdBy.user = data.uId;
                    }
                    if (data.isEmployee) {
                        _employee.isEmployee = data.isEmployee;
                    }
                    if (data.name) {
                        if (data.name.first) {
                            _employee.name.first = data.name.first;
                        }
                        if (data.name.last) {
                            _employee.name.last = data.name.last;
                        }
                    }
                    if (data.gender) {
                        _employee.gender = data.gender;
                    }
                    if (data.martial) {
                        _employee.martial = data.martial;
                    }
                    if (data.attachments) {
                        if (data.attachments.id) {
                            _employee.attachments.id = data.attachments.id;
                        }
                        if (data.attachments.name) {
                            _employee.attachments.name = data.attachments.name;
                        }
                        if (data.attachments.path) {
                            _employee.attachments.path = data.attachments.path;
                        }
                        if (data.attachments.size) {
                            _employee.attachments.size = data.attachments.size;
                        }
                        if (data.attachments.uploadDate) {
                            _employee.attachments.uploadDate = data.attachments.uploadDate;
                        }
                        if (data.attachments.uploaderName) {
                            _employee.attachments.uploaderName = data.attachments.uploaderName;
                        }
                    }
                    if (data.subject) {
                        _employee.subject = data.subject;
                    }
                    if (data.tags) {
                        _employee.tags = data.tags;
                    }
                    if (data.workAddress) {
                        if (data.workAddress.street) {
                            _employee.workAddress.street = data.workAddress.street;
                        }
                        if (data.workAddress.city) {
                            _employee.workAddress.city = data.workAddress.city;
                        }
                        if (data.workAddress.state) {
                            _employee.workAddress.state = data.workAddress.state;
                        }
                        if (data.workAddress.zip) {
                            _employee.workAddress.zip = data.workAddress.zip;
                        }
                        if (data.workAddress.country) {
                            _employee.workAddress.country = data.workAddress.country;
                        }
                    }
                    if (data.workEmail) {
                        _employee.workEmail = data.workEmail;
                    }
                    if (data.personalEmail) {
                        _employee.personalEmail = data.personalEmail;
                    }
                    if (data.skype) {
                        _employee.skype = data.skype;
                    }
                    if (data.workPhones) {
                        if (data.workPhones.phone) {
                            _employee.workPhones.phone = data.workPhones.phone;
                        }
                        if (data.workPhones.mobile) {
                            _employee.workPhones.mobile = data.workPhones.mobile;
                        }
                    }
                    if (data.officeLocation) {
                        _employee.officeLocation = data.officeLocation;
                    }
                    if (data.relatedUser) {
                        _employee.relatedUser = data.relatedUser;
                    }
                    if (data.visibility) {
                        _employee.visibility = data.visibility;
                    }
                    if (data.department) {
                        _employee.department = data.department;
                    }
                    if (data.groups) {
                        _employee.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _employee.whoCanRW = data.whoCanRW;
                    }
                    if (data.jobPosition) {
                        _employee.jobPosition = data.jobPosition;
                    }
                    if (data.manager) {
                        _employee.manager = data.manager;
                    }
                    if (data.coach) {
                        _employee.coach = data.coach;
                    }
                    if (data.nationality) {
                        _employee.nationality = data.nationality;
                    }
                    if (data.identNo) {
                        _employee.identNo = data.identNo;
                    }
                    if (data.passportNo) {
                        _employee.passportNo = data.passportNo;
                    }
                    if (data.bankAccountNo) {
                        _employee.bankAccountNo = data.bankAccountNo;
                    }
                    if (data.otherId) {
                        _employee.otherId = data.otherId;
                    }
                    if (data.homeAddress) {
                        if (data.homeAddress.street) {
                            _employee.homeAddress.street = data.homeAddress.street;
                        }
                        if (data.homeAddress.city) {
                            _employee.homeAddress.city = data.homeAddress.city;
                        }
                        if (data.homeAddress.state) {
                            _employee.homeAddress.state = data.homeAddress.state;
                        }
                        if (data.homeAddress.zip) {
                            _employee.homeAddress.zip = data.homeAddress.zip;
                        }
                        if (data.homeAddress.country) {
                            _employee.homeAddress.country = data.homeAddress.country;
                        }
                    }
                    if (data.dateBirth) {
                        _employee.dateBirth = getDate(data.dateBirth);
                        _employee.age = getAge(data.dateBirth);
                    }
                    if (data.nextAction) {
                        _employee.nextAction = data.nextAction;
                    }
                    if (data.source) {
                        if (data.source._id) {
                            _employee.source.id = data.source._id;
                        }
                        if (data.source.name) {
                            _employee.source.name = data.source.name;
                        }
                    }
                    if (data.referredBy) {
                        _employee.referredBy = data.referredBy;
                    }
                    if (data.active) {
                        _employee.active = data.active;
                    }
                    if (data.workflow) {
                        _employee.workflow = data.workflow;
                    }
                    if (data.otherInfo) {
                        _employee.otherInfo = data.otherInfo;
                    }
                    if (data.expectedSalary) {
                        _employee.expectedSalary = data.expectedSalary;
                    }
                    if (data.proposedSalary) {
                        _employee.proposedSalary = data.proposedSalary;
                    }
                    if (data.color) {
                        _employee.color = data.color;
                    }
                    if (data.imageSrc) {
                        _employee.imageSrc = data.imageSrc;
                    }
                    ///////////////////////////////////////////////////
                    _employee.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Employees.js create savetoBd _employee.save " + err);
                                res.send(500, { error: 'Employees.save BD error' });
                            } else {
                                res.send(201, { success: 'A new Employees create success', result: result });
                                console.log(result);
                                event.emit('recalculate', req);
                            }
                        } catch (error) {
                            logWriter.log("Employees.js create savetoBd _employee.save " + error);
                        }
                    });
                } catch (error) {
                    console.log(error);
                    logWriter.log("Employees.js create savetoBd " + error);
                    res.send(500, { error: 'Employees.save  error' });
                    console.log('======================Reguest');

                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Employees.js  " + exception);
            res.send(500, { error: 'Employees.save  error' });
        }
    };//End create 

    function get(req, response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find();
        query.where('isEmployee', true);
        query.select('_id name').
        sort({ 'name.first': 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + description);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getListLength(req, data, response) {
        var res = {};
        if (data.type == "Employees") {
            var isEmployee = true;
        } else {
            var isEmployee = false;
        }

        var aggObject = {};
        if (data.letter) {
            aggObject['isEmployee'] = isEmployee;
            aggObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
        } else {
            aggObject['isEmployee'] = isEmployee;
        };

        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    aggObject,
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select("_id").
                                    exec(function (error, _res) {
                                        if (!error) {
                                            res['listLength'] = _res.length;
                                            console.log(res['listLength']);
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }

                                    });
                            } else {
                                console.log(err);
                            }

                        }
                    );

                } else {
                    console.log(err);
                }
            });
    };

    function getEmployeesAlphabet(req, response) {
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate([{ $match: { isEmployee: true } }, { $project: { later: { $substr: ["$name.last", 0, 1] } } }, { $group: { _id: "$later" } }]);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("employees.js get employees alphabet " + err);
                response.send(500, { error: "Can't find employees" });
            } else {
                var res = {};
                res['data'] = result;
                response.send(res);
            }
        });
    };

    // Custom function for list
    function getEmployeeForList(req, data, response) {
		var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isEmployee: true
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
								if (data.letter) {
									var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') }).where('_id').in(result);
								} else {
									var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find().where('_id').in(result);
								}

                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
								query.select('_id name createdBy editedBy department jobPosition manager dateBirth skype workEmail workPhones').
										populate('manager','name').
										populate('jobPosition','name').
										populate('createdBy.user','login').
										populate('department','departmentName').
										populate('editedBy.user','login').
                                        skip((data.page - 1) * data.count).
                                        limit(data.count).
                                    exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {

                }
            });
	};

    function getEmployeesForThumbnails(req, data, response) {
		var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isEmployee: true
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
								if (data.letter) {
									var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') }).where('_id').in(result);
								} else {
									var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find().where('_id').in(result);
								}

                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select('_id name dateBirth age jobPosition relatedUser workPhones.mobile').
									populate('relatedUser','login').
									populate('jobPosition','name').
                                    exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            getEmployees(res['data'], data);

                                        } else {
                                            console.log(error);
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {

                }
            });


        var getEmployees = function (employeesArray, data) {

            var employeesArrayForSending = [];
            for (var k = (data.page - 1) * data.count; k < (data.page * data.count) ; k++) {
                if (k < employeesArray.length) {
                    employeesArrayForSending.push(employeesArray[k]);
                }

            }
            res['listLength'] = employeesArray.length;
            res['data'] = employeesArrayForSending;
            response.send(res);
        }
	};

    function getEmployeeForCustom(req, data, response) {
        var res = {}
        res['data'] = [];
        var i = 0;
        var qeryEveryOne = function (arrayOfId, n, workflowsId) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true });
            }

            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);

            query.where('_id').in(arrayOfId).
                populate('manager','name').
                populate('jobPosition','name').
                populate('createdBy.user','login').
                populate('department','departmentName').
                populate('editedBy.user','login').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) getEmployees(res['data'], 0);;
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n, workflowsId) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true });
            }
            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);

            query.where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId }).
                populate('manager','name').
                populate('jobPosition','name').
                populate('createdBy.user','login').
                populate('department','departmentName').
                populate('editedBy.user','login').
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        console.log(i);
                        console.log(n);
                        res['data'] = res['data'].concat(_res);
                        console.log(res['data']);
                        if (i == n) getEmployees(res['data'], 0);;
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true });
            }
            if (workflowsId && workflowsId.length > 0)
                query.where('workflow').in(workflowsId);

            query.where({ 'groups.users': data.uId }).
                populate('manager','name').
                populate('jobPosition','name').
                populate('createdBy.user','login').
                populate('department','departmentName').
                populate('editedBy.user','login').
                exec(function (error, _res1) {
                    if (!error) {
                        models.get(req.session.lastDb - 1, 'Department', department.DepartmentSchema).find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                console.log(deps);
                                if (!err) {
                                    if (data.letter) {
                                        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                                    } else {
                                        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true });
                                    }
                                    query.where('_id').in(arrayOfId).
                                        where('groups.group').in(deps).
										select('_id name createdBy editedBy department jobPosition manager dateBirth skype workEmail workPhones').
										populate('manager','name').
										populate('jobPosition','name').
										populate('createdBy.user','login').
										populate('department','departmentName').
										populate('editedBy.user','login').
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                console.log(i);
                                                console.log(n);
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                console.log(res['data']);
                                                if (i == n) getEmployees(res['data'], 0);;
                                            } else {
                                                console.log(error);
                                            }
                                        });
                                }
                            });
                    } else {
                        console.log(error);
                    }
                });
        };
        var workflowsId = data ? data.status : null;
        models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
            {
                $group: {
                    _id: "$whoCanRW",
                    ID: { $push: "$_id" },
                    groupId: { $push: "$groups.group" }
                }
            },
            function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        result.forEach(function (_project) {
                            switch (_project._id) {
                                case "everyOne":
                                    {
                                        qeryEveryOne(_project.ID, result.length, workflowsId);
                                    }
                                    break;
                                case "owner":
                                    {
                                        qeryOwner(_project.ID, result.length, workflowsId);
                                    }
                                    break;
                                case "group":
                                    {
                                        qeryByGroup(_project.ID, result.length, workflowsId);
                                    }
                                    break;
                            }
                        });
                    } else {
                        response.send(res);
                    }
                } else {
                    console.log(err);
                }
            }
        );

        var getEmployees = function (employees, count) {
            var employeesSendArray = [];
            var startIndex, endIndex;

            if ((data.page - 1) * data.count > employees.length) {
                startIndex = employees.length;
            } else {
                startIndex = (data.page - 1) * data.count;
            }

            if (data.page * data.count > employees.length) {
                endIndex = employees.length;
            } else {
                endIndex = data.page * data.count;
            }

            for (var k = startIndex; k < endIndex; k++) {
                employeesSendArray.push(employees[k]);
            }
            res['listLength'] = employees.length;
            res['data'] = employeesSendArray;
            response.send(res);
        }
    };

    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, 'Employees', employeeSchema).find();
        query.where('isEmployee', true);
        query.select('_id name ');
        query.sort({ 'name.first': 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + err);
                response.send(500, { error: "Can't find Employee" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getForDdByRelatedUser(req, uId, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ relatedUser: uId });
        query.where('isEmployee', true);
        query.select('_id name ');
        query.sort({ 'name.first': 1 });
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + err);
                response.send(500, { error: "Can't find Employee" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getApplications(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find();

        query.where('isEmployee', false);
        query.populate('relatedUser department jobPosition workflow').
            populate('createdBy.user').
            populate('editedBy.user');

        query.sort({ 'name.first': 1 });
        query.exec(function (err, applications) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Application.find' + err);
                response.send(500, { error: "Can't find Application" });
            } else {
                res['data'] = applications;
                response.send(res);
            }
        });
    };

    function getApplicationsForList(req, data, response) {
		var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isEmployee: false
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
								var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find().where('_id').in(result);

                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
								query.select('_id name createdBy editedBy jobPosition manager workEmail workPhones creationDate workflow email department').
									populate('manager','name').
									populate('jobPosition','name').
									populate('createdBy.user','login').
									populate('department','departmentName').
									populate('editedBy.user','login').
									populate('workflow','name').
                                    skip((data.page - 1) * data.count).
                                    limit(data.count).
                                    exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {

                }
            });
	};

    function getApplicationsForKanban(req, data, response) {
        var res = {};
        res['data'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isEmployee: false
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                workflow: 1
                            }
                        },
                        {
                            $group: {
                                _id: "$workflow",
                                opportunitieId: { $push: "$_id" },
                                count: { $sum: 1 }
                            }
                        },
                        function (err, responseApplications) {
                            if (!err) {
                                console.log(responseApplications);
                                var responseApplicationsArray = [];
                                var columnValue = data.count;
                                var page = data.page;
                                var startIndex, endIndex;
                                showMore = responseApplications.getShowmore(page * columnValue);
                                responseApplications.forEach(function (value) {
                                    if ((data.page - 1) * data.count > value.opportunitieId.length) {
                                        startIndex = value.count;
                                    } else {
                                        startIndex = (data.page - 1) * data.count;
                                    }

                                    if (data.page * data.count > value.count) {
                                        endIndex = value.count;
                                    } else {
                                        endIndex = data.page * data.count;
                                    }

                                    for (var k = startIndex; k < endIndex; k++) {
                                        responseApplicationsArray.push(value.opportunitieId[k]);
                                    }
                                    optionsArray.push(value);
                                });
                                models.get(req.session.lastDb - 1, "Employees", employeeSchema).find().
                                where('_id').in(responseApplicationsArray).
								select("_id name proposedSalary jobPosition nextAction workflow editedBy.date").
								populate('jobPosition','name').
                                populate('workflow','_id').
								sort({ 'editedBy.date': -1 }).
                                exec(function (err, result) {
                                    if (!err) {
                                        res['showMore'] = showMore;
                                        res['options'] = optionsArray;
                                        res['data'] = result;
                                        response.send(res);
                                    } else {
                                        logWriter.log("application.js getApplicationForKanban opportunitie.find" + err);
                                        response.send(500, { error: "Can't find application" });
                                    }
                                })
                            } else {
                                logWriter.log("application.js getApplicationForKanban task.find " + err);
                                response.send(500, { error: "Can't group application" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };
    //end getById

    function getById(req, data, response) {
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).findById(data.id, function (err, res) { });
        query.populate('manager', 'name _id');
        query.populate('department', 'departmentName _id');
        query.populate('coach', 'name _id');
        query.populate('relatedUser', 'login _id');
        query.populate('jobPosition', 'name _id');
        query.populate('workflow').
			populate('createdBy.user').
            populate('editedBy.user').
            populate('groups.users').
            populate('groups.group');

        query.exec(function (err, findedEmployee) {
            if (err) {
                logWriter.log("Employees.js getById employee.find " + err);
                response.send(500, { error: "Can't find Employee" });
            } else {
                response.send(findedEmployee);
            }
        });

    };

    function update(req, _id, data, res) {
        try {
            delete data._id;
            delete data.createdBy;
            if (data.relatedUser && data.relatedUser._id) {
                data.relatedUser = data.relatedUser._id;
            }
            if (data.department && data.department._id) {
                data.department = data.department._id;
            }
            if (data.manager && data.manager._id) {
                data.manager = data.manager._id;
            }
            if (data.coach && data.coach._id) {
                data.coach = data.coach._id;
            }
            if (data.jobPosition && data.jobPosition._id) {
                data.jobPosition = data.jobPosition._id;
            }
            if (data.workflow && data.workflow._id) {
                data.workflow = data.workflow._id;
            }
            if (data.recalculate && data.dateBirth) {
                data.dateBirth = getDate(data.dateBirth);
                data.age = getAge(data.dateBirth);
            }
            if (data.groups && data.groups.group) {
                data.groups.group.forEach(function (group, index) {
                    if (group._id) data.groups.group[index] = newObjectId(group._id.toString());
                });
            }
            if (data.groups && data.groups.users) {
                data.groups.users.forEach(function (user, index) {
                    if (user._id) data.groups.users[index] = newObjectId(user._id.toString());
                });
            }
			if (data.workflowForList){
				data={
					$set:{
						workflow:data.workflow
					}
				}
			}

            if (data.workflowContractEnd){
                data = {
                    $set:{
                        workflow: data.workflow,
                        'contractEnd.reason' : data.contractEndReason,
                        'contractEnd.date' : new Date(),
                        isEmployee: false
                    }
                }
            }
			console.log(data);
            models.get(req.session.lastDb - 1, "Employees", employeeSchema).findByIdAndUpdate({ _id: _id }, data, {upsert: true}, function (err, result) {
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log("Employees.js update employee.update " + err);
                        res.send(500, { error: "Can't update Employees" });
                    } else {
                        res.send(200, { success: 'Employees updated success', data: result });
                        if (data.recalculate) {
                            event.emit('recalculate', req);
                        }
                    }
                }
                catch (exception) {
                    logWriter.log("Employees.js getEmployees employee.find " + exception);
                }
            });
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Employees.js update " + exception);
            res.send(500, { error: 'Employees updated error' });
        }
    };// end update

    function remove(req, _id, res) {
        models.get(req.session.lastDb - 1, "Employees", employeeSchema).remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Employees.js remove employee.remove " + err);
                res.send(500, { error: "Can't remove Employees" });
            } else {
                res.send(200, { success: 'Employees removed' });
                event.emit('recalculate', req);
            }
        });
    };// end remove

    function getFilterApplications(req, data, response) {
        var res = {};
        res['data'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;

        var i = 0;
        var qeryEveryOne = function (arrayOfId, n) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false });
            }
            query.where('_id').in(arrayOfId).
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            qeryGetApplications(res['data'], data);
                        }
                    }
                });
        };

        var qeryOwner = function (arrayOfId, n) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false });
            }
            query.where('_id').in(arrayOfId).
                where({ 'groups.owner': data.uId }).
                exec(function (error, _res) {
                    if (!error) {
                        i++;
                        res['data'] = res['data'].concat(_res);
                        if (i == n) {
                            qeryGetApplications(res['data'], data);
                        }
                    } else {
                        console.log(error);
                    }
                });
        };

        var qeryByGroup = function (arrayOfId, n) {
            if (data.letter) {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
            } else {
                var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false });
            }
            query.where({ 'groups.users': data.uId }).
                exec(function (error, _res1) {
                    if (!error) {
                        department.department.find({ users: data.uId }, { _id: 1 },
                            function (err, deps) {
                                if (!err) {
                                    if (data.letter) {
                                        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false, 'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*') });
                                    } else {
                                        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false });
                                    }
                                    query.where('_id').in(arrayOfId).
                                        where('groups.group').in(deps).
                                        exec(function (error, _res) {
                                            if (!error) {
                                                i++;
                                                res['data'] = res['data'].concat(_res1);
                                                res['data'] = res['data'].concat(_res);
                                                if (i == n) {
                                                    qeryGetApplications(res['data'], data);
                                                }
                                            } else {
                                                console.log(error);
                                            }
                                        });
                                }
                            });
                    } else {
                        console.log(error);
                    }
                });
        };

        models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
            {
                $group: {
                    _id: "$whoCanRW",
                    ID: { $push: "$_id" },
                    groupId: { $push: "$groups.group" }
                }
            },
            function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        result.forEach(function (_project) {
                            switch (_project._id) {
                                case "everyOne":
                                    {
                                        qeryEveryOne(_project.ID, result.length);
                                    }
                                    break;
                                case "owner":
                                    {
                                        qeryOwner(_project.ID, result.length);
                                    }
                                    break;
                                case "group":
                                    {
                                        qeryByGroup(_project.ID, result.length);
                                    }
                                    break;
                            }
                        });
                    } else {
                        response.send(res);
                    }
                } else {
                    console.log(err);
                }
            }
        );

        var qeryGetApplications = function (applicationsArray, data) {

            for (var k = 0; k < applicationsArray.length; k++) {
                applicationsArray[k] = new newObjectId(applicationsArray[k]._id.toString());
            }

            var queryAggregate = models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate({ $match: { _id: { $in: applicationsArray } } }, { $group: { _id: "$workflow", applicationId: { $push: "$_id" } } });
            queryAggregate.exec(
                function (err, responseApplications) {
                    if (!err) {
                        var responseApplicationsArray = [];
                        var columnValue = data.count;
                        var page = data.page;
                        var startIndex, endIndex;

                        responseApplications.forEach(function (value) {
                            if ((data.page - 1) * data.count > value.applicationId.length) {
                                startIndex = value.applicationId.length;
                            } else {
                                startIndex = (data.page - 1) * data.count;
                            }

                            if (data.page * data.count > value.applicationId.length) {
                                endIndex = value.applicationId.length;
                            } else {
                                endIndex = data.page * data.count;
                            }

                            for (var k = startIndex; k < endIndex; k++) {
                                responseApplicationsArray.push(value.applicationId[k]);
                            }
                            var myObj = {
                                id: value._id,
                                namberOfApplications: value.applicationId.length
                            };
                            optionsArray.push(myObj);
                            if (value.applicationId.length > (page * columnValue)) {
                                showMore = true;
                            }
                        });
                        models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: false }).
                            where('_id').in(responseApplicationsArray).
							sort({ 'editedBy.date': -1 }).
                            populate('relatedUser department jobPosition workflow').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            exec(function (err, result) {
                                if (!err) {
                                    res['showMore'] = showMore;
                                    res['options'] = optionsArray;
                                    res['data'] = result;
                                    response.send(res);
                                } else {
                                    logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban opportunitie.find" + err);
                                    response.send(500, { error: "Can't find Opportunitie" });
                                }
                            })
                    } else {
                        logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban task.find " + err);
                        response.send(500, { error: "Can't group Opportunitie" });
                    }
                });

        }
        //--------------------------------------
        /* var res = {};
         res['data'] = [];
         res['showMore'] = [];
         res['options'] = [];
         var optionsArray = [];
         var showMore = false;
 
         var queryAggregate =  models.get(req.session.lastDb - 1, "Employees", employeeSchema).aggregate(
             {
                 $match:
                     { isEmployee: false }
             },
             {
                 $group: { _id: "$workflow", taskId: { $push: "$_id" } }
             });
         queryAggregate.exec(
             function (err, responseTasks) {
                 if (!err) {
 
                     var responseTasksArray = [];
                     var columnValue = data.count;
                     var page = data.page;
 
                     responseTasks.forEach(function (value) {
                         value.taskId.forEach(function (idTask, taskIndex) {
                             if (((page - 1) * columnValue <= taskIndex) && (taskIndex < (page - 1) * columnValue + columnValue)) {
                                 responseTasksArray.push(idTask);
                             }
                         });
                         var myObj = {
                             id: value._id,
                             namberOfApplications: value.taskId.length
                         };
                         optionsArray.push(myObj);
                         if (value.taskId.length > ((page - 1) * columnValue + columnValue)) {
                             showMore = true;
                         }
                     });
                      models.get(req.session.lastDb - 1, "Employees", employeeSchema).find()
                         .where('_id').in(responseTasksArray)
                         .populate('relatedUser department jobPosition workflow')
                         .populate('createdBy.user')
                         .populate('editedBy.user')
                         .exec(function (err, resalt) {
                             if (!err) {
                                 res['showMore'] = showMore;
                                 res['options'] = optionsArray;
                                 res['data'] = resalt;
                                 response.send(res);
                             } else {
                                 logWriter.log("Employee.js getFilterApplications employee.find " + err);
                                 response.send(500, { error: "Can't find Application" });
                             }
                         })
                 } else {
                     logWriter.log("Employee.js getFilterApplications employee.find " + err);
                     response.send(500, { error: "Can't group Application" });
                 }
             });*/

    };
	function getEmployeesImages(req, data, res){
        var query = models.get(req.session.lastDb - 1, "Employees", employeeSchema).find({ isEmployee: true });
        query.where('_id').in(data.ids).
			select('_id imageSrc').
            exec(function (error, response) {
				res.send(200,{data:response});
			});

	};
    return {
        create: create,

        get: get,

        getListLength: getListLength,

        getEmployeeForList: getEmployeeForList,

        getEmployeesAlphabet: getEmployeesAlphabet,

        getForDd: getForDd,

        getForDdByRelatedUser: getForDdByRelatedUser,

        update: update,

        remove: remove,

        getApplications: getApplications,

        getApplicationsForList: getApplicationsForList,

		getEmployeesForThumbnails:getEmployeesForThumbnails,

		getApplicationsForKanban:getApplicationsForKanban,

		getEmployeeForCustom: getEmployeeForCustom,

		getEmployeesImages: getEmployeesImages,

        getFilterApplications: getFilterApplications,

        employeeSchema: employeeSchema,

        getById: getById
    };
};

module.exports = Employee;
