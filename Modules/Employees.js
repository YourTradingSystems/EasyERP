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
                    if (typeof (data.isEmployee) != 'undefined') {
                        _employee.isEmployee = data.isEmployee;
                    }
                    if (typeof (data.name) != 'undefined') {
                        if (typeof (data.name.first) != 'undefined') {
                            _employee.name.first = data.name.first;
                        }
                        if (typeof (data.name.last) != 'undefined') {
                            _employee.name.last = data.name.last;
                        }
                    }
                    if (typeof (data.subject) != 'undefined') {
                        _employee.subject = data.subject;
                    }
                    if (typeof (data.tags) != 'undefined') {
                        _employee.tags = data.tags;
                    }
                    if (typeof (data.waddress) != 'undefined') {
                        if (typeof (data.waddress.street) != 'undefined') {
                            _employee.waddress.street = data.waddress.street;
                        }
                        if (typeof (data.waddress.city) != 'undefined') {
                            _employee.waddress.city = data.waddress.city;
                        }
                        if (typeof (data.waddress.state) != 'undefined') {
                            _employee.waddress.state = data.waddress.state;
                        }
                        if (typeof (data.waddress.zip) != 'undefined') {
                            _employee.waddress.zip = data.waddress.zip;
                        }
                        if (typeof (data.waddress.country) != 'undefined') {
                            _employee.waddress.country = data.waddress.country;
                        }
                    }
                    if (typeof (data.wemail) != 'undefined') {
                        _employee.wemail = data.wemail;
                    }
                    if (typeof (data.wphones) != 'undefined') {
                        if (typeof (data.wphones.phone) != 'undefined') {
                            _employee.wphones.phone = data.wphones.phone;
                        }
                        if (typeof (data.wphones.mobile) != 'undefined') {
                            _employee.wphones.mobile = data.wphones.mobile;
                        }
                    }
                    if (typeof (data.officeLocation) != 'undefined') {
                        _employee.officeLocation = data.officeLocation;
                    }
                    if (typeof (data.relatedUser) != 'undefined') {
                        if (typeof (data.relatedUser.id) != 'undefined') {
                            _employee.relatedUser.id = data.relatedUser.id;
                        }
                        if (typeof (data.relatedUser.login) != 'undefined') {
                            _employee.relatedUser.login = data.relatedUser.login;
                        }
                    }
                    if (typeof (data.visibility) != 'undefined') {
                        _employee.visibility = data.visibility;
                    }
                    if ((typeof (data.department) != 'undefined') && data.department != null) {
                        if (typeof (data.department.departmentId) != 'undefined') {
                            _employee.department.departmentId = data.department.departmentId;
                        }
                        if (typeof (data.department.departmentName) != 'undefined') {
                            _employee.department.departmentName = data.department.departmentName;
                        }
                    }
                    if (typeof (data.job) != 'undefined') {
                        if (typeof (data.job.jobPositionId) != 'undefined') {
                            _employee.job.jobPositionId = data.job.jobPositionId;
                        }
                        if (typeof (data.job.jobPositionName) != 'undefined') {
                            _employee.job.jobPositionName = data.job.jobPositionName;
                        }
                    }
                    if ((typeof (data.manager) != 'undefined') && data.manager != null) {
                        if (typeof (data.manager.employeeId) != 'undefined') {
                            _employee.manager.employeeId = data.manager.employeeId;
                        }
                        if (typeof (data.manager.employeeName) != 'undefined') {
                            _employee.manager.employeeName = data.manager.employeeName;
                        }
                    }
                    if ((typeof (data.coach) != 'undefined') && data.coach != null) {
                        if (typeof (data.coach.employeeId) != 'undefined') {
                            _employee.coach.employeeId = data.coach.employeeId;
                        }
                        if (typeof (data.coach.employeeName) != 'undefined') {
                            _employee.coach.employeeName = data.coach.employeeName;
                        }
                    }
                    if (typeof (data.nationality) != 'undefined') {
                        _employee.nationality = data.nationality;
                    }
                    if (typeof (data.identNo) != 'undefined') {
                        _employee.identNo = data.identNo;
                    }
                    if (typeof (data.passportNo) != 'undefined') {
                        _employee.passportNo = data.passportNo;
                    }
                    if (typeof (data.bankAccountNo) != 'undefined') {
                        _employee.bankAccountNo = data.bankAccountNo;
                    }
                    if (typeof (data.otherId) != 'undefined') {
                        _employee.otherId = data.otherId;
                    }
                    if ((typeof (data.homeAddress) != 'undefined') && data.homeAddress != null) {
                        if (typeof (data.homeAddress.street) != 'undefined') {
                            _employee.homeAddress.street = data.homeAddress.street;
                        }
                        if (typeof (data.homeAddress.city) != 'undefined') {
                            _employee.homeAddress.city = data.homeAddress.city;
                        }
                        if (typeof (data.homeAddress.state) != 'undefined') {
                            _employee.homeAddress.state = data.homeAddress.state;
                        }
                        if (typeof (data.homeAddress.zip) != 'undefined') {
                            _employee.homeAddress.zip = data.homeAddress.zip;
                        }
                        if (typeof (data.homeAddress.country) != 'undefined') {
                            _employee.homeAddress.country = data.homeAddress.country;
                        }
                    }
                    if (typeof (data.dateBirth) != 'undefined') {
                        _employee.dateBirth = data.dateBirth;
                    }
                    if (typeof (data.nextAction) != 'undefined') {
                        _employee.nextAction = data.nextAction;
                    }
                    if (typeof (data.source) != 'undefined') {
                        if (typeof (data.source.custommerId) != 'undefined') {
                            _employee.source.id = data.source.id;
                        }
                        if (typeof (data.source.name) != 'undefined') {
                            _employee.source.name = data.source.name;
                        }
                    }
                    if (typeof (data.referredBy) != 'undefined') {
                        _employee.referredBy = data.referredBy;
                    }
                    if (typeof (data.active) != 'undefined') {
                        _employee.active = data.active;
                    }
                    if (typeof (data.workflow) != 'undefined') {
                        if (typeof (data.workflow.name) != 'undefined') {
                            _employee.workflow.name = data.workflow.name;
                        }
                        if (typeof (data.workflow.status) != 'undefined') {
                            _employee.workflow.status = data.workflow.status;
                        }
                    }
                    if (typeof (data.otherInfo) != 'undefined') {
                        _employee.otherInfo = data.otherInfo;
                    }
                    if (typeof (data.expectedSalary) != 'undefined') {
                        _employee.expectedSalary = data.expectedSalary;
                    }
                    if (typeof (data.proposedSalary) != 'undefined') {
                        _employee.proposedSalary = data.proposedSalary;
                    }
                    if (typeof (data.color) != 'undefined') {
                        _employee.color = data.color;
                    }
                    ///////////////////////////////////////////////////
                    _employee.save(function (err, employees) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Employees.js create savetoBd _employee.save " + err);
                                res.send(500, { error: 'Employees.save BD error' });
                            } else {
                                res.send(201, { success: 'A new Employees crate success' });
                            }
                        }
                        catch (error) {
                            logWriter.log("Employees.js create savetoBd _employee.save " + error);
                        }
                    });

                }
                catch (error) {
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