// JavaScript source code
var Employee = function (logWriter, mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var employeeSchema = mongoose.Schema({
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
        nextAction: Date,
        source: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        referredBy: { type: String, default: '' },
        active: { type: Boolean, default: true },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        otherInfo: { type: String, default: '' },
        expectedSalary: Number,
        proposedSalary: Number,
        color: { type: String, default: '#4d5a75' },
        creationDate: { type: Date, default: Date.now },
		createdBy:{
			user:{type:ObjectId, ref: 'Users', default:null},
			date:{type:Date, default: Date.now}
		},
		editedBy:{
			user:{type:ObjectId, ref: 'Users', default:null},
			date:{type:Date}
		},
        attachments: [{
            id: { type: Number, default: '' },
            name: { type: String, default: '' },
            path: { type: String, default: '' },
            size:Number,
            uploaderName: {type: String, default: ''},
            uploadDate: { type: Date, default: Date.now }
        }]

    }, { collection: 'Employees' });

    var employee = mongoose.model('Employees', employeeSchema);

    function create(data, res) {
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
                employee.find(query, function (error, doc) {
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
                    _employee = new employee();
                    if (data.uId) {
						
                        _employee.createdBy.user=data.uId;
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
                        _employee.dateBirth = data.dateBirth;
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
                                res.send(201, { success: 'A new Employees create success', result:result });
                                console.log(result);
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

    function get(response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = employee.find();
        query.where('isEmployee', true);
        query.populate('relatedUser department jobPosition manager coach').
            populate('createdBy.user').
            populate('editedBy.user');

        query.sort({ 'name.first': 1 });
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

    // Custom function for list
    function getEmployeeForList(data, response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = employee.find();
		if (data.letter){
			query = employee.find({'name.last':new RegExp('^['+data.letter.toLowerCase()+data.letter.toUpperCase()+'].*')});
		}

        query.where('isEmployee', true);
        query.exec(function (err, result) {
            if (!err) {
                res['listLength'] = result.length;
            }
        });

        query = employee.find();
		if (data.letter){
			query = employee.find({'name.last':new RegExp('^['+data.letter.toLowerCase()+data.letter.toUpperCase()+'].*')});
		}

        query.where('isEmployee', true);
        query.populate('relatedUser department jobPosition manager coach').
			populate('createdBy.user').
            populate('editedBy.user');

        query.sort({ 'name.first': 1 });
        query.skip((data.page - 1) * data.count).limit(data.count);
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

    function getForDd(response) {
        var res = {};
        res['data'] = [];
        var query = employee.find();
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

    function getForDdByRelatedUser(uId, response) {
        var res = {};
        res['data'] = [];
        var query = employee.find({ relatedUser: uId });
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

    function getApplications(response) {
        var res = {};
        res['data'] = [];
        var query = employee.find();

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

    function getApplicationsForList(data, response) {
        var res = {}
        var description = "";
        res['data'] = [];


        if (data.status) {
            var query = employee.find();
            query.where('isEmployee', false);
            query.where('workflow').in(data.status);
            query.exec(function (err, result) {
                if (!err) {
                    res['listLength'] = result.length;
                }
            });
            query = employee.find();
            query.where('isEmployee', false);
            query.where('workflow').in(data.status);
        } else {
            var query = employee.find();
            query.where('isEmployee', false);
            query.exec(function (err, result) {
                if (!err) {
                    res['listLength'] = result.length;
                }
            });
            query = employee.find();
            query.where('isEmployee', false);
        }
        query.populate('relatedUser department jobPosition manager coach').
            populate('createdBy.user').
            populate('editedBy.user').
			populate("workflow");
		

        query.sort({ 'name.first': 1 });
        query.skip((data.page - 1) * data.count).limit(data.count);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + description);
                response.send(500, { error: "Can't find Applications" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };
    //end getById

    function getById(data, response) {
        var query = employee.findById(data.id, function (err, res) { });
        query.populate('manager','name _id');
        query.populate('department','departmentName _id');
        query.populate('coach','name _id');
        query.populate('relatedUser','login _id');
        query.populate('jobPosition','name _id');
        query.populate('workflow').
			populate('createdBy.user').
            populate('editedBy.user');


        query.exec(function (err, findedEmployee) {
            if (err) {
                logWriter.log("Employees.js getById employee.find " + err);
                response.send(500, { error: "Can't find Employee" });
            } else {
                response.send(findedEmployee);
            }
        });

    };

    function update(_id, data, res) {
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
            employee.findByIdAndUpdate({ _id: _id }, data, function (err, result) {
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log("Employees.js update employee.update " + err);
                        res.send(500, { error: "Can't update Employees" });
                    } else {
                        res.send(200, { success: 'Employees updated success' ,data:result});
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

    function remove(_id, res) {
        employee.remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Employees.js remove employee.remove " + err);
                res.send(500, { error: "Can't remove Employees" });
            } else {
                res.send(200, { success: 'Employees removed' });
            }
        });
    };// end remove
    
    function getFilterApplications(data, response) {
        var res = {};
        res['data'] = [];
        res['showMore'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;

        var queryAggregate = employee.aggregate(
            {
                $match:
                    { isEmployee: false }
            },
            {
                 $group: { _id: "$workflow", taskId: { $push: "$_id" } }
            });
        queryAggregate.exec(
            function (err,responseTasks) {
                if (!err) {

                    var responseTasksArray =[];
                    var columnValue = data.count;
                    var page = data.page;

                    responseTasks.forEach(function(value){
                        value.taskId.forEach(function(idTask,taskIndex){
                            if (((page-1)*columnValue <= taskIndex) && (taskIndex < (page-1)*columnValue + columnValue )) {
                                responseTasksArray.push(idTask);
                            }
                        });
                        var myObj = {
                            id: value._id,
                            namberOfApplications: value.taskId.length
                        };
                        optionsArray.push(myObj);
                        if (value.taskId.length > ((page-1)*columnValue + columnValue)) {
                            showMore = true;
                        }
                    });
                    employee.find()
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
            });

    };

    return {
        create: create,

        get: get,

        getEmployeeForList: getEmployeeForList,

        getForDd: getForDd,

        getForDdByRelatedUser: getForDdByRelatedUser,

        update: update,

        remove: remove,

        getApplications: getApplications,

        getApplicationsForList: getApplicationsForList,
        
        getFilterApplications: getFilterApplications,

        employee: employee,

        employeeSchema: employeeSchema,

        getById: getById
    };
};

module.exports = Employee;
