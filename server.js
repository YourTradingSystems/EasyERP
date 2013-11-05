// JavaScript source code
var http = require('http'),
    url = require('url');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CRM');
var db = mongoose.connection;

var express = require('express');
var requestHandler = require("./requestHandler.js")(mongoose);

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

var allowCrossDomain = function(req, res, next) {
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

//---------------------Users--and Profiles------------------------------------------------

app.get('/getModules', function (req, res) {
    requestHandler.getModules(req, res);
});

app.post('/login', function (req, res, next) {
    console.log('>>>>>>>>>>>Login<<<<<<<<<<<<<<<<<<<<<<<');
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

app.get('/Persons', function (req, res) {
    console.log('---------SERVER----getPersons-------------------------------');
    data = {};
    data.mid = req.param('mid');
    requestHandler.getPersons(req, res, data);
});

app.put('/Persons/:_id', function (req, res) {
    console.log(req.body);
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.person = req.body;
    requestHandler.updatePerson(req, res, id, data);
});

app.delete('/Persons/:_id', function (req, res) {
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

app.get('/Projects/:_id', function (req, res) {
    data = {};
    data.id = req.params._id;
    data.mid = req.param('mid');
    requestHandler.getProjectsById(req, res, data);
});

app.get('/getProjectsForDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjectsForDd(req, res, data);
});

app.post('/Projects', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.createProject(req, res, data);
});

app.put('/Projects/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.updateProject(req, res, id, data);
});

app.delete('/Projects/:_id', function (req, res) {
    data = {};
    var id = req.params._id;
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.removeProject(req, res, id, data);
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

app.get('/Priority', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getTasksPriority(req, res, data);
});


app.put('/Tasks/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.task = req.body;
    requestHandler.updateTask(req, res, id, data);
});

app.delete('/Tasks/:_id', function (req, res) {
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
    data.mid = req.param('mid');
    console.log(data);
    requestHandler.getWorkflow(req, res, data);
});

app.post('/Workflows', function (req, res) {
    data = {};
    //data.mid = req.headers.mid;
    //data.value = req.body;
    //data.name = req.headers.id;
    data._id = req.body._id;
    data.name = req.body.name;
    data.value = req.body.value;
    console.log(data);
    requestHandler.createWorkflow(req, res, data);
});

app.put('/Workflows/:id', function (req, res) {
    data = {};
    data.id = req.param('id');
    data.mid = req.headers.mid;
    data.value = req.body;
    data.name = req.headers.id;
    console.log(data);
    //requestHandler.createWorkflow(req, res, data);
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

app.put('/Companies/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.company = req.body;
    requestHandler.updateCompany(req, res, id, data);
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

app.get('/JobPosition/:_id', function (req, res) {
    data = {};
    data._id = req.params._id;
    //data._id = req.param('_id');
    console.log(data);
    res.send(200, { success: 'ok' });
    //requestHandler.getJobPosition(req, res, data);
});

app.put('/JobPosition/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.jobPosition = req.body;
    requestHandler.updateJobPosition(req, res, id, data);
});

app.delete('/JobPosition/:_id', function (req, res) {
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

app.put('/Departments/:_id', function (req, res) {
    data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.department = req.body;
    requestHandler.updateDepartment(req, res, id, data);
});

app.delete('/Departments/:_id', function (req, res) {
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

app.post('/Employees', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.createEmployee(req, res, data);
});

app.put('/Employees/:_id', function (req, res) {
    data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateEmployees(req, res, id, data);
});

app.delete('/Employees/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.removeEmployees(req, res, id, data);
});

//------------------Applications---------------------------------------------------

app.get('/Applications', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getApplications(req, res, data);
});

app.post('/Applications', function (req, res) {
    console.log('-------------------/createEmployee-----------------------------');
    data = {};
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.createEmployee(req, res, data);
});

app.put('/Applications/:_id', function (req, res) {
    console.log('-----SERVER put Employees---------------');
    data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateEmployees(req, res, id, data);
});

app.delete('/Applications/:_id', function (req, res) {
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
    requestHandler.updateEvent(req, res, id, data);
});

app.delete('/Events/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeEvent(req, res, id, data);
});

app.listen(8088);

//console.log(app.routes);

console.log("server start");