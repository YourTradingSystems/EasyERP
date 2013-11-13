var requestHandler = function (fs, mongoose) {
    var logWriter = require("./Modules/additions/logWriter.js")(fs),
        event = require("./Modules/additions/eventHandler.js")().event,
        employee = require("./Modules/Employees.js")(logWriter, mongoose),
        company = require("./Modules/Companies.js")(logWriter, mongoose, employee.employee, event),
        findCompany = require("./Modules/additions/findCompany.js")(company.Company),
        events = require("./Modules/Events.js")(logWriter, mongoose),
        users = require("./Modules/Users.js")(logWriter, mongoose, findCompany),
        persons = require("./Modules/Persons.js")(logWriter, mongoose, findCompany),
        project = require("./Modules/Projects.js")(logWriter, mongoose),
        workflow = require("./Modules/Workflow.js")(logWriter, mongoose),
        profile = require("./Modules/Profile.js")(logWriter, mongoose),
        jobPosition = require("./Modules/JobPosition.js")(logWriter, mongoose, employee),
        department = require("./Modules/Department.js")(logWriter, mongoose, employee.employee, event),
        degrees = require("./Modules/Degrees.js")(logWriter, mongoose),
        sourcesofapplicants = require("./Modules/SourcesOfApplicants.js")(logWriter, mongoose),
        opportunities = require("./Modules/Opportunities.js")(logWriter, mongoose, persons, company),
        modules = require("./Modules/Module.js")(logWriter, mongoose, users, profile);
    
    function getModules(req, res) {
        if (req.session && req.session.loggedIn) {
            modules.get(req.session.uId, res);
        } else {
            res.send(401);
        }
    };

    //function getNewModules(res, data) {
    //    console.log("Requst getModules is success");
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header("Allow Cross Site Origin", "*");
    //    //console.log(req.session && req.session.loggedIn);
    //    if (req.session && req.session.loggedIn) {
    //        modules.getNewModules(data, function (result1) {
    //            console.log('Sending response for getModules');
    //            //console.log(JSON.stringify(result));
    //            res.send(result1);
    //        });
    //    } else {
    //        result['result'] = {};
    //        result['result']['status'] = '4';
    //        result['result']['description'] = 'Bad hash';
    //        result['data'] = [];
    //        res.send(result);
    //    }
    //};

    //---------------Users--------------------------------
    function login(req, res, data) {
        console.log("Requst LOGIN is success");
        users.login(req, data, function (result) {
            res.send(result);
        });
    };

    function createUser(req, res, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn) {
            users.create(data.user, res);
        } else {
            res.send(401);
        }
    };

    function getUsers(req, res, data) {
        console.log("Requst getUsers is success");
        if (req.session && req.session.loggedIn) {
            users.get(res);
        } else {
            res.send(401);
        }
    };

    function updateUser(req, res, id, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn) {
            users.update(id, data.user, res);
        } else {
            res.send(401);
        }
    };

    function removeUser(req, res, id) {
        console.log("Requst removeUser is success");
        if (req.session && req.session.loggedIn) {
            users.remove(id, res);
        } else {
            res.send(401);
        }
    };

    //---------END------Users--------------------------------
    //---------------------Profile--------------------------------
    function createProfile(req, res, data) {
        if (req.session && req.session.loggedIn) {
            profile.create(data.profile, res);
        } else {
            res.send(401);
        }
    };

    function getProfile(req, res) {
        try {
            console.log("Requst getProfile is success");
            if (req.session && req.session.loggedIn) {
                profile.get(res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function updateProfile(req, res, id, data) {
        console.log("Requst updateProfile is success");
        if (req.session && req.session.loggedIn) {
            profile.update(id, data.profile, res);
        } else {
            res.send(401);
        }
    };

    function removeProfile(req, res, id) {
        console.log("Requst removePerson is success");
        if (req.session && req.session.loggedIn) {
            profile.remove(id, res);
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
                //persons.getForDd(function (result2) {
                //    console.log('Sending response for getPersonsForDd');
                //    console.log(result2);
                //    res.send(result2);
                //});
                employee.getForDd(res);
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
                persons.getCustomers(company, res);
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
            persons.get(res);
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function createPerson(req, res, data) {
        console.log("Requst createPerson is success");
        if (req.session && req.session.loggedIn) {
            persons.create(data.person, res);
        } else {
            res.send(401);
        }
    };

    function updatePerson(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            persons.update(id, data.person, res);
        } else {
            res.send(401);
        }
    };
    function uploadFilePerson(req, res, id, file) {
        console.log("File Uploading to Persons");   
        if (req.session && req.session.loggedIn) {
            persons.Person.update({ _id: id }, { $push: { attachments: file } }, function (err, response) {
                if (err) {
                    res.send(401);
                }
                else {
                    res.send(200, file);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removePerson(req, res, id) {
        console.log("Requst removePerson is success");
        if (req.session && req.session.loggedIn) {
            persons.remove(id, res);
        } else {
            res.send(401);
        }
    };


    //---------END------Persons--------------------------------
    //---------------------Project--------------------------------
    function createProject(req, res, data) {
        console.log("Requst createProject is success");
        if (req.session && req.session.loggedIn) {
            project.create(data.project, res);
        } else {
            res.send(401);
        }
    };

    function getProjects(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn) {
            project.get(res);
        } else {
            res.send(401);
        }
    };

    function getProjectsById(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn) {
            project.getById(data.id, res);
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
            project.update(id, data.project, res);
        } else {
            res.send(401);
        }
    };

    function removeProject(req, res, id, data) {
        console.log("Requst removeProject is success");
        if (req.session && req.session.loggedIn) {
            project.remove(id, res);
        } else {
            res.send(401);
        }
    };

    //---------------END----Project-------------------------------
    //---------------------Tasks-------------------------------

    function createTask(req, res, data) {
        console.log("Requst createTask is success");
        if (req.session && req.session.loggedIn) {
            project.createTask(data.task, res);
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

    function getTasksByProjectId(res, data) {
        console.log("Requst getTasksByProjectId is success");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Allow Cross Site Origin", "*");
        dbSession.checkHash(data, function (result) {
            console.log('Sending response for checkHash')
            console.log(result);
            if (result.result.status == '0') {
                project.getTasksByProjectId(data, function (result2) {
                    console.log('Sending response for getTasksByProjectId');
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

    function getTaskById(res, data) {
        console.log("Requst getTaskById is success");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Allow Cross Site Origin", "*");
        dbSession.checkHash(data, function (result) {
            console.log('Sending response for checkHash')
            console.log(result);
            if (result.result.status == '0') {
                project.getTaskById(data, function (result2) {
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

    function removeTask(req, res, id, data) {
        console.log("Requst removeTask is success");
        if (req.session && req.session.loggedIn) {
            project.removeTask(id, res);
        } else {
            res.send(401);
        }
    };

    function updateTask(req, res, id, data) {
        console.log("Requst updateTask is success");
        if (req.session && req.session.loggedIn) {
            project.updateTask(id, data.task, res);
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
            workflow.get(data, res);
        } else {
            res.send(401);
        }
    };

    function gettaskWorkflows(req, res, data) {
        console.log("Requst gettaskWorkflow is success");
        if (req.session && req.session.loggedIn) {
            console.log('>>>>>>>>>>>>>>>');
            console.log(data);
            console.log('<<<<<<<<<<<');
            workflow.getTasksforDd(data, res);
        } else {
            res.send(401);
        }
    };

    function getprojectWorkflows(req, res, data) {
        console.log("Requst gettaskWorkflow is success");
        if (req.session && req.session.loggedIn) {
            console.log('>>>>>>>>>>>>>>>');
            console.log(data);
            console.log('<<<<<<<<<<<');
            workflow.getProjectsforDd(data, res);
        } else {
            res.send(401);
        }
    };


    function createWorkflow(req, res, data) {
        console.log("Requst createWorkflow is success");
        if (req.session && req.session.loggedIn) {
            workflow.create(data, res);
        } else {
            res.send(401);
        }
    };
    
    function updateWorkflow(req, res, _id, data) {
        console.log("Requst createWorkflow is success");
        if (req.session && req.session.loggedIn) {
            workflow.update(_id, data, res);
        } else {
            res.send(401);
        }
    };
    //---------------------Companies-------------------------------
    function getCompanies(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            company.get(res);
        } else {
            res.send(401);
        }
    };

    function getOwnCompanies(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            company.getOwn(res);
        } else {
            res.send(401);
        }
    };

    function removeCompany(req, res, id, data) {
        console.log("Requst removeCompany is success");
        if (req.session && req.session.loggedIn) {
            company.remove(id, res);
        } else {
            res.send(401);
        }
    };

    function createCompany(req, res, data) {
        console.log("Requst createCompany is success");
        if (req.session && req.session.loggedIn) {
            company.create(data.company, res);
        } else {
            res.send(401);
        }
    };

    function updateCompany(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            company.update(id, data.company, res);
        } else {
            res.send(401);
        }
    };
    //----------------END-----Companies-------------------------------
    //---------------------JobPosition--------------------------------
    function createJobPosition(req, res, data) {
        if (req.session && req.session.loggedIn) {
            jobPosition.create(data.jobPosition, res);
        } else {
            res.send(401);
        }
    };

    function getJobPosition(req, res, data) {

        if (req.session && req.session.loggedIn) {
            jobPosition.get(res);
        } else {
            res.send(401);
        }
    };

    function updateJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            jobPosition.update(id, data.jobPosition, res);
        } else {
            res.send(401);
        }
    };

    function removeJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            jobPosition.remove(id, res);
        } else {
            res.send(401);
        }
    };

    //---------END------JobPosition-----------------------------------
    //---------------------Employee--------------------------------
    function createEmployee(req, res, data) {
        console.log("Requst createEmployee is success");
        if (req.session && req.session.loggedIn) {
            employee.create(data.employee, res);
        } else {
            res.send(401);
        }
    };

    function getEmployees(req, res, data) {
        console.log("Requst getEmployee is success");
        if (req.session && req.session.loggedIn) {
            employee.get(res);
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
            employee.update(id, data.employee, res);
        } else {
            res.send(401);
        }
    };

    function removeEmployees(req, res, id, data) {
        console.log("Requst removeEmployees is success");
        if (req.session && req.session.loggedIn) {
            employee.remove(id, res);
        } else {
            res.send(401);
        }
    };
    //---------END------Employees-----------------------------------

    //---------------------Application--------------------------------
    //function createApplication(res, data) {
    //    console.log("Requst createEmployee is success");
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header("Allow Cross Site Origin", "*");
    //    dbSession.checkHash(data, function (result) {
    //        console.log('Sending response for checkHash')
    //        console.log(result);
    //        if (result.result.status == '0') {
    //            employee.create(data.employee, function (result) {
    //                console.log('Sending response for createEmployee');
    //                console.log(result);
    //                res.send(result);
    //            });
    //        } else {
    //            result['result'] = {};
    //            result['result']['status'] = '4';
    //            result['result']['description'] = 'Bad hash';
    //            result['data'] = [];
    //            res.send(result);
    //        }
    //    });
    //};

    function getApplications(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            employee.getApplications(res);
        } else {
            res.send(401);
        }
    };

    //function updateApplication(res, id, data) {
    //    console.log("Requst updateEmployees is success");
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header("Allow Cross Site Origin", "*");
    //    dbSession.checkHash(data, function (result) {
    //        console.log('Sending response for checkHash')
    //        console.log(result);
    //        if (result.result.status == '0') {
    //            employee.update(id, data.employee, function (result2) {
    //                console.log('Sending response for updateEmployees');
    //                console.log(result2);
    //                res.send(result2);
    //            });
    //        } else {
    //            result['result'] = {};
    //            result['result']['status'] = '4';
    //            result['result']['description'] = 'Bad hash';
    //            result['data'] = [];
    //            res.send(result);
    //        }
    //    });
    //};

    //function removeApplication(res, id, data) {
    //    console.log("Requst removeEmployees is success");
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header("Allow Cross Site Origin", "*");
    //    dbSession.checkHash(data, function (result) {
    //        console.log('Sending response for checkHash')
    //        console.log(result);
    //        if (result.result.status == '0') {
    //            employee.remove(id, function (result2) {
    //                console.log('Sending response for removeEmployees');
    //                console.log(result2);
    //                res.send(result2);
    //            });
    //        } else {
    //            result['result'] = {};
    //            result['result']['status'] = '4';
    //            result['result']['description'] = 'Bad hash';
    //            result['data'] = [];
    //            res.send(result);
    //        }
    //    });
    //};
    //---------END------Application-----------------------------------

    //---------------------Department--------------------------------
    function createDepartment(req, res, data) {
        console.log("Requst createDepartment is success");
        if (req.session && req.session.loggedIn) {
            department.create(data.department, res);
        } else {
            res.send(401);
        }
    }

    function getDepartment(req, res, data) {
        if (req.session && req.session.loggedIn) {
            department.get(res);
        } else {
            res.send(401);
        }
    }

    function updateDepartment(req, res, id, data) {
        console.log("Requst updateDepartment is success");
        if (req.session && req.session.loggedIn) {
            department.update(id, data.department, res);
        } else {
            res.send(401);
        }
    }

    function removeDepartment(req, res, id, data) {
        console.log("Requst removeDepartment is success");
        if (req.session && req.session.loggedIn) {
            department.remove(id, res);
        } else {
            res.send(401);
        }
    }
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
            opportunities.getLeads(res);
        } else {
            res.send(401);
        }
    }

    function createLead(req, res, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.create(data.lead, res);
        } else {
            res.send(401);
        }
    }

    function updateLead(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.update(id, data.lead, res);
        } else {
            res.send(401);
        }
    }

    function removeLead(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.remove(id, res);
        } else {
            res.send(401);
        }
    }
    //-------------------Opportunities---------------------------
    function createOpportunitie(req, res, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.create(data.opportunitie, res);
        } else {
            res.send(401);
        }
    }

    function getOpportunities(req, res, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.get(res);
        } else {
            res.send(401);
        }
    }

    function updateOpportunitie(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.update(id, data.opportunitie, res);
        } else {
            res.send(401);
        }
    }

    function removeOpportunitie(req, res, id, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.remove(id, res);
        } else {
            res.send(401);
        }
    }

    //--------------------Events--------------------------------
    function createEvent(req, res, data) {
        console.log("Requst createEvent is success");
        if (req.session && req.session.loggedIn) {
            events.create(data.event, res);
        } else {
            res.send(401);
        }
    }

    function getEvents(req, res, data) {
        console.log("Requst getEvents is success");
        if (req.session && req.session.loggedIn) {
            events.get(res);
        } else {
            res.send(401);
        }
    }

    function updateEvent(req, res, id, data) {
        console.log("Requst updateEvent is success");
        if (req.session && req.session.loggedIn) {
            events.update(id, data.event, res);
        } else {
            res.send(401);
        }
    }

    function removeEvent(req, res, id, data) {
        console.log("Requst removeEvents is success");
        if (req.session && req.session.loggedIn) {
            events.remove(id, res);
        } else {
            res.send(401);
        }
    }
    //---------END------Events----------------------------------

    return {

        mongoose: mongoose,
        getModules: getModules,
        //getNewModules: getNewModules,

        login: login,
        createUser: createUser,
        getUsers: getUsers,
        updateUser: updateUser,
        removeUser: removeUser,

        createPerson: createPerson,
        getPersons: getPersons,
        updatePerson: updatePerson,
        removePerson: removePerson,
        getPersonsForDd: getPersonsForDd,
        uploadFilePerson: uploadFilePerson,
        getCustomer: getCustomer,

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
        updateTask: updateTask,
        removeTask: removeTask,
        getTasksPriority: getTasksPriority,

        getCompanies: getCompanies,
        getOwnCompanies: getOwnCompanies,
        removeCompany: removeCompany,
        createCompany: createCompany,
        updateCompany: updateCompany,

        getRelatedStatus: getRelatedStatus,
        getWorkflow: getWorkflow,
        createWorkflow: createWorkflow,
        updateWorkflow: updateWorkflow,

        gettaskWorkflows: gettaskWorkflows,
        getprojectWorkflows: getprojectWorkflows,

        getProfile: getProfile,
        createProfile: createProfile,
        updateProfile: updateProfile,
        removeProfile: removeProfile,

        getJobPosition: getJobPosition,
        createJobPosition: createJobPosition,
        updateJobPosition: updateJobPosition,
        removeJobPosition: removeJobPosition,

        createEmployee: createEmployee,
        getEmployees: getEmployees,
        getEmployeesById: getEmployeesById,
        removeEmployees: removeEmployees,
        updateEmployees: updateEmployees,

        //createApplication: createApplication,
        getApplications: getApplications,
        //removeApplication: removeApplication,
        //updateApplication: updateApplication,

        getDepartment: getDepartment,
        createDepartment: createDepartment,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment,

        createDegree: createDegree,
        getDegrees: getDegrees,
        updateDegree: updateDegree,
        removeDegree: removeDegree,

        createSourcesOfApplicant: createSourcesOfApplicant,
        getSourcesOfApplicants: getSourcesOfApplicants,
        updateSourcesOfApplicant: updateSourcesOfApplicant,
        removeSourcesOfApplicant: removeSourcesOfApplicant,

        createLead: createLead,
        getLeads: getLeads,
        updateLead: updateLead,
        removeLead: removeLead,

        createOpportunitie: createOpportunitie,
        getOpportunities: getOpportunities,
        updateOpportunitie: updateOpportunitie,
        removeOpportunitie: removeOpportunitie,

        createEvent: createEvent,
        getEvents: getEvents,
        updateEvent: updateEvent,
        removeEvent: removeEvent
    }
}
//---------EXPORTS----------------------------------------
module.exports = requestHandler;