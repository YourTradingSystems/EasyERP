// JavaScript source code
var http = require('http'),
    url = require('url'),
    fs = require("fs");
//var googleapis = require('googleapis'),
//    OAuth2Client = googleapis.OAuth2Client;
//var oauth2Client =
//    new OAuth2Client('38156718110.apps.googleusercontent.com', 'ZmQ5Z3Ngr5Rb-I9ZnjC2m4dF', 'http://localhost:8088/getGoogleToken');
//var url = oauth2Client.generateAuthUrl({
//    access_type: 'offline',
//    scope: 'http://www.google.com/calendar/feeds/'
//});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CRM');
var db = mongoose.connection;
var express = require('express');
var requestHandler = require("./requestHandler.js")(fs, mongoose);

var app = express();

var MemoryStore = require('connect-mongo')(express);
//var MemoryStore = require('connect').session.MemoryStore;

var config = {
    db: db.name,
    host: db.host,
    port: db.port,
    reapInterval: 500000
    //mongoose_connection: mongoose.connections[0]
};

var allowCrossDomain = function (req, res, next) {
    //var allowedHost = [
    //    'http://backbonetutorials.com',
    //    'http://localhost'
    //];
    //if(allowedHost.indexOf(req.headers.origin) !== -1) {
    //res.setHeader('Content-Type', 'text/html');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Allow Cross Site Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Request-Headers", "*");
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-HTTP-Method-Override, uid, hash, mid');
    next();
    //} else {
    //    res.send(401);
    //}
};
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(express.cookieParser("CRMkey"));
    app.use(express.session({
        key: 'crm',
        secret: "CRMkey",
        //cookie: { 
        //    maxAge: 600 * 1000 //1 minute
        //},
        store: new MemoryStore(config)
        //store: new MemoryStore()
    }));
    app.use(app.router);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        console.log("Connection to CRM_DB is success");
    });
});

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('/account/authenticated', function (req, res, next) {
    console.log('>>>>>>>>>>>>>>>>Request authenticate<<<<<<<<<<<<<<<<<<');
    if (req.session && req.session.loggedIn) {
        res.send(200);
    } else {
        res.send(401);
    }
});
app.get('/getGoogleToken', function (req, res) {
    requestHandler.getToken(req, res);
            //googleapis
            //    .discover('calendar', 'v3')
            //    .execute(function (err, client) {
            //        if (err) console.log(err);
            //        client.calendar.calendarList.list().withAuthClient(oauth2Client).execute(
            //            function (err, result) {
            //                if (result) {
            //                    var calendars = [];
            //                    for (var i in result.items) {
            //                        calendars.push({
            //                            id: result.items[i].id,
            //                            summary: result.items[i].summary
            //                        });
            //                    }
            //                    console.log(calendars);
            //                } else {
            //                    console.log(err);
            //                }
            //                var event = {
            //                    "summary": "rrrrrrrrrr",
            //                    'start': {
            //                        "date": "2013-12-6"
            //                    },
            //                    'end': {
            //                        "date": "2013-12-6"
            //                    }

            //                };
            //                //client.calendar.events.insert({ calendarId: calendars[1].id }, event)
            //                //    .withAuthClient(oauth2Client).execute(
            //                //    function (err, result) {
            //                //        if (result) {
            //                //            console.log(result);
            //                //        } else {
            //                //            console.log(err);
            //                //        }
            //                //        ;
            //                //    });
            //            });
            //        res.redirect('/#easyErp/Calendar');
            //    });
    
});
//---------------------Users--and Profiles------------------------------------------------

app.get('/getModules', function (req, res) {
    requestHandler.getModules(req, res);
});

app.post('/uploadFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File Persons<<<<<<<<<<<<<<<<<<<<<<<');
    //data = {};
    file = {};
    console.log(req.headers);
    fs.readFile(req.files.attachfile.path, function (err, data) {
        var path = __dirname + "\\uploads\\" + req.files.attachfile.name;
        fs.writeFile(path, data, function (err) {
            file._id = mongoose.Types.ObjectId();
            file.name = req.files.attachfile.name;
            file.path = path;
            file.size = req.files.attachfile.size;
            file.uploadDate = new Date();
            file.uploaderName = req.session.uName;
            requestHandler.uploadFile(req, res, req.headers.id, file);
        });
    });
});


app.post('/login', function (req, res, next) {
    console.log('>>>>>>>>>>>Login<<<<<<<<<<<<<<');
    data = {};
    data = req.body;
    console.log(data);
    requestHandler.login(req, res, data);
});

app.post('/Users', function (req, res) {
    console.log(req.body);
    data = {};
    data.mid = req.headers.mid;
    data.user = req.body;
    requestHandler.createUser(req, res, data);
});

app.get('/Users', function (req, res) {
    console.log('---------------------getUsers-------------');
    data = {};
    //data.ownUser = true;
    data.mid = req.param('mid');
    requestHandler.getUsers(req, res, data);
});

app.put('/Users/:_id', function (req, res) {
    console.log(req.body);
    data = {};
    var id = req.param('_id');
    //data._id = req.params('_id');
    data.mid = req.headers.mid;
    data.user = req.body;
    requestHandler.updateUser(req, res, id, data);
});

app.delete('/Users/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    console.log(data);
    requestHandler.removeUser(req, res, id);
});

app.post('/Profiles', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.profile = req.body;
    requestHandler.createProfile(req, res, data);
});

app.get('/Profiles', function (req, res) {
    console.log('---------SERVER----getProfiles-------------------------------');
    data = {};
    data.mid = req.param('mid');
    console.log(data);
    console.log('--------END SERVER-----getProfiles-------------------------------');
    requestHandler.getProfile(req, res);
});

app.put('/Profiles/:_id', function (req, res) {
    console.log(req.body);
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.profile = req.body;
    console.log(data);
    requestHandler.updateProfile(req, res, id, data);
});

app.delete('/Profiles/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    console.log(data);
    requestHandler.removeProfile(req, res, id);
});
//-----------------END----Users--and Profiles-----------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////

app.get('/getNewModules', function (req, res) {
    //console.log(req.body);
    //console.log(req.session);
    data = {};
    //data = req.body;
    data.uid = req.param('uid');
    data.hash = req.param('hash');
    //if (req.session.loggedIn) console.log('We Are the BEST');
    console.log(data);
    requestHandler.getNewModules(res, data);
});
//----------------------Accounts----------------------------------------------------------------

app.get('/getPersonsForDd', function (req, res) {
    console.log('------getAccountsForDd-----------------');
    data = {};
    //data.ownUser = true;
    data.mid = req.param('mid');
    requestHandler.getPersonsForDd(req, res, data);
});



//--------------------------Customers----------------------------------------------------------     

app.get('/Customer', function (req, res) {
    console.log('---------SERVER----Customer-------------------------------');
    data = {};
    data.mid = req.param('mid');
    requestHandler.getCustomer(req, res, data);
});



//----------------------------Persons---------------------------------------------------------

app.post('/Persons', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.person = req.body;
    requestHandler.createPerson(req, res, data);
});

app.get('/Persons/:viewType', function (req, res) {
    console.log(req.session.cookie);
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getPersonById(req, res, data);
            break;
        default: requestHandler.getFilterPersons(req, res, data);
            break;
    }
});

app.get('/Persons', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getPersons(req, res, data);
});

app.put('/Persons/:viewType/:_id', function (req, res) {
    console.log(req.body);
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    var remove = req.headers.remove;
    data.person = req.body;
    requestHandler.updatePerson(req, res, id, data, remove);
});

app.delete('/Persons/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removePerson(req, res, id);
});

//---------------------------Projects--------------------------------------------------------

app.get('/Projects', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjects(req, res, data);
});

/*app.get('/Projects/:_id', function (req, res) {
    data = {};
    data.id = req.params._id;
    data.mid = req.param('mid');
    requestHandler.getProjectsById(req, res, data);
});*/

app.get('/getProjectsForDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjectsForDd(req, res, data);
});

app.post('/Projects', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.project = req.body;
    console.log(data);
    requestHandler.createProject(req, res, data);
});

app.put('/Projects/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.updateProject(req, res, id, data);
});

app.delete('/Projects/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.params._id;
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.removeProject(req, res, id, data);
});

app.get('/Projects/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getProjectsById(req, res, data);
            break;
        default: requestHandler.getProjects(req, res, data);
            break;
    }

});


//--------------Tasks----------------------------------------------------------

app.post('/Tasks', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.task = req.body;
    requestHandler.createTask(req, res, data);
});

app.get('/Tasks', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getTasks(req, res, data);
});

app.get('/Tasks/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getTaskById(req, res, data);
            break;
        default: requestHandler.getTasksByProjectId(req, res, data);
            break;
    }

});

app.get('/Priority', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getTasksPriority(req, res, data);
});

app.put('/Tasks/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.task = req.body;
    requestHandler.updateTask(req, res, id, data);
});

app.delete('/Tasks/:contentType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeTask(req, res, id, data);
});


//------------------Workflows---------------------------------------------------

app.get('/relatedStatus', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getRelatedStatus(req, res, data);
});

app.get('/Workflows', function (req, res) {
    data = {};
    data.id = req.param('id');
    //console.log(req.body);
    data.mid = req.param('mid');
    console.log(data);
    requestHandler.getWorkflow(req, res, data);
});


app.get('/taskWorkflows', function (req, res) {
    data = {};
    type = {};
    //data.id = req.param('id');
    data.mid = req.param('mid');
    //type.name = 'task';
    type.id = "Task";
    data.type = type;
    console.log(data);
    requestHandler.getWorkflowsForDd(req, res, data);
});

app.get('/projectWorkflows', function (req, res) {
    data = {};
    type = {};
    //data.id = req.param('id');
    data.mid = req.param('mid');
    type.name = 'project';
    type.id = "Project";
    data.type = type;
    console.log(data);
    requestHandler.getWorkflowsForDd(req, res, data);
});

app.post('/Workflows', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.value = req.body.value;
    //data._id = req.headers.id;
    data._id = req.body.wId;
    data.wName = req.body.name;
    console.log(data);
    requestHandler.createWorkflow(req, res, data);
});

app.put('/Workflows/:id', function (req, res) {
    console.log('Request for update Workflow');
    data = {};
    var _id = req.param('id');
    console.log("*************");
    console.log(_id);

    data.mid = req.headers.mid;
    data.status = req.body.status;
    data.name = req.body.name;
    //console.log(data);
    requestHandler.updateWorkflow(req, res, _id, data);
});
//-------------------Companies--------------------------------------------------

app.post('/Companies', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.company = req.body;
    requestHandler.createCompany(req, res, data);
});

app.get('/Companies', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getCompanies(req, res, data);
});

app.get('/ownCompanies', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getOwnCompanies(req, res, data);
});

app.get('/Companies/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getCompanyById(req, res, data);
            break;
        default: requestHandler.getCompanies(req, res, data);
            break;
    }

});

app.put('/Companies/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.company = req.body;
    var remove = req.headers.remove;
    console.log("---------------UpdateCompany-------------------");
    //console.log(data.company.salesPurchases.salesPerson);
    if (data.company.salesPurchases.salesPerson && (typeof (data.company.salesPurchases.salesPerson) == 'object')) {
        data.company.salesPurchases.salesPerson = data.company.salesPurchases.salesPerson._id;
    }
    if (data.company.salesPurchases.salesTeam && (typeof (data.company.salesPurchases.salesTeam) == 'object')) {
        data.company.salesPurchases.salesTeam = data.company.salesPurchases.salesTeam._id;
    }
    //console.log(data.company.salesPurchases.salesPerson);
    //console.log(data.company.address);
    requestHandler.updateCompany(req, res, id, data, remove);
});

app.delete('/Companies/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCompany(req, res, id, data);
});

app.post('/JobPosition', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.jobPosition = req.body;
    requestHandler.createJobPosition(req, res, data);
});

app.get('/JobPosition', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    //data._id = req.param('_id');
    console.log(data);
    requestHandler.getJobPosition(req, res, data);
});

app.get('/JobPositions/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    console.log(data);
    switch (viewType) {
        case "form": requestHandler.getJobPositionById(req, res, data);
            break;
        default: requestHandler.getCustomJobPosition(req, res, data);
            break;
    }

});

app.get('/JobPosition/:_id', function (req, res) {
    data = {};
    data._id = req.params._id;
    //data._id = req.param('_id');
    console.log(data);
    res.send(200, { success: 'ok' });
    //requestHandler.getJobPosition(req, res, data);
});

app.put('/JobPositions/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.jobPosition = req.body;
    requestHandler.updateJobPosition(req, res, id, data);
});

app.delete('/JobPositions/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeJobPosition(req, res, id, data);
});

app.get('/Departments', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getDepartment(req, res, data);
});


app.post('/Departments', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.department = req.body;
    requestHandler.createDepartment(req, res, data);
});

app.get('/Departments/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getDepartmentById(req, res, data);
            break;
        default: requestHandler.getCustomDepartment(req, res, data);
            break;
    }

});

app.put('/Departments/:viewType/:_id', function (req, res) {  
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.department = req.body;
    requestHandler.updateDepartment(req, res, id, data);
});

app.delete('/Departments/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeDepartment(req, res, id, data);
});

//------------------Employee---------------------------------------------------

app.get('/Employees', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getEmployees(req, res, data);
});

app.get('/Employees/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    console.log('______________>>');
    console.log(viewType);
    switch (viewType) {
        case "form": requestHandler.getEmployeesByIdCustom(req, res, data);
            break;
        default: requestHandler.getEmployeesCustom(req, res, data);
            break;
    }

});

app.post('/Employees', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.createEmployee(req, res, data);
});

app.put('/Employees/:viewType/:_id', function (req, res) {
    var data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateEmployees(req, res, id, data);
});

app.delete('/Employees/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.removeEmployees(req, res, id, data);
});

app.get('/getSalesPerson', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getPersonsForDd(req, res, data);
});

app.get('/getSalesTeam', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getDepartmentForDd(req, res, data);
});

//------------------Applications---------------------------------------------------

app.get('/Applications', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getApplications(req, res, data);
});

app.get('/Applications/:viewType', function (req, res) {
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    console.log(req.params);
    viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getApplicationById(req, res, data);
            break;
        default: requestHandler.getFilterApplications(req, res, data);
            break;
    }


});

app.post('/Applications', function (req, res) {
    console.log('-------------------/createEmployee-----------------------------');
    data = {};
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.createEmployee(req, res, data);
});

app.put('/Applications/:viewType/:_id', function (req, res) {
    console.log('-----SERVER put Applications---------------');
    var data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateEmployees(req, res, id, data);
});

app.delete('/Applications/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeEmployees(req, res, id, data);
});

app.get('/Degrees', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getDegrees(req, res, data);
});

app.post('/Degrees', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.degree = req.body;
    requestHandler.createDegree(req, res, data);
});

app.put('/Degrees/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.degree = req.body;
    requestHandler.updateDegree(req, res, id, data);
});

app.delete('/Degrees/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeDegree(req, res, id, data);
});
//----------------------SourcesOfApplicants----------------------------------------------------------------
app.get('/SourcesOfApplicants', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getSourcesOfApplicants(req, res, data);
});

app.post('/SourcesOfApplicants', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.soa = req.body;
    requestHandler.createSourcesOfApplicant(req, res, data);
});

app.put('/SourcesOfApplicants/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.soa = req.body;
    requestHandler.updateSourcesOfApplicant(req, res, id, data);
});

app.delete('/SourcesOfApplicants/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeSourcesOfApplicant(req, res, id, data);
});

//----------------------Leads----------------------------------------------------------------
app.get('/Leads', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getLeads(req, res, data);
});
app.get('/Leads/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getOpportunityById(req, res, data);
            break;
        default: requestHandler.getLeadsCustom(req, res, data);
            break;
    }
});
app.post('/Leads', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.lead = req.body;
    requestHandler.createLead(req, res, data);
});

app.put('/Leads/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.lead = req.body;
    console.log(data);
    requestHandler.updateLead(req, res, id, data);
});

app.delete('/Leads/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeLead(req, res, id, data);
});
//---------------------Opportunities---------------------
app.post('/Opportunities', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    data.opportunitie = req.body;
    requestHandler.createOpportunitie(req, res, data);
});

app.get('/Opportunities/:viewType', function (req, res) {
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    console.log(req.params);
    viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getOpportunityById(req, res, data);
            break;
        default: requestHandler.getFilterOpportunities(req, res, data);
    }
});

app.get('/Opportunities', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getOpportunities(req, res, data);
});

app.put('/Opportunities/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.opportunitie = req.body;
    requestHandler.updateOpportunitie(req, res, id, data);
});

app.delete('/Opportunities/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeOpportunitie(req, res, id, data);
});
//-------------------Events--------------------------------
//---------------------Opportunities---------------------
app.post('/Events', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    data.event = req.body;
    requestHandler.createEvent(req, res, data);
});

app.get('/Events', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getEvents(req, res, data);
});

app.put('/Events/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.event = req.body;
    console.log(data);
    requestHandler.updateEvent(req, res, id, data);
});

app.delete('/Events/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    //data.mid = req.headers.mid;
    requestHandler.removeEvent(req, res, id, data);
});

app.post('/Calendars', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    data.calendar = req.body;
    requestHandler.createCalendar(req, res, data);
});

app.get('/Calendars', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getCalendars(req, res, data);
});

app.put('/Calendars/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.calendar = req.body;
    requestHandler.updateCalendar(req, res, id, data);
});

app.delete('/Calendars/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCalendar(req, res, id, data);
});

app.get('/getXML', function (req, res) {
    data = {};
    var link = req.param('link');
    data.mid = req.body.mid;
    data.calendars = req.body.calendars;
    requestHandler.getXML(req, res, link, data);
});
app.delete('/Calendars/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCalendar(req, res, id, data);
});
app.post('/GoogleCalSync', function (req, res) {
    data = {};
    data.mid = req.body.mid;
    data.calendar = req.body.calendar;
    requestHandler.googleCalSync(req, res, data);
});
app.get('/GoogleCalendars', function (req, res) {
    requestHandler.googleCalendars(req, res);
});
app.listen(8088);

//console.log(app.routes);

console.log("server start");
