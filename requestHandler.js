var requestHandler = function (fs, mongoose) {
    var logWriter = require("./Modules/additions/logWriter.js")(fs),
        event = require("./Modules/additions/eventHandler.js")().event,
        employee = require("./Modules/Employees.js")(logWriter, mongoose),
        company = require("./Modules/Companies.js")(logWriter, mongoose, employee.employee, event),
        findCompany = require("./Modules/additions/findCompany.js")(company.Company),
        events = require("./Modules/Events.js")(logWriter, mongoose),
        users = require("./Modules/Users.js")(logWriter, mongoose, findCompany),
        project = require("./Modules/Projects.js")(logWriter, mongoose),
        customer = require("./Modules/Customers.js")(logWriter, mongoose),
        workflow = require("./Modules/Workflow.js")(logWriter, mongoose),
        profile = require("./Modules/Profile.js")(logWriter, mongoose),
        jobPosition = require("./Modules/JobPosition.js")(logWriter, mongoose, employee),
        department = require("./Modules/Department.js")(logWriter, mongoose, employee.employee, event),
        degrees = require("./Modules/Degrees.js")(logWriter, mongoose),
        sourcesofapplicants = require("./Modules/SourcesOfApplicants.js")(logWriter, mongoose),
        opportunities = require("./Modules/Opportunities.js")(logWriter, mongoose, customer),
        modules = require("./Modules/Module.js")(logWriter, mongoose, users, profile),
	    request = require('request');

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
            //persons.get(res);
            customer.getFilterPersons(data, res);
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function getPersonById(req, res, data) {
        console.log("Requst getPersons is success");
        if (req.session && req.session.loggedIn) {
            //persons.get(res);
            customer.getPersonById(data.id, res);
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function createPerson(req, res, data) {
        console.log("Requst createPerson is success");
        if (req.session && req.session.loggedIn) {
            customer.create(data.person, res);
        } else {
            res.send(401);
        }
    };

    function updatePerson(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn) {
            console.log('----------->>>>>>>>>>>>>>>update');
            customer.update(id, remove, data.person, res);
        } else {
            res.send(401);
        }
    };
    function uploadFile(req, res, id, file) {
        console.log("File Uploading to Persons");
        if (req.session && req.session.loggedIn) {
            customer.customer.update({ _id: id }, { $push: { attachments: file } }, function (err, response) {
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
            customer.remove(id, res);
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
            project.get(data, res);
        } else {
            res.send(401);
        }
    };

    function getProjectsById(req, res, data) {
        console.log(data);
        if (req.session && req.session.loggedIn) {
            project.getById(data, res);
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

    function getTasksByProjectId(req, res, data) {
        console.log("Requst getTasksByProjectId is success");
        if (req.session && req.session.loggedIn) {
            project.getTasksByProjectId(data, res);
        } else {
            res.send(401);
        }
    };

    function getTaskById(req, res, data) {

        console.log("----------->Requst getTasksByProjectId is success");
        if (req.session && req.session.loggedIn) {
            project.getTaskById(data, res);
        } else {
            res.send(401);
        }

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
            workflow.create(data, res);
        } else {
            res.send(401);
        }
    };

    function updateWorkflow(req, res, _id, data) {
        console.log("Requst updateWorkflow is success");
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
            //company.get(res);
            customer.getCompanies(res);
        } else {
            res.send(401);
        }
    };

    function getCompanyById(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            //company.get(res);
            customer.getCompanyById(data.id, res);
        } else {
            res.send(401);
        }
    };

    function getOwnCompanies(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn) {
            customer.getOwnCompanies(res);
        } else {
            res.send(401);
        }
    };

    function removeCompany(req, res, id, data) {
        console.log("Requst removeCompany is success");
        if (req.session && req.session.loggedIn) {
            customer.remove(id, res);
        } else {
            res.send(401);
        }
    };

    function createCompany(req, res, data) {
        console.log("Requst createCompany is success");
        if (req.session && req.session.loggedIn) {
            customer.create(data.company, res);
        } else {
            res.send(401);
        }
    };

    function updateCompany(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn) {
            customer.update(id, remove, data.company, res);
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
            employee.getCustom(data, res);
        } else {
            res.send(401);
        }
    }
    // Custom function for form
    function getEmployeesByIdCustom(req, res, data) {
        console.log('----------------}');
        console.log(data);
        if (req.session && req.session.loggedIn) {
            employee.getById(data, res);
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

    // Custom function for list (getApplications)
    function getApplicationsCustom(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            employee.getCustom(data, res);
        } else {
            res.send(401);
        }
    };

    function getApplicationById(req, res, data) {
        console.log("Requst getApplicationById is success");
        if (req.session && req.session.loggedIn) {
            employee.getById(data, res);
        } else {
            res.send(401);
        }
    };



    function getFilterApplications(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn) {
            employee.getFilterApplications(data, res);
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

    function getDepartmentForDd(req, res, data) {
        if (req.session && req.session.loggedIn) {
            department.getForDd(res);
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

    function getOpportunityById(req, res, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.getById(data.id, res);
        } else {
            res.send(401);
        }
    }

    function getLeadsCustom(req, res, data) {
        if (req.session && req.session.loggedIn) {
            opportunities.getLeadsCustom(data, res);
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

    function getFilterOpportunities(req, res, data) {
        console.log("Requst getFilterOpportunities is success");
        if (req.session && req.session.loggedIn) {
            opportunities.getFilterOpportunities(data, res);
        } else {
            res.send(401);
        }
    };

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
    function createCalendar(req, res, data) {
        console.log("Requst createCalendar is success");
        if (req.session && req.session.loggedIn) {
            events.createCalendar(data.calendar, res);
        } else {
            res.send(401);
        }
    }

    function getCalendars(req, res, data) {
        console.log("Requst getCalendars is success");
        if (req.session && req.session.loggedIn) {
            events.getCalendars(res);
        } else {
            res.send(401);
        }
    }

    function updateCalendar(req, res, id, data) {
        console.log("Requst updateCalendar is success");
        if (req.session && req.session.loggedIn) {
            events.updateCalendar(id, data.calendar, res);
        } else {
            res.send(401);
        }
    }

    function removeCalendar(req, res, id, data) {
        console.log("Requst removeCalendar is success");
        if (req.session && req.session.loggedIn) {
            events.removeCalendar(id, res);
        } else {
            res.send(401);
        }
    }

    function googleCalSync(req, res, data) {
        console.log("Requst googleCalSync is success");
        if (req.session && req.session.loggedIn) {
            events.googleCalSync(data.calendars, res);
        } else {
            res.send(401);
        }
    }
	function getMonthFromLocal(s){
		switch(s){
			case "гру.":
			return 11;
 			case "січ.":
			return 1;
 			case "лис.":
			return 10;
		}
		return "mon";
	}
	function getDateFromString(s){
		console.log(s);
		var n = s.indexOf(":");
		s=s.substring(n+2,s.length-n);
		n = s.indexOf(" ");
		s=s.substring(n+1,s.length-n+2);
		
		var st = s.split("–")[0].trim();
		var end = s.split("–")[1].trim();
		st = st.split(" ")[0]+" "+getMonthFromLocal(st.split(" ")[1])+" "+st.split(" ")[2]+" "+st.split(" ")[3];
		if (end.split(" ").length>1){
			n = end.indexOf(" ");
			end=end.substring(n+1,end.length-n+2);
			end = end.split(" ")[0]+" "+getMonthFromLocal(end.split(" ")[1])+" "+end.split(" ")[2]+" "+end.split(" ")[3];
		}
		else{
			end = st.split(" ")[0]+" "+st.split(" ")[1]+" "+st.split(" ")[2]+" "+end;
		}
		return [st,end];
	}
    function getXML(req, res, link, data) {
		var headers = {
			'User-Agent':       'Opera/9.80 (Windows NT 6.1; Win64; x64) Presto/2.12.388 Version/12.11',
			'Content-Type':     'application/x-www-form-urlencoded'
		}
		var options = {
			url: link,
			method: 'GET',
			headers: headers
		}
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var parseString = require('xml2js').parseString;
				console.log(body);
				parseString(body, function (err, result) {
					var events=[];
					for (var i in result.feed.entry){
//						console.log(result.feed.entry[i]);
						var content = result.feed.entry[i].content[0]._.replace(/\n/g,"");
						var startDate = getDateFromString(content.split("<br />")[0]);
						var endDate = startDate[1];
						startDate = startDate[0];
						content = content.replace(/<br \/>/g," ");
						events.push({"id":result.feed.entry[i].id[0].split("/")[6],"title":result.feed.entry[i].title[0]._,"summary":content,"startDate":startDate,"endDate":endDate});
					}
					var calendar = {"id":result.feed.id[0].split("/")[6],"summary":result.feed.title[0]._,"description":result.feed.subtitle[0]._}
					calendar.entry = events;
					res.send(JSON.stringify(calendar));
				});
			}
		});
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
        updateTask: updateTask,
        removeTask: removeTask,
        getTasksPriority: getTasksPriority,

        getCompanies: getCompanies,
        getCompanyById: getCompanyById,
        getOwnCompanies: getOwnCompanies,
        removeCompany: removeCompany,
        createCompany: createCompany,
        updateCompany: updateCompany,

        getRelatedStatus: getRelatedStatus,
        getWorkflow: getWorkflow,
        createWorkflow: createWorkflow,
        updateWorkflow: updateWorkflow,
        getWorkflowsForDd: getWorkflowsForDd,

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
        getEmployeesCustom: getEmployeesCustom,
        getEmployeesByIdCustom: getEmployeesByIdCustom,
        getEmployeesById: getEmployeesById,
        removeEmployees: removeEmployees,
        updateEmployees: updateEmployees,

        getPersonsForDd: getPersonsForDd,
        getDepartmentForDd: getDepartmentForDd,

        //createApplication: createApplication,
        getApplications: getApplications,
        getApplicationsCustom: getApplicationsCustom,
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
        getFilterApplications: getFilterApplications,
        getApplicationById: getApplicationById,

        createLead: createLead,
        getLeads: getLeads,
        getLeadsCustom:getLeadsCustom,
        updateLead: updateLead,
        removeLead: removeLead,

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
		getXML: getXML
    }
}
//---------EXPORTS----------------------------------------
module.exports = requestHandler;
