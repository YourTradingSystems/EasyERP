var requestHandler = function (fs, mongoose) {
    var logWriter = require("./Modules/additions/logWriter.js")(fs),
        department = require("./Modules/Department.js")(logWriter, mongoose),
        users = require("./Modules/Users.js")(logWriter, mongoose),
        profile = require("./Modules/Profile.js")(logWriter, mongoose),
        access = require("./Modules/additions/access.js")(profile.profile, users.User),
        employee = require("./Modules/Employees.js")(logWriter, mongoose),
        google = require("./Modules/Google.js")(users),
        events = require("./Modules/Events.js")(logWriter, mongoose, google),
        project = require("./Modules/Projects.js")(logWriter, mongoose, department),
        customer = require("./Modules/Customers.js")(logWriter, mongoose),
        workflow = require("./Modules/Workflow.js")(logWriter, mongoose),
        jobPosition = require("./Modules/JobPosition.js")(logWriter, mongoose, employee),
        degrees = require("./Modules/Degrees.js")(logWriter, mongoose),
        sourcesofapplicants = require("./Modules/SourcesOfApplicants.js")(logWriter, mongoose),
        opportunities = require("./Modules/Opportunities.js")(logWriter, mongoose, customer, workflow),
        modules = require("./Modules/Module.js")(logWriter, mongoose, users, profile);

    function getModules(req, res) {
        if (req.session && req.session.loggedIn) {
            users.User.findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.get(_user.profile, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function login(req, res, data) {
        console.log("Requst LOGIN is success");
        users.login(req, data, res);
    };

    function createUser(req, res, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 7, function (access) {
                if (access) {
                    users.createUser(data.user, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getUsers(req, res, data) {
        console.log("Requst getUsers is success");
        if (req.session && req.session.loggedIn) {
            users.getUsers(res);
        } else {
            res.send(401);
        }
    };

    function getFilterUsers(req, res, data) {
        console.log("Requst getUsers is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 7, function (access) {
                console.log(access);
                if (access) {
                    users.getFilterUsers(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getUserById(req, res, data) {
        console.log("Request getUser is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 7, function (access) {
                console.log(access);
                if (access) {
                    users.getUserById(data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function updateUser(req, res, id, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 7, function (access) {
                if (access) {
                    users.updateUser(id, data.user, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeUser(req, res, id) {
        console.log("Requst removeUser is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 7, function (access) {
                if (access) {
                    users.removeUser(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------END------Users--------------------------------
    //---------------------Profile--------------------------------
    function createProfile(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 51, function (access) {
                if (access) {
                    profile.createProfile(data.profile, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };

    function getProfile(req, res) {
        try {
            console.log("Requst getProfile is success");
            if (req.session && req.session.loggedIn) {
                access.getReadAccess(req.session.uId, 51, function (access) {
                    console.log(access);
                    if (access) {
                        profile.getProfile(res);
                    } else {
                        res.send(403);
                    }
                });

            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };

    function updateProfile(req, res, id, data) {
        console.log("Requst updateProfile is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 51, function (access) {
                if (access) {
                    profile.updateProfile(id, data.profile, res);
                } else {
                    res.send(403);
                }
            })
        } else {
            res.send(401);
        }
    };

    function removeProfile(req, res, id) {
        console.log("Requst removePerson is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 51, function (access) {
                if (access) {
                    profile.removeProfile(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------END------Profile-----------------------------------
    //---------------Persons--------------------------------
    function getPersonsForDd(req, res, data) {
        try {
            console.log("Requst getPersonsForDd is success");
            if (req.session && req.session.loggedIn) {
                employee.getForDd(req.session.uId, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getCustomer(req, res, data) {
        try {
            console.log("Requst getCustomer is success");
            if (req.session && req.session.loggedIn) {
                customer.getCustomers(res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
            res.send(500, { error: Exception });
        }
    };

    function getPersons(req, res, data) {
        console.log("Requst getPersons is success");
        if (req.session && req.session.loggedIn) {
            //persons.get(res);
            customer.getPersons(res);
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function getFilterPersons(req, res, data) {
        console.log("Requst getPersons is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 49, function (access) {
                console.log(access);
                if (access) {
                    customer.getFilterPersons(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function getPersonById(req, res, data) {
        console.log("Requst getPersons is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 49, function (access) {
                console.log(access);
                if (access) {
                    customer.getPersonById(data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function createPerson(req, res, data) {
        console.log("Requst createPerson is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 49, function (access) {
                if (access) {
                    data.person.uId = req.session.uId;
                    customer.create(data.person, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updatePerson(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 49, function (access) {
                if (access) {
                    data.person.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    customer.update(id, remove, data.person, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function uploadFile(req, res, id, file) {
        console.log("File Uploading to Persons");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 49, function (access) {
                if (access) {
                    customer.customer.update({ _id: id }, { $push: { attachments: file } }, function (err, response) {
                        if (err) {
                            res.send(401);
                        }
                        else {
                            res.send(200, file);
                        }
                    });
                    customer.update(id, remove, data.person, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removePerson(req, res, id) {
        console.log("Requst removePerson is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 49, function (access) {
                if (access) {
                    customer.remove(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };


    //---------END------Persons--------------------------------
    //---------------------Project--------------------------------
    function createProject(req, res, data) {
        console.log("Requst createProject is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 39, function (access) {
                if (access) {
                    data.project.uId = req.session.uId;
                    project.create(data.project, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjects(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.get(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsById(req, res, data) {
        console.log(data);
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 39, function (access) {
                if (access) {
                    project.getById(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsForDd(req, res, data) {
        console.log("Requst getProjectsForDd is success");
        if (req.session && req.session.loggedIn) {
            project.getForDd(res);
        } else {
            res.send(401);
        }
    };

    function updateProject(req, res, id, data) {
        console.log("Requst updateProject is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 39, function (access) {
                if (access) {
                    data.project.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    project.update(id, data.project, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeProject(req, res, id, data) {
        console.log("Requst removeProject is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 39, function (access) {
                if (access) {
                    project.remove(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------------END----Project-------------------------------
    //---------------------Tasks-------------------------------

    function createTask(req, res, data) {
        console.log("Requst createTask is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 40, function (access) {
                if (access) {
                    data.task.uId = req.session.uId;
                    project.createTask(data.task, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getTasks(req, res, data) {
        console.log("Requst getTasks is success");
        if (req.session && req.session.loggedIn) {
            project.getTasks(res);
        } else {
            res.send(401);
        }
    };

    function getTasksByProjectId(req, res, data) {
        console.log("Requst getTasksByProjectId is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksByProjectId(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getTaskById(req, res, data) {

        console.log("----------->Requst getTasksByProjectId is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 40, function (access) {
                if (access) {
                    project.getTaskById(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getTasksForList(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksForList(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function removeTask(req, res, id, data) {
        console.log("Requst removeTask is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 40, function (access) {
                if (access) {
                    project.removeTask(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateTask(req, res, id, data) {
        console.log("Requst updateTask is success");
        var date = Date.now();
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 40, function (access) {
                if (access) {
                    data.task['editedBy'] = {
                        user: req.session.uId,
                        date: date
                    };
                    project.updateTask(id, data.task, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getTasksPriority(req, res, data) {
        console.log("Requst getTasksPriority is success");
        if (req.session && req.session.loggedIn) {
            project.getTasksPriority(res);
        } else {
            res.send(401);
        }
    };

    //------------------END---Tasks------------------------------
    //------------------Workflow---------------------------------

    function getRelatedStatus(req, res, data) {
        console.log("Requst getRelatedStatus is success");
        if (req.session && req.session.loggedIn) {
            workflow.getRelatedStatus(res);
        } else {
            res.send(401);
        }
    };

    function getWorkflow(req, res, data) {
        console.log("Requst getWorkflow is success");
        if (req.session && req.session.loggedIn) {
            console.log('>>>>>>>>>>>');
            console.log(data);
            console.log('<<<<<<<<<<<');
            access.getReadAccess(req.session.uId, 44, function (access) {
                if (access) {
                    workflow.get(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getWorkflowsForDd(req, res, data) {
        console.log("Requst getWorkflowsForDd is Success");
        if (req.session && req.session.loggedIn) {
            console.log('<<<<<<<<<<<<>>>>>>>>>>>');
            console.log(data);
            console.log('<<<<<<<<<<<>>>>>>>>>>>>>');
            workflow.getWorkflowsForDd(data, res);
        } else {
            res.send(401);
        }
    };

    function createWorkflow(req, res, data) {
        console.log("Requst createWorkflow is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 44, function (access) {
                if (access) {
                    workflow.create(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateWorkflow(req, res, _id, data) {
        console.log("Requst updateWorkflow is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 44, function (access) {
                if (access) {
                    workflow.update(_id, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    
    function removeWorkflow(req, res, _id, data) {
        console.log("Requst removeWorkflow is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 50, function (access) {
                if (access) {
                	workflow.remove(_id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------------------Companies-------------------------------

    function getCompanies(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.getCompanies(res);

                } else {
                    res.send(403);
                }
            });

            //company.get(res);
        } else {
            res.send(401);
        }
    };

    function getCompanyById(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            //company.get(res);
            access.getReadAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.getCompanyById(data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getOwnCompanies(req, res, data) {
        console.log("Request getOwnCompanies is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 5, function (access) {
                if (access) {
                    customer.getOwnCompanies(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeCompany(req, res, id, data) {
        console.log("Requst removeCompany is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.remove(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function createCompany(req, res, data) {
        console.log("Requst createCompany is success");
        if (req.session && req.session.loggedIn) {
            data.company.uId = req.session.uId;
            access.getEditWritAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.create(data.company, res);

                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateCompany(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn) {
            var date = mongoose.Schema.Types.Date;
            data.company.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.update(id, remove, data.company, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };


    function getFilterCompanies(req, res, data) {
        console.log("Requst getFilterCompanies is success");
        if (req.session && req.session.loggedIn) {
            //company.get(res);
            access.getReadAccess(req.session.uId, 50, function (access) {
                if (access) {
                    customer.getFilterCompanies(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //----------------END-----Companies-------------------------------
    //---------------------JobPosition--------------------------------
    function createJobPosition(req, res, data) {

        if (req.session && req.session.loggedIn) {
            data.jobPosition.uId = req.session.uId;
            access.getEditWritAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.create(data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobPosition(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.get(res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getCustomJobPosition(req, res, data) {
        console.log("Requst getCustomJobPosition is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.getCustom(res);
                } else {
                    res.send(403);
                }
            });

            //company.get(res);
        } else {
            res.send(401);
        }
    };

    function getJobPositionById(req, res, data) {
        console.log("----------->Request getJobPositionById is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.getJobPositionById(data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }

    };

    function updateJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            data.jobPosition.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.update(id, data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.remove(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------END------JobPosition-----------------------------------
    //---------------------Employee--------------------------------
    function createEmployee(req, res, data) {
        console.log("Requst createEmployee is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(data.employee, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getEmployees(req, res) {
        console.log("Requst getEmployee is success");
        if (req.session && req.session.loggedIn) {
            employee.get(res);
        } else {
            res.send(401);
        }
    };

    // Custom function for list
    function getEmployeesCustom(req, res, data) {
        console.log("Requst getEmployeesCustom is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 42, function (access) {
                console.log(access);
                if (access) {
                    employee.getCustom(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }
    // Custom function for form
    function getEmployeesByIdCustom(req, res, data) {
        console.log('----------------}');
        console.log(data);
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 42, function (access) {
                console.log(access);
                if (access) {
                    employee.getById(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getEmployeesById(res, data) {
        console.log("Requst getTaskById is success");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Allow Cross Site Origin", "*");
        dbSession.checkHash(data, function (result) {
            console.log('Sending response for checkHash')
            console.log(result);
            if (result.result.status == '0') {
                employee.getById(data, function (result2) {
                    console.log('Sending response for getTaskById');
                    console.log(result2);
                    res.send(result2);
                });
            } else {
                result['result'] = {};
                result['result']['status'] = '4';
                result['result']['description'] = 'Bad hash';
                result['data'] = [];
                res.send(result);
            }
        });
    };

    function updateEmployees(req, res, id, data) {
        console.log("Requst updateEmployees is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    employee.update(id, data.employee, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };

    function removeEmployees(req, res, id, data) {
        console.log("Requst removeEmployees is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 42, function (access) {
                if (access) {
                    employee.remove(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------END------Employees-----------------------------------

    //---------------------Application--------------------------------
    function createApplication(req, res, data) {
        console.log("Requst createEmployee is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(data.employee, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplications(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            employee.getApplications(res);
        } else {
            res.send(401);
        }
    };

    // Custom function for list (getApplications)
    function getApplicationsCustom(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getCustom(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplicationById(req, res, data) {
        console.log("Requst getApplicationById is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getById(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };



    function getFilterApplications(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getFilterApplications(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateApplication(req, res, id, data) {
        console.log("Requst updateEmployees is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    employee.update(id, data.employee, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };
    function uploadApplicationFile(req, res, id, file) {
        console.log("File Uploading to Persons");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 43, function (access) {
                if (access) {
                    employee.update({ _id: id }, { $push: { attachments: file } }, function (err, response) {
                        if (err) {
                            res.send(401);
                        }
                        else {
                            res.send(200, file);
                        }
                    });
                    employee.update(id, remove, data.employee, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeApplication(req, res, id, data) {
        console.log("Requst removeEmployees is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 43, function (access) {
                if (access) {
                    employee.remove(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    //---------END------Application-----------------------------------

    //---------------------Department--------------------------------
    function createDepartment(req, res, data) {
        console.log("Requst createDepartment is success");
        if (req.session && req.session.loggedIn) {
            data.department.uId = req.session.uId;
            access.getEditWritAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.create(data.department, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartment(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.get(res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateDepartment(req, res, id, data) {
        console.log("Requst updateDepartment is success");
        if (req.session && req.session.loggedIn) {
            data.department.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.update(id, data.department, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeDepartment(req, res, id, data) {
        console.log("Requst removeDepartment is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.remove(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartmentForDd(req, res, data) {
        if (req.session && req.session.loggedIn) {
            department.getForDd(res);
        } else {
            res.send(401);
        }
    }

    function getCustomDepartment(req, res, data) {
        console.log("Requst getDepartment is success");
        if (req.session && req.session.loggedIn) {
            //company.get(res);
            access.getReadAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.getCustomDepartment(data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getDepartmentById(req, res, data) {
        console.log("----------->Request getDepartmentById is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 15, function (access) {
                if (access) {
                    department.getDepartmentById(data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };
    //---------END------Department----------------------------------

    function createDegree(req, res, data) {
        console.log("Requst createDegree is success");
        if (req.session && req.session.loggedIn) {
            degrees.create(data.degree, res);
        } else {
            res.send(401);
        }
    }

    function getDegrees(req, res, data) {
        if (req.session && req.session.loggedIn) {
            degrees.get(res);
        } else {
            res.send(401);
        }
    }

    function updateDegree(req, res, id, data) {
        console.log("Requst updateDegree is success");
        if (req.session && req.session.loggedIn) {
            degrees.update(id, data.degree, res);
        } else {
            res.send(401);
        }
    }

    function removeDegree(req, res, id, data) {
        console.log("Requst removeDegree is success");
        if (req.session && req.session.loggedIn) {
            degrees.remove(id, res);
        } else {
            res.send(401);
        }
    }
    //-----------------SourcesOfApplicants--------------------------------------
    function createSourcesOfApplicant(req, res, data) {
        console.log("Requst createSourcesOfApplicant is success");
        if (req.session && req.session.loggedIn) {
            sourcesofapplicants.create(data.soa, res);
        } else {
            res.send(401);
        }
    }

    function getSourcesOfApplicants(req, res, data) {
        console.log("Requst getSourcesOfApplicants is success");
        if (req.session && req.session.loggedIn) {
            sourcesofapplicants.get(res);
        } else {
            res.send(401);
        }
    }

    function updateSourcesOfApplicant(req, res, id, data) {
        console.log("Requst updateSourcesOfApplicant is success");
        if (req.session && req.session.loggedIn) {
            sourcesofapplicants.update(id, data.soa, res);
        } else {
            res.send(401);
        }
    }

    function removeSourcesOfApplicant(req, res, id, data) {
        console.log("Requst removeDegree is success");
        if (req.session && req.session.loggedIn) {
            sourcesofapplicants.remove(id, res);
        } else {
            res.send(401);
        }
    }

    function getLeads(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getLeads(res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getLeadsById(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getById(data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getLeadsCustom(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getLeadsCustom(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function createLead(req, res, data) {
        if (req.session && req.session.loggedIn) {
            data.lead.uId = req.session.uId;
            access.getEditWritAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.create(data.lead, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function updateLead(req, res, id, data) {
        var date = Date.now();
        if (req.session && req.session.loggedIn) {
            data.lead['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.update(id, data.lead, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function removeLead(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.remove(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }
    //-------------------Opportunities---------------------------
    function createOpportunitie(req, res, data) {
        if (req.session && req.session.loggedIn) {
            data.opportunitie.uId = req.session.uId;
            access.getEditWritAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.create(data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }
    function getOpportunityById(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getById(data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getFilterOpportunities(req, res, data) {
        console.log("Requst getFilterOpportunities is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getFilterOpportunities(data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getOpportunities(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.get(res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateOpportunitie(req, res, id, data) {
        var date = Date.now();
        if (req.session && req.session.loggedIn) {
            data.opportunitie['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.update(id, data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeOpportunitie(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.remove(id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    //--------------------Events--------------------------------
    function createEvent(req, res, data) {
        console.log("Requst createEvent is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.create(data.event, res, req);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getEvents(req, res, data) {
        console.log("Requst getEvents is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.get(data.idArray, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateEvent(req, res, id, data) {
        console.log("Requst updateEvent is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.update(id, data.event, res, req);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeEvent(req, res, id, data) {
        console.log("Requst removeEvents is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.remove(id, res, req);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }
    function createCalendar(req, res, data) {
        console.log("Requst createCalendar is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.createCalendar(data.calendar, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getCalendars(req, res, data) {
        console.log("Requst getCalendars is success");
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.getCalendars(res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateCalendar(req, res, id, data) {
        console.log("Requst updateCalendar is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.updateCalendar(id, data.calendar, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeCalendar(req, res, id, data) {
        console.log("Requst removeCalendar is success");
        if (req.session && req.session.loggedIn) {
            access.getDeleteAccess(req.session.uId, 26, function (access) {
                if (access) {
                    events.removeCalendar(id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function googleCalSync(req, res, data) {
        console.log("Requst googleCalSync is success");
        if (req.session && req.session.loggedIn) {
            access.getEditWritAccess(req.session.uId, 26, function (access) {
                if (access) {
                    google.getEventsByCalendarIds(req.session.credentials, data.calendar, function (eventsArray) {
                        events.googleCalSync(eventsArray, res);
                    });
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }
    function getXML(req, res, link, data) {
        access.getEditWritAccess(req.session.uId, 26, function (access) {
            if (access) {

                events.getXML(res, link);
            } else {
                res.send(403);
            }
        });
    }

    function getToken(req, res) {
        access.getReadAccess(req.session.uId, 26, function (access) {
            if (access) {
                google.getToken(req, res, function (token) {
                    res.redirect('#easyErp/Calendars');
                });
            } else {
                res.send(403);
            }
        });
    }

    function googleCalendars(req, res) {
        access.getReadAccess(req.session.uId, 26, function (access) {
            if (access) {
                google.getGoogleCalendars(req.session.credentials, res);
            } else {
                res.send(403);
            }
        });
    }
    function sendToGoogleCalendar(req, res) {
        access.getReadAccess(req.session.uId, 26, function (access) {
            if (access) {
                events.sendToGoogleCalendar(req, res);
            } else {
                res.send(403);
            }
        });
    }
    function changeSyncCalendar(id, isSync, res, req) {
        access.getEditWritAccess(req.session.uId, 26, function (access) {
            if (access) {
                events.changeSyncCalendar(id, isSync, res, req);
            } else {
                res.send(403);
            }
        });

    }

    //---------END------Events----------------------------------
    return {

        mongoose: mongoose,
        getModules: getModules,

        login: login,
        createUser: createUser,
        getUsers: getUsers,
        getUserById: getUserById,
        getFilterUsers: getFilterUsers,
        updateUser: updateUser,
        removeUser: removeUser,

        getProfile: getProfile,
        createProfile: createProfile,
        updateProfile: updateProfile,
        removeProfile: removeProfile,

        createPerson: createPerson,
        getPersons: getPersons,
        getPersonById: getPersonById,
        updatePerson: updatePerson,
        removePerson: removePerson,
        // getPersonsForDd: getPersonsForDd,
        uploadFile: uploadFile,
        getCustomer: getCustomer,
        getFilterPersons: getFilterPersons,

        getProjects: getProjects,
        getProjectsById: getProjectsById,
        getProjectsForDd: getProjectsForDd,
        createProject: createProject,
        updateProject: updateProject,
        removeProject: removeProject,

        createTask: createTask,
        getTasks: getTasks,
        getTasksByProjectId: getTasksByProjectId,
        getTaskById: getTaskById,
        getTasksForList: getTasksForList,
        updateTask: updateTask,
        removeTask: removeTask,
        getTasksPriority: getTasksPriority,

        getCompanies: getCompanies,
        getCompanyById: getCompanyById,
        getOwnCompanies: getOwnCompanies,
        removeCompany: removeCompany,
        createCompany: createCompany,
        updateCompany: updateCompany,
        getFilterCompanies: getFilterCompanies,

        getRelatedStatus: getRelatedStatus,
        getWorkflow: getWorkflow,
        createWorkflow: createWorkflow,
        updateWorkflow: updateWorkflow,
        getWorkflowsForDd: getWorkflowsForDd,
        removeWorkflow:removeWorkflow,

        getJobPosition: getJobPosition,
        createJobPosition: createJobPosition,
        updateJobPosition: updateJobPosition,
        removeJobPosition: removeJobPosition,
        getJobPositionById: getJobPositionById,

        createEmployee: createEmployee,
        getCustomJobPosition: getCustomJobPosition,
        getEmployees: getEmployees,
        getEmployeesCustom: getEmployeesCustom,
        getEmployeesByIdCustom: getEmployeesByIdCustom,
        getEmployeesById: getEmployeesById,
        removeEmployees: removeEmployees,
        updateEmployees: updateEmployees,

        getPersonsForDd: getPersonsForDd,
        getDepartmentForDd: getDepartmentForDd,

        createApplication: createApplication,
        getApplications: getApplications,
        getApplicationsCustom: getApplicationsCustom,
        removeApplication: removeApplication,
        updateApplication: updateApplication,
		uploadApplicationFile:uploadApplicationFile,

        getDepartment: getDepartment,
        createDepartment: createDepartment,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment,
        getDepartmentById: getDepartmentById,
        getCustomDepartment: getCustomDepartment,
        createDegree: createDegree,
        getDegrees: getDegrees,
        updateDegree: updateDegree,
        removeDegree: removeDegree,

        createSourcesOfApplicant: createSourcesOfApplicant,
        getSourcesOfApplicants: getSourcesOfApplicants,
        updateSourcesOfApplicant: updateSourcesOfApplicant,
        removeSourcesOfApplicant: removeSourcesOfApplicant,
        getFilterApplications: getFilterApplications,
        getApplicationById: getApplicationById,

        createLead: createLead,
        getLeads: getLeads,
        getLeadsCustom: getLeadsCustom,
        updateLead: updateLead,
        removeLead: removeLead,
        getLeadsById: getLeadsById,

        createOpportunitie: createOpportunitie,
        getFilterOpportunities: getFilterOpportunities,
        getOpportunities: getOpportunities,
        getOpportunityById: getOpportunityById,
        updateOpportunitie: updateOpportunitie,
        removeOpportunitie: removeOpportunitie,

        createEvent: createEvent,
        getEvents: getEvents,
        updateEvent: updateEvent,
        removeEvent: removeEvent,

        createCalendar: createCalendar,
        getCalendars: getCalendars,
        updateCalendar: updateCalendar,
        removeCalendar: removeCalendar,

        googleCalSync: googleCalSync,
        getXML: getXML,
        getToken: getToken,
        googleCalendars: googleCalendars,
        sendToGoogleCalendar: sendToGoogleCalendar,
        changeSyncCalendar: changeSyncCalendar
    }
}
//---------EXPORTS----------------------------------------
module.exports = requestHandler;
