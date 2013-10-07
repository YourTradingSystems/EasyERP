// JavaScript source code
var fs = require("fs"),
    employee = require("./Employees.js"),
    modules = require("./Module.js"),
    test = require("./test.js"),
    mongoose = require('mongoose'),
    users = require("./Users.js")(fs, mongoose);
var persons = require("./Persons.js")(fs, mongoose),
    project = require("./Projects.js")(fs, mongoose),
    company = require("./Companies.js")(fs, mongoose),
    workflow = require("./Workflow.js")(fs, mongoose);
    mongoose.connect('mongodb://localhost/CRM');
    var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connection to CRM_DB is success");
});



function errorLog(errr) {
    fs.open("log.txt", "a", 0644, function (err, file_handle) {
        if (!err) {
            var date = new Date();
            var res = "-------------------------------------------------------------------------------------\r\n"
                + date + " ---- " + errr + "\r\n"
                + "-------------------------------------------------------------------------------------\r\n";

            fs.write(file_handle, res, null, 'utf8', function (err, written) {
                if (!err) {
                    fs.close(file_handle);
                } else {
                    console.log(err)// Произошла ошибка при записи
                }
            });
        } else {
            // Обработка ошибок при открытии
        }
    });
}

function getModules(data, func) {
    
    try {
        modules.Module.get(data, func);
    }
    catch (Exception) {
        errorLog("MainDb.js getModules " + Exception);
    }
}

//---------------Users--------------------------------
function login(data, func) {
    try {
        users.login(data, func);
    }
    catch (e) {
        errorLog('MainDb.js login ' + e);
    }
}

function createUser(data, func) {
    try {
        users.create(data, func);
    }
    catch (e) {
        errorLog('MainDb.js createAccount ' + e);
    }
}
//------------END---Users--------------------------------
//---------------Persons--------------------------------
function createPerson(data, func) {
    try {
        persons.create(data, func);
    }
    catch (e) {
        errorLog('MainDb.js createPersons ' + e);
    }
}

function getPersons(func) {
    try {
        persons.get(func);
    }
    catch (e) {
        errorLog('MainDb.js getPersons ' + e);
    }
}

function updatePerson(id, data, func) {
    try {
        persons.update(id, data, func);
    }
    catch (e) {
        errorLog('MainDb.js updatePerson ' + e);
    }
}

function removePerson(id, func) {
    try {
        persons.remove(id, func);
    }
    catch (e) {
        errorLog('MainDb.js removePerson ' + e);
    }
}


function getPersonsForDd(options, func) {
    try {
        persons.getForDd(options, func);
    }
    catch (e) {
        errorLog('MainDb.js getPersons ' + e);
    }
}

function getPersonsById(id, func) {
    try {
        persons.getById(id, func);
    }
    catch (e) {
        errorLog('MainDb.js getPersonsById ' + e);
    }
}

function getCustomer(func) {
    try {
        var res = {};
        res['result'] = {};
        res['result']['status'] = '2';
        res['result']['description'] = 'An error was find';
        res['data'] = [];
        persons.getCustomersForDd(function (result) {
            if (result.result.status == '0') {
                console.log('---response Get CUSTOMER PERSONS ----')
                //company.Company.getCustomersForDd(function (result2) {
                //    if (result2.result.status == '0') {
                //        res['result']['status'] = '0';
                //        res['result']['description'] = 'returned Customers is success';
                //        res['data'] = result.data.concat(result2.data);
                      //func(res);
                func(result);
                    } else { func(res); }
                });
            //} else { func(res); }
        //});
    }
    catch (e) {
        errorLog('MainDb.js createAccount ' + e);
    }
}
//---------END------Persons--------------------------------
//------------------Projects-----------------------------
function getProjects(func) {
    try {
        project.get(func);
    }
    catch (e) {
        errorLog('MainDb.js login ' + e);
    }
}

function getProjectsForDd(func) {
    try {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log('In DBConnect');
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        project.getForDd(func);
    }
    catch (Exception) {
        errorLog("MainDB.js getProjectsForDd " + Exception);
    }

}

function createProject(data, func) {
    try {
        project.create(data.project, func);
    }
    catch (e) {
        errorLog('MainDb.js login ' + e);
    }
}

function updateProject(id, data, func) {
    try {
        project.update(id, data.project, func);
    }
    catch (e) {
        errorLog('MainDb.js login ' + e);
    }
}

function removeProject(id, func) {
    try {
        project.remove(id, func);
    }
    catch (e) {
        errorLog('MainDb.js login ' + e);
    }
}

function getTasks(data, func) {

    try {
        project.getTasks(data, func);
    }
    catch (Exception) {
        errorLog("MainDB.js getTasks " + Exception);
    }
}

function updateTask(id, data, func) {
    try {
        project.updateTask(id, data.task, func);
    }
    catch (Exception) {
        errorLog("MainDb.js  updateTask  " + Exception);
    }
}

function removeTask(id, func) {
    try {
        project.removeTask(id, func);
    }
    catch (Exception) {
        errorLog("MainDb.js  removeTask" + Exception);
    }
}

function getTasksByProjectId(data, func) {
    try {
        project.getTasksByProjectId(data, func);
    }
    catch (Exception) {
        errorLog("MainDB.js getTasksByProjectId " + Exception);
    }
}

function getTaskById(data, func) {
    try {
        project.getTaskById(data, func);
    }
    catch (Exception) {
        errorLog("MainDB.js getTaskById " + Exception);
    }
}

function createTask(data, func) {
    try {
        project.createTask(data.task, func);
    }
    catch (Exception) {
        errorLog("MainDb.js  createTask " + Exception);
    }
}
//------------END---Projects-----------------------------
//----------------Companies-----------------------------
function getWorkflow(data, func) {
    try {
        workflow.get(data, func);
    }
    catch (e) {
        errorLog('MainDb.js getWorkflow ' + e);
    }
}

function getCompanies(func) {
    try {
        company.get(func);
    }
    catch (e) {
        errorLog('MainDb.js getCompanies ' + e);
    }
}

function removeCompany(id, func) {
    try {
        company.remove(id, func);
    }
    catch (e) {
        errorLog('MainDb.js removeCompany ' + e);
    }
}

function createCompany(data, func) {
    try {
        company.create(data, func);
    }
    catch (e) {
        errorLog('MainDb.js createCompany ' + e);
    }
}

function updateCompany(id, data, func) {
    try {
        company.update(id, data.company, func);
    }
    catch (e) {
        errorLog('MainDb.js updateCompany ' + e);
    }
}


//-------------------END---COMPANIES-------------------

//---------EXPORTS-----------------------------------------
exports.getModules = getModules;

exports.login = login;
exports.createUser = createUser;

exports.createPerson = createPerson;
exports.getPersons = getPersons;
exports.getPersonsForDd = getPersonsForDd;
exports.updatePerson = updatePerson;
exports.removePerson = removePerson;
exports.getCustomer = getCustomer;
exports.getPersonsById = getPersonsById;

exports.getProjects = getProjects;
exports.getProjectsForDd = getProjectsForDd;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.removeProject = removeProject;

exports.getTasks = getTasks;
exports.getTasksByProjectId = getTasksByProjectId;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.removeTask = removeTask;

exports.getCompanies = getCompanies;
exports.removeCompany = removeCompany;
exports.createCompany = createCompany;
exports.updateCompany = updateCompany;

exports.getWorkflow = getWorkflow;