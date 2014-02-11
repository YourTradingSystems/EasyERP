var requestHandler = function (fs, mongoose, event, dbsArray) {
    var logWriter = require("./Modules/additions/logWriter.js")(fs),
        models = require("./models.js")(dbsArray),
        department = require("./Modules/Department.js")(logWriter, mongoose, models),
        users = require("./Modules/Users.js")(logWriter, mongoose, models, department),
        profile = require("./Modules/Profile.js")(logWriter, mongoose, models),
        access = require("./Modules/additions/access.js")(profile.schema, users, models, logWriter),
        employee = require("./Modules/Employees.js")(logWriter, mongoose, event, department, models),
        google = require("./Modules/Google.js")(users, models),
        events = require("./Modules/Events.js")(logWriter, mongoose, google, models),
        customer = require("./Modules/Customers.js")(logWriter, mongoose, models, department),
        workflow = require("./Modules/Workflow.js")(logWriter, mongoose, models),
        project = require("./Modules/Projects.js")(logWriter, mongoose, department, models, workflow, event),
        jobPosition = require("./Modules/JobPosition.js")(logWriter, mongoose, employee, department, models),
        degrees = require("./Modules/Degrees.js")(logWriter, mongoose, models),
        campaigns = require("./Modules/Campaigns.js")(logWriter, mongoose, models),
        opportunities = require("./Modules/Opportunities.js")(logWriter, mongoose, customer, workflow, department, models),
        modules = require("./Modules/Module.js")(logWriter, mongoose, profile, models),
        sources = require("./Modules/Sources.js")(logWriter, mongoose, models),
        jobType = require("./Modules/JobType.js")(logWriter, mongoose, models),
        birthdays = require("./Modules/Birthdays.js")(logWriter, mongoose, employee, models, event);

    Array.prototype.objectID = function () {

        var _arrayOfID = [];
        var newObjectId = mongoose.Types.ObjectId;
        for (var i = 0; i < this.length; i++) {
            if (typeof this[i] == 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else {
                if (typeof this[i] == 'string' && this[i].length === 24) {
                    _arrayOfID.push(newObjectId(this[i]));
                }
            }
        }
        return _arrayOfID;
    };

    Array.prototype.getShowmore = function (countPerPage) {
        var showMore = false;
        for (var i = 0; i < this.length; i++) {
            if (this[i].count > countPerPage) {
                showMore = true;
            }
        }
        return showMore;
    };

    function getModules(req, res) {
        console.log("Requst get Modules is success");
        // if (req.session && req.session.loggedIn && req.session.lastDb ) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb - 1, 'Users', users.schema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.get(req, _user.profile, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function redirectFromModuleId(req, res, id) {
        console.log("Requst get Modules is success");
        // if (req.session && req.session.loggedIn && req.session.lastDb ) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb - 1, 'Users', users.schema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.redirectToUrl(req, _user.profile, res, id);
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

    // Get users Total count
    function usersTotalCollectionLength(req, res) {
        users.getTotalCount(req, res);
    }

    function createUser(req, res, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.createUser(req, data.user, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUsers(req, res, data);
        } else {
            res.send(401);
        }
    };

    function currentUser(req, res) {
        console.log("Requst currentUser is success");
        console.log(req.session);
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUserById(req, req.session.uId, res);
        } else {
            res.send(401);
        }
    };

    function getUsersForDd(req, res) {
        console.log("Requst getUsers is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUsersForDd(req, res);
        } else {
            res.send(401);
        }
    };

    // Get users for list
    function getFilterUsers(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 7, function (access) {
                console.log(access);
                if (access) {
                    users.getFilter(req, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 7, function (access) {
                console.log(access);
                if (access) {
                    users.getUserById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function updateCurrentUser(req, res, data) {
        console.log("Requst updateCurrentUser is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.updateUser(req, req.session.uId, req.body, res, data);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateUser(req, res, id, data) {
        console.log("Requst createUser is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.updateUser(req, id, data.user, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.removeUser(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.createProfile(req, data.profile, res);
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
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getReadAccess(req, req.session.uId, 51, function (access) {
                    console.log(access);
                    if (access) {
                        profile.getProfile(req, res);
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

    function getProfileForDd(req, res) {
        try {
            console.log("Requst getProfile is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                profile.getProfileForDd(req, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.updateProfile(req, id, data.profile, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.removeProfile(req, id, res);
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
    function getForDdByRelatedUser(req, res, data) {
        try {
            console.log("Requst getPersonsForDd is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getForDdByRelatedUser(req, req.session.uId, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function Birthdays(req, res, data) {
        try {
            console.log("Requst getPersonsForDd is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                birthdays.get(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getPersonsForDd(req, res, data) {
        try {
            console.log("Requst getPersonsForDd is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getForDd(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getFilterPersonsForMiniView(req, res, data) {
        try {
            console.log("Requst getPersonsForDd is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getFilterPersonsForMiniView(req, res, data);
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
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getCustomers(req, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            //persons.get(res);
            customer.getPersons(req, res);
        } else {
            res.send(401);
        }
        // console.log("Requst getPersons is success");
    };

    function getPersonById(req, res, data) {
        console.log("Requst getPersons is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 49, function (access) {
                console.log(access);
                if (access) {
                    customer.getPersonById(req, data.id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    data.person.uId = req.session.uId;
                    customer.create(req, data.person, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updatePerson(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    data.person.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    customer.update(req, id, remove, data.person, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function personUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
				if (access) {
					data.editedBy = {
						user: req.session.uId,
						date: new Date().toISOString()
					};
					customer.updateOnlySelectedFields(req, id, data, res);
				} else {
					res.send(403);
				}
			});
        } else {
            res.send(401);
        }
    }

    function uploadFile(req, res, id, file) {
        console.log("File Uploading to Persons");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    models.get(req.session.lastDb - 1, "Customers", customer.schema).update({ _id: id }, { $push: { attachments: file } }, function (err, response) {
                        if (err) {
                            res.send(401);
                        }
                        else {
                            res.send(200, file);
                        }
                    });
                    //customer.update(req, id, remove, data.person, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    customer.remove(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.uId = req.session.uId;
                    project.create(req, data.project, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateOnlySelectedFields(req, res, id, data) {
        console.log("Requst updateOnlySelectedFields is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            if (access) {
                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };
                project.updateOnlySelectedFields(req, id, data, res);
            } else {
                res.send(403);
            }
        } else {
            res.send(401);
        }
    }

    function getProjectsListLength(req, res, data) {
        console.log("Requst getProjectsListLength is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getListLength(req, data, res);
        } else {
            res.send(401);
        }
    }

    function getProjectType(req, res) {
        console.log("Requst getProjectsListLength is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getProjectType(req, res);
        } else {
            res.send(401);
        }
    }

    function getProjects(req, res, data, next) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.get(req, data, res, next);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function getProjectPMForDashboard(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectPMForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectByEndDateForDashboard(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectByEndDateForDashboard(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectStatusCountForDashboard(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectStatusCountForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function getProjectsForList(req, res, data) {
        console.log("Requst getProjects is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectsForList(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsById(req, res, data) {
        
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getById(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getForDd(req, res);
        } else {
            res.send(401);
        }
    };

    function updateProject(req, res, id, data, remove) {
        console.log("Requst updateProject is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    project.update(req, id, data.project, res, remove);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function uploadProjectsFiles(req, res, id, file) {
        console.log("File Uploading to Project");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    console.log(file);
                    project.update(req, id, { $push: { attachments: { $each: file } } }, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.remove(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    data.task.uId = req.session.uId;
                    project.createTask(req, data.task, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getTasksLengthByWorkflows(req, options, res) {
        project.getCollectionLengthByWorkflows(req, options, res);
    }

    function getTasks(req, res, data) {
        console.log("Requst getTasks is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getTasks(req, res);
        } else {
            res.send(401);
        }
    };

    function getTasksByProjectId(req, res, data) {
        console.log("Requst getTasksByProjectId is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksByProjectId(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTaskById(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getTasksForList(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksForList(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getTasksForKanban(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksForKanban(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.removeTask(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateTask(req, res, id, data, remove) {
        console.log("Requst updateTask is success");
        var date = Date.now();
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    data.task['editedBy'] = {
                        user: req.session.uId,
                        date: date
                    };
                    project.updateTask(req, id, data.task, res, remove);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function taskUpdateOnlySelectedFields(req, res, id, data) {
        console.log("Requst updateOnlySelectedFields is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            if (access) {
                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };
                project.taskUpdateOnlySelectedFields(req, id, data, res);
            } else {
                res.send(403);
            }
        } else {
            res.send(401);
        }
    }

    function uploadTasksFiles(req, res, id, file) {
        console.log("File Uploading to app");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    console.log(file);
                    project.updateTask(req, id, { $push: { attachments: { $each: file } } }, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getTasksPriority(req, res);
        } else {
            res.send(401);
        }
    };

    //------------------END---Tasks------------------------------
    //------------------Workflow---------------------------------

    function getRelatedStatus(req, res, data) {
        console.log("Requst getRelatedStatus is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            workflow.getRelatedStatus(req, res, data);
        } else {
            res.send(401);
        }
    };

    function getWorkflow(req, res, data) {
        console.log("Requst getWorkflow is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.get(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            console.log('<<<<<<<<<<<<>>>>>>>>>>>');
            
            console.log('<<<<<<<<<<<>>>>>>>>>>>>>');
            workflow.getWorkflowsForDd(req, data, res);
        } else {
            res.send(401);
        }
    };

    function createWorkflow(req, res, data) {
        console.log("Requst createWorkflow is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.create(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.update(req, _id, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    workflow.remove(req, _id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------------------Companies-------------------------------

    function getCompaniesForDd(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            customer.getCompaniesForDd(req, res);

        } else {
            res.send(401);
        }
    };

    function getCompanyById(req, res, data) {
        console.log("Requst getCompanies is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            //company.get(res);
            access.getReadAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.getCompanyById(req, data.id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 5, function (access) {
                if (access) {
                    customer.getOwnCompanies(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.remove(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.company.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.create(req, data.company, res);

                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateCompany(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            var date = mongoose.Schema.Types.Date;
            data.company.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.update(req, id, remove, data.company, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function companyUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
				if (access) {
					data.editedBy = {
						user: req.session.uId,
						date: new Date().toISOString()
					};
					customer.updateOnlySelectedFields(req, id, data, res);
				} else {
					res.send(403);
				}
			});
        } else {
            res.send(401);
        }
    }

    // Get  Persons or Companies or ownCompanies for list and thumbnail
    function getFilterCustomers(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb ) {
            access.getReadAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.getFilterCustomers(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    // Get  Persons or Companies or ownCompanies images for thumbnails
    function getCustomersImages(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    customer.getCustomersImages(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    // Get Alphabet for Companies or ownCompanies or Persons
    function getCustomersAlphabet(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getCustomersAlphabet(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };

    //----------------END-----Companies-------------------------------
    //---------------------JobPosition--------------------------------

    // get  jobPositions Total count
    function jobPositionsTotalCollectionLength(req, res) {
        jobPosition.getTotalCount(req, res);
    }

    function createJobPosition(req, res, data) {

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.jobPosition.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.create(req, data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobType(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            jobType.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getJobPosition(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.get(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobPositionForDd(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            jobPosition.getJobPositionForDd(req, res);
        } else {
            res.send(401);
        }
    };

    // Get JobPosition for list
    function getFilterJobPosition(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobPositionById(req, res, data) {
        console.log("----------->Request getJobPositionById is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.getJobPositionById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }

    };

    function updateJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.jobPosition.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.update(req, id, data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.remove(req, id, res);
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

    function employeesTotalCollectionLength(req, res) {
        employee.getTotalCount(req, res);
    }
    function createEmployee(req, res, data) {
        console.log("Requst createEmployee is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(req, data.employee, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            employee.get(req, res);
        } else {
            res.send(401);
        }
    };

    function uploadEmployeesFile(req, res, id, file) {
        console.log("File Uploading to app");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    console.log(file);
                    employee.update(req, id, { $push: { attachments: { $each: file } } }, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    // get employee or Applications for list or thumbnails
    function getEmployeesFilter(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    // Get Employee form by employee id
    function getEmployeesById(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.getById(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function updateEmployees(req, res, id, data) {
        console.log("Requst updateEmployees is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    employee.update(req, id, data.employee, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };
    function employeesUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
				if (access) {
					data.editedBy = {
						user: req.session.uId,
						date: new Date().toISOString()
					};
					employee.updateOnlySelectedFields(req, id, data, res);
				} else {
					res.send(403);
				}
			});
        } else {
            res.send(401);
        }
    }
    function removeEmployees(req, res, id, data) {
        console.log("Requst removeEmployees is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function getEmployeesAlphabet(req, res, data) {
        try {
            console.log("Requst getEmployeesAlphabet is success");
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getEmployeesAlphabet(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };


    //---------END------Employees-----------------------------------

    //---------------------Application--------------------------------
    function getApplicationsLengthByWorkflows(req, res) {
        employee.getCollectionLengthByWorkflows(req, res);
    }

    function createApplication(req, res, data) {
        console.log("Requst createEmployee is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(req, data.employee, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            employee.getApplications(req, res);
        } else {
            res.send(401);
        }
    };

    // Custom function for list (getApplications)
    function getApplicationsCustom(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getEmployeeForList(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplicationById(req, res) {
        console.log("Requst getApplicationById is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getById(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplicationsForKanban(req, res, data) {
        console.log("Requst getApplications is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getApplicationsForKanban(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getEmployeesImages(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                console.log(access);
                if (access) {
                    employee.getEmployeesImages(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    employee.update(req, id, data.employee, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };

    function uploadApplicationFile(req, res, id, file) {
        console.log("File Uploading to app");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    console.log(file);
                    employee.update(req, id, { $push: { attachments: { $each: file } } }, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function aplicationUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
				if (access) {
					data.editedBy = {
						user: req.session.uId,
						date: new Date().toISOString()
					};
					employee.updateOnlySelectedFields(req, id, data, res);
				} else {
					res.send(403);
				}
			});
        } else {
            res.send(401);
        }
    }
    function removeApplication(req, res, id, data) {
        console.log("Requst removeEmployees is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.remove(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.department.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.create(req, data.department, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartment(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.get(req, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.department.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.update(req, id, data.department, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartmentForDd(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            department.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getDepartmentForEditDd(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            department.getForEditDd(req, id, res);
        } else {
            res.send(401);
        }
    }

    function getCustomDepartment(req, res, data) {
        console.log("Requst getDepartment is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            //company.get(res);
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.getCustomDepartment(req, data, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.getDepartmentById(req, data.id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.create(req, data.degree, res);
        } else {
            res.send(401);
        }
    }

    function getDegrees(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.get(req, res);
        } else {
            res.send(401);
        }
    }

    function updateDegree(req, res, id, data) {
        console.log("Requst updateDegree is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.update(req, id, data.degree, res);
        } else {
            res.send(401);
        }
    }

    function removeDegree(req, res, id, data) {
        console.log("Requst removeDegree is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.remove(req, id, res);
        } else {
            res.send(401);
        }
    }
    //-----------------Campaigns--------------------------------------
    function getCampaigns(req, res, data) {
        console.log("Requst getSourcesOfApplicants is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            campaigns.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getLeads(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getLeads(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getLeadsById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function createLead(req, res, data) {
        console.log(req.session);
        
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.lead.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.create(req, data.lead, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.lead['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.update(req, id, data.lead, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function removeLead(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getLeadsForChart(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getLeadsForChart(req, res, data);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }
    //-------------------Opportunities---------------------------

    // Get  Leads or Opportunities for List
    function getFilterOpportunities(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb ) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    // Get  Leads or Opportunities total count
    function opportunitiesTotalCollectionLength(req, res) {
        opportunities.getTotalCount(req, res);
    }

    function getOpportunitiesLengthByWorkflows(req, res) {
        opportunities.getCollectionLengthByWorkflows(req, res);
    }

    function createOpportunitie(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.opportunitie.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.create(req, data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getOpportunityById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getFilterOpportunitiesForMiniView(req, res, data) {
        console.log("Requst getFilterOpportunities is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getFilterOpportunitiesForMiniView(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };


    function getFilterOpportunitiesForKanban(req, res, data) {
        console.log("Requst getFilterOpportunities is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getFilterOpportunitiesForKanban(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getOpportunities(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.get(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateOpportunitie(req, res, id, data,remove) {
        var date = Date.now();
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.opportunitie['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.update(req, id, data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function opportunitieUpdateOnlySelectedFields(req, res, id, data) {
        console.log("Requst updateOnlySelectedFields is success");
		data = data.opportunitie;
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            if (access) {
                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };
                opportunities.updateOnlySelectedFields(req, id, data, res);
            } else {
                res.send(403);
            }
        } else {
            res.send(401);
        }
    }

    function removeOpportunitie(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }
    
    function uploadOpportunitiesFiles(req, res, id, file) {
        console.log("File Uploading to Project");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    console.log(file);
                    opportunities.update(req, id, { $push: { attachments: { $each: file } } }, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //--------------------Events--------------------------------
    function createEvent(req, res, data) {
        console.log("Requst createEvent is success");
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.create(req, data.event, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.get(req, data.idArray, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.update(req, id, data.event, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.remove(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.createCalendar(req, data.calendar, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.getCalendars(req, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.updateCalendar(req, id, data.calendar, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    events.removeCalendar(req, id, res);
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 26, function (access) {
                if (access) {
                    google.getEventsByCalendarIds(req, req.session.credentials, data.calendar, function (eventsArray) {
                        events.googleCalSync(req, eventsArray, res);
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
        access.getEditWritAccess(req, req.session.uId, 26, function (access) {
            if (access) {

                events.getXML(req, res, link);
            } else {
                res.send(403);
            }
        });
    }

    function getToken(req, res) {
        access.getReadAccess(req, req.session.uId, 26, function (access) {
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
        access.getReadAccess(req, req.session.uId, 26, function (access) {
            if (access) {
                google.getGoogleCalendars(req, req.session.credentials, res);
            } else {
                res.send(403);
            }
        });
    }
    function sendToGoogleCalendar(req, res) {
        access.getReadAccess(req, req.session.uId, 26, function (access) {
            if (access) {
                events.sendToGoogleCalendar(req, res);
            } else {
                res.send(403);
            }
        });
    }
    function changeSyncCalendar(req, id, isSync, res) {
        access.getEditWritAccess(req, req.session.uId, 26, function (access) {
            if (access) {
                events.changeSyncCalendar(req, id, isSync, res);
            } else {
                res.send(403);
            }
        });

    }
    function getSources(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            sources.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    // Get  Persons or Companies or ownCompanies total count
    function customerTotalCollectionLength(req, res) {
        customer.getTotalCount(req, res);
    }
    function projectsTotalCollectionLength(req, res) {
        project.getTotalCount(req, res);
    }
    //---------END------Events----------------------------------
    return {

        mongoose: mongoose,
        getModules: getModules,
		redirectFromModuleId:redirectFromModuleId,

        login: login,
        createUser: createUser,
        usersTotalCollectionLength: usersTotalCollectionLength,
        getUsers: getUsers,
        getUsersForDd: getUsersForDd,
        getUserById: getUserById,
        getFilterUsers: getFilterUsers,
        updateUser: updateUser,
        removeUser: removeUser,
        currentUser: currentUser,
        updateCurrentUser: updateCurrentUser,

        getProfile: getProfile,
        getProfileForDd: getProfileForDd,
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
        getFilterPersonsForMiniView: getFilterPersonsForMiniView,
		personUpdateOnlySelectedFields:personUpdateOnlySelectedFields,

        projectsTotalCollectionLength: projectsTotalCollectionLength,//for Showmore and Lists
        getProjects: getProjects,//for Thumbnails
        getProjectsListLength: getProjectsListLength,
        getProjectsForList: getProjectsForList,
        getProjectsById: getProjectsById,//Used for Edit view
        getProjectsForDd: getProjectsForDd,
        createProject: createProject,
        updateProject: updateProject,
        uploadProjectsFiles: uploadProjectsFiles,
        removeProject: removeProject,
        getProjectPMForDashboard: getProjectPMForDashboard,
        getProjectStatusCountForDashboard: getProjectStatusCountForDashboard,
        getProjectByEndDateForDashboard: getProjectByEndDateForDashboard,
        updateOnlySelectedFields: updateOnlySelectedFields,
		taskUpdateOnlySelectedFields: taskUpdateOnlySelectedFields,
        getProjectType: getProjectType,

        createTask: createTask,
        getTasksLengthByWorkflows: getTasksLengthByWorkflows,
        getTasks: getTasks,
        getTasksByProjectId: getTasksByProjectId,
        getTaskById: getTaskById,
        getTasksForList: getTasksForList,
        getTasksForKanban: getTasksForKanban,
        updateTask: updateTask,
        uploadTasksFiles: uploadTasksFiles,
        removeTask: removeTask,
        getTasksPriority: getTasksPriority,

        getCompaniesForDd: getCompaniesForDd,
        getCompanyById: getCompanyById,
        getOwnCompanies: getOwnCompanies,
        removeCompany: removeCompany,
        createCompany: createCompany,
        updateCompany: updateCompany,
		companyUpdateOnlySelectedFields:companyUpdateOnlySelectedFields,
        getFilterCustomers: getFilterCustomers,
        getCustomersImages: getCustomersImages,
        getCustomersAlphabet: getCustomersAlphabet,

        getRelatedStatus: getRelatedStatus,
        getWorkflow: getWorkflow,
        createWorkflow: createWorkflow,
        updateWorkflow: updateWorkflow,
        getWorkflowsForDd: getWorkflowsForDd,
        removeWorkflow: removeWorkflow,

        jobPositionsTotalCollectionLength: jobPositionsTotalCollectionLength,
        getJobPosition: getJobPosition,
        createJobPosition: createJobPosition,
        updateJobPosition: updateJobPosition,
        removeJobPosition: removeJobPosition,
        getJobPositionById: getJobPositionById,
        getJobPositionForDd: getJobPositionForDd,

        createEmployee: createEmployee,
        getFilterJobPosition: getFilterJobPosition,
        getEmployees: getEmployees,
        getForDdByRelatedUser: getForDdByRelatedUser,
        getEmployeesById: getEmployeesById,
        removeEmployees: removeEmployees,
        updateEmployees: updateEmployees,
        getEmployeesAlphabet: getEmployeesAlphabet,
        getEmployeesImages: getEmployeesImages,

        Birthdays: Birthdays,

        getPersonsForDd: getPersonsForDd,
        getDepartmentForDd: getDepartmentForDd,

        getApplicationsLengthByWorkflows: getApplicationsLengthByWorkflows,
        createApplication: createApplication,
        getApplications: getApplications,
        getApplicationsCustom: getApplicationsCustom,
        removeApplication: removeApplication,
        updateApplication: updateApplication,
        uploadApplicationFile: uploadApplicationFile,
		aplicationUpdateOnlySelectedFields:aplicationUpdateOnlySelectedFields,
		employeesUpdateOnlySelectedFields:employeesUpdateOnlySelectedFields,

        getDepartment: getDepartment,
        createDepartment: createDepartment,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment,
        getDepartmentById: getDepartmentById,
        getCustomDepartment: getCustomDepartment,
        getDepartmentForEditDd: getDepartmentForEditDd,
        createDegree: createDegree,
        getDegrees: getDegrees,
        updateDegree: updateDegree,
        removeDegree: removeDegree,

		getCampaigns:getCampaigns,
        employeesTotalCollectionLength: employeesTotalCollectionLength,
        getEmployeesFilter: getEmployeesFilter,
        uploadEmployeesFile: uploadEmployeesFile,
        getApplicationById: getApplicationById,
        getApplicationsForKanban: getApplicationsForKanban,

        createLead: createLead,
        getLeads: getLeads,
        updateLead: updateLead,
        removeLead: removeLead,
        getLeadsById: getLeadsById,
        getLeadsForChart: getLeadsForChart,

        opportunitiesTotalCollectionLength: opportunitiesTotalCollectionLength,
        getOpportunitiesLengthByWorkflows: getOpportunitiesLengthByWorkflows,
        createOpportunitie: createOpportunitie,
        getFilterOpportunities: getFilterOpportunities,
        getFilterOpportunitiesForMiniView: getFilterOpportunitiesForMiniView,
        getFilterOpportunitiesForKanban: getFilterOpportunitiesForKanban,
        getOpportunities: getOpportunities,
        getOpportunityById: getOpportunityById,
        updateOpportunitie: updateOpportunitie,
        removeOpportunitie: removeOpportunitie,
		opportunitieUpdateOnlySelectedFields: opportunitieUpdateOnlySelectedFields,
		uploadOpportunitiesFiles:uploadOpportunitiesFiles,

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
        changeSyncCalendar: changeSyncCalendar,

        getSources: getSources,
        getJobType: getJobType,
        customerTotalCollectionLength: customerTotalCollectionLength

    }
}
//---------EXPORTS----------------------------------------
module.exports = requestHandler;
