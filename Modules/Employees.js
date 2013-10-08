// JavaScript source code
var Employee = function (logWriter, mongoose) {

    var employeeSchema = mongoose.Schema({
        isEmployee: { type: Boolean, default: false },
        subject: { type: String, default: '' },
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: 'User' }
        },
        tags: { type: Array, default: [] },
        waddress: {
            street: { type: String, default: '' },
            //street2: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        wemail: { type: String, default: '' },
        wphones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        officeLocation: { type: String, default: '' },
        relatedUser: {
            id: { type: String, default: '' },
            login: { type: String, default: '' }
        },
        visibility: { type: Boolean, default: false },
        department: {
            departmentId: { type: String, default: '' },
            departmentName: { type: String, default: '' }
        },
        job: {
            jobPositionId: { type: String, default: '' },
            jobPositionName: { type: String, default: '' }
        },
        manager: {
            employeeId: { type: String, default: '' },
            employeeName: { type: String, default: '' }
        },
        coach: {
            employeeId: { type: String, default: '' },
            employeeName: { type: String, default: '' }
        },
        nationality: { type: String, default: '' },
        identNo: Number,
        passportNo: Number,
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
        workflow: {
            name: { type: String, default: '' },
            status: { type: String, default: '' }
        },
        otherInfo: { type: String, default: '' },
        expectedSalary: Number,
        proposedSalary: Number,
        color: { type: String, default: '#4d5a75' },
        creationDate: { type: Date, default: Date.now }
    }, { collection: 'Employees' });

    var employee = mongoose.model('Employees', employeeSchema);

    function create(data, res) {
        try {
            if (typeof (data) == 'undefined') {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, { error: 'JobPosition.create Incorrect Incoming Data' });
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
                        savetoDB(data);
                    }
                });
            }
            function savetoDB(data) {
                try {
                    _employee = new employee();
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
                    if (data.subject) {
                        _employee.subject = data.subject;
                    }
                    if (data.tags) {
                        _employee.tags = data.tags;
                    }
                    if (data.waddress) {
                        if (data.waddress.street) {
                            _employee.waddress.street = data.waddress.street;
                        }
                        if (data.waddress.city) {
                            _employee.waddress.city = data.waddress.city;
                        }
                        if (data.waddress.state) {
                            _employee.waddress.state = data.waddress.state;
                        }
                        if (data.waddress.zip) {
                            _employee.waddress.zip = data.waddress.zip;
                        }
                        if (data.waddress.country) {
                            _employee.waddress.country = data.waddress.country;
                        }
                    }
                    if (data.wemail) {
                        _employee.wemail = data.wemail;
                    }
                    if (data.wphones) {
                        if (data.wphones.phone) {
                            _employee.wphones.phone = data.wphones.phone;
                        }
                        if (data.wphones.mobile) {
                            _employee.wphones.mobile = data.wphones.mobile;
                        }
                    }
                    if (data.officeLocation) {
                        _employee.officeLocation = data.officeLocation;
                    }
                    if (data.relatedUser) {
                        if (data.relatedUser.id) {
                            _employee.relatedUser.id = data.relatedUser.id;
                        }
                        if (data.relatedUser.login) {
                            _employee.relatedUser.login = data.relatedUser.login;
                        }
                    }
                    if (data.visibility) {
                        _employee.visibility = data.visibility;
                    }
                    if (data.department) {
                        if (data.department.departmentId) {
                            _employee.department.departmentId = data.department.departmentId;
                        }
                        if (data.department.departmentName) {
                            _employee.department.departmentName = data.department.departmentName;
                        }
                    }
                    if (data.job) {
                        if (data.job.jobPositionId) {
                            _employee.job.jobPositionId = data.job.jobPositionId;
                        }
                        if (data.job.jobPositionName) {
                            _employee.job.jobPositionName = data.job.jobPositionName;
                        }
                    }
                    if (data.manager) {
                        if (data.manager.employeeId) {
                            _employee.manager.employeeId = data.manager.employeeId;
                        }
                        if (data.manager.employeeName) {
                            _employee.manager.employeeName = data.manager.employeeName;
                        }
                    }
                    if (data.coach) {
                        if (data.coach.employeeId) {
                            _employee.coach.employeeId = data.coach.employeeId;
                        }
                        if (data.coach.employeeName) {
                            _employee.coach.employeeName = data.coach.employeeName;
                        }
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
                        if (data.source.custommerId) {
                            _employee.source.id = data.source.id;
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
                        if (data.workflow.name) {
                            _employee.workflow.name = data.workflow.name;
                        }
                        if (data.workflow.status) {
                            _employee.workflow.status = data.workflow.status;
                        }
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
                    ///////////////////////////////////////////////////
                    _employee.save(function(err, employees) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Employees.js create savetoBd _employee.save " + err);
                                res.send(500, { error: 'Employees.save BD error' });
                            } else {
                                res.send(201, { success: 'A new Employees crate success' });
                            }
                        } catch(error) {
                            logWriter.log("Employees.js create savetoBd _employee.save " + error);
                        }
                    });
                } catch(error) {
                    console.log(error);
                    logWriter.log("Employees.js create savetoBd " + error);
                    res.send(500, { error: 'Employees.save  error' });
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Employees.js  " + Exception);
            res.send(500, { error: 'Employees.save  error' });
        }
    };//End create 

    function get(response) {
        var res = {}
        var description = "";
        res['data'] = [];
        var query = employee.find();
        query.where('isEmployee', true);
        query.exec(function (err, employeess) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + description);
                response.send(500, { error: "Can't find JobPosition" });
            } else {
                res['data'] = employeess;
                response.send(res);
            }
        });
    }; //end get

    function getForDd(response) {
        var res = {};
        res['data'] = [];
        var query = employee.find();
        query.where('isEmployee', true);
        query.select('_id name');
        query.exec(function (err, employeess) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + err);
                response.send(500, { error: "Can't find Employee" });
            } else {
                res['data'] = employeess;
                response.send(res);
            }
        });
    };

    function getApplications(response) {
        var res = {};
        res['data'] = [];
        var query = employee.find();
        query.where('isEmployee', false);
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
    };//end getById

    function update(_id, data, res) {
        try {
            delete data._id;
            employee.update({ _id: _id }, data, function (err, employees) {
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log("Employees.js update employee.update " + err);
                        res.send(500, { error: "Can't update Employees" });
                    } else {
                        res.send(200, { success: 'Employees updated success' });
                    }
                }
                catch (Exception) {
                    logWriter.log("Employees.js getEmployees employee.find " + Exception);
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Employees.js update " + Exception);
            res.send(500, { error: 'Employees updated error' });
        }
    };// end update

    function remove(_id, res) {
        employee.remove({ _id: _id }, function (err, employees) {
            if (err) {
                console.log(err);
                logWriter.log("Employees.js remove employee.remove " + err);
                res.send(500, { error: "Can't remove Employees" });
            } else {
                res.send(200, { success: 'Employees removed' });
            }
        });
    };// end remove

    return {
        create: create,

        get: get,

        getForDd: getForDd,

        update: update,

        remove: remove,

        getApplications: getApplications,

        Employee: Employee
    };
};

module.exports = Employee;