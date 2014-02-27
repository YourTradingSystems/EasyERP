// JavaScript source code
var http = require('http'),
    url = require('url'),
    fs = require("fs");


var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;
var dbsArray = [];
var dbsNames = [];
//Event Listener in Server and Triggering Events
var events = require('events');
var event = new events.EventEmitter();

var mainDb = mongoose.createConnection('localhost', 'mainDB');

mainDb.on('error', console.error.bind(console, 'connection error:'));
mainDb.once('open', function callback() {
    console.log("Connection to mainDB is success");
    mainDBSchema = mongoose.Schema({
        _id: Number,
        url: { type: String, default: 'localhost' },
        DBname: { type: String, default: '' },
        pass: { type: String, default: '' },
        user: { type: String, default: '' }
    }, { collection: 'easyErpDBS' });

    var main = mainDb.model('easyErpDBS', mainDBSchema);
    main.find().exec(function (err, result) {
        if (!err) {

            result.forEach(function (_db, index) {
                var dbInfo = {
                    DBname: '',
                    url: ''
                };
                var dbObject = mongoose.createConnection(_db.url, _db.DBname);
                dbObject.on('error', console.error.bind(console, 'connection error:'));
                dbObject.once('open', function callback() {
                    console.log("Connection to " + _db.DBname + " is success" + index);
                    dbInfo.url = result[index].url;
                    dbInfo.DBname = result[index].DBname;
                    dbsArray[index] = dbObject;
                    dbsNames[index] = dbInfo;
                });
            });
        } else {
            console.log(err);
        }
    });
});

var express = require('express');
var app = express();

var MemoryStore = require('connect-mongo')(express);

var config = {
    db: mainDb.name,
    host: mainDb.host,
    port: mainDb.port,
    reapInterval: 500000
    //mongoose_connection: mongoose.connections[0]
};

var allowCrossDomain = function (req, res, next) {

    var allowedHost = [
        '185.2.100.192:8088',
        'localhost:8088',
        '192.168.88.13:8088'
    ];
    if (allowedHost.indexOf(req.headers.host) !== -1) {
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
    } else {
        res.send(401);
    }
};
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //app.use(allowCrossDomain);
    app.use(express.cookieParser("CRMkey"));
    app.use(express.session({
        key: 'crm',
        secret: "CRMkey",
        cookie: {
            maxAge: 10000 * 60 * 1000 //1 minute
        },
        store: new MemoryStore(config)
        //store: new MemoryStore()
    }));
    app.use(app.router);
});

console.log(dbsArray);
var requestHandler = require("./requestHandler.js")(fs, mongoose, event, dbsArray);



app.get('/', function (req, res) {
    res.sendfile('index.html');
});


app.get('/getDBS', function (req, res) {
    console.log('Get DBS is success');
    res.send(200, { dbsNames: dbsNames });
});

app.get('/account/authenticated', function (req, res, next) {
    console.log('>>>>>>>>>>>>>>>>Request authenticate<<<<<<<<<<<<<<<<<<');
    //console.log(req);
    //if ((req.session && req.cookies) && ((req.session.lastDb == req.cookies.lastDb) && req.session.loggedIn)) {
    if (req.session && req.session.loggedIn) {
        res.send(200);
    } else {
        res.send(401);
    }
});
app.get('/getGoogleToken', function (req, res) {
    requestHandler.getToken(req, res);
});
//---------------------Users--and Profiles------------------------------------------------

app.get('/getModules', function (req, res) {
    requestHandler.getModules(req, res);
});

app.post('/uploadFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File Persons<<<<<<<<<<<<<<<<<<<<<<<');

    //data = {};
    var file = {};
    var localPath = __dirname + "\\uploads\\" + req.headers.id;
    fs.readdir(localPath, function(err, files){
        if (!err) {
            var k = '';
            var maxK = 0;
            var checkIs = false;
            var attachfileName = req.files.attachfile.name.slice(0,req.files.attachfile.name.lastIndexOf('.'));
            files.forEach(function(fileName){
                if (fileName == req.files.attachfile.name) {
                   k = 1;
                   checkIs = true;
                } else {
                    if ((fileName.indexOf(attachfileName) === 0) &&
                        (fileName.lastIndexOf(attachfileName) === 0) &&
                        (fileName.lastIndexOf(').') !== -1) &&
                        (fileName.lastIndexOf('(') !== -1) &&
                        (fileName.lastIndexOf('(') < fileName.lastIndexOf(').')) &&
                        (attachfileName.length == fileName.lastIndexOf('('))) {
                        var intVal = fileName.slice(fileName.lastIndexOf('(')+1,fileName.lastIndexOf(').'));
                        k = parseInt(intVal) + 1;
                    }
                }
                if (maxK < k) {
                    maxK = k;
                }
            });
            if (!(maxK == 0) && checkIs) {
                req.files.attachfile.name = attachfileName + '(' + maxK + ')' + req.files.attachfile.name.slice(req.files.attachfile.name.lastIndexOf('.'));
            }
        }
    });

    fs.readFile(req.files.attachfile.path, function (err, data) {
        var path;
        var dir;
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        switch (osType) {
            case "Windows":
                {
                    path = __dirname + "\\uploads\\" + req.headers.id + "\\" + req.files.attachfile.name;
                    dir = __dirname + "\\uploads\\" + req.headers.id;
                }
                break;
            case "Linux":
                {
                    path = __dirname + "\/uploads\/" + req.headers.id +"\/" + req.files.attachfile.name;
                    dir = __dirname + "\/uploads\/" + req.headers.id;
                }
        }

        fs.writeFile(path, data, function (err) {
            if (!err) {
                file._id = mongoose.Types.ObjectId();
                file.name = req.files.attachfile.name;
                file.path = path;
                file.size = req.files.attachfile.size;
                file.uploadDate = new Date();
                file.uploaderName = req.session.uName;
                requestHandler.uploadFile(req, res, req.headers.id, file);
            } else {
                if (err.errno === 34) {
                    fs.mkdir(dir, function (errr) {
                        if (errr) {
                            console.log(errr);
                            next();
                        } else {
                            fs.writeFile(path, data, function (err) {
                                if (!err) {
                                    file._id = mongoose.Types.ObjectId();
                                    file.name = req.files.attachfile.name;
                                    file.path = path;
                                    file.size = req.files.attachfile.size;
                                    file.uploadDate = new Date();
                                    file.uploaderName = req.session.uName;
                                    requestHandler.uploadFile(req, res, req.headers.id, file);
                                } else {
                                    console.log(err);
                                    next();
                                }
                            });
                        }
                    });
                } else {
                    console.log(err);
                    next();
                }
            }
        });
    });

});

app.get('/download/:name', function (req, res) {
    var name = req.param('name');
    res.download(__dirname + "\\uploads\\" + name);
});

function uploadFileArray(req, res, callback) {
    var files = [];
    if (req.files && !req.files.attachfile.length) {
        req.files.attachfile = [req.files.attachfile];
    }
    var path;
    var dir;
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    req.files.attachfile.forEach(function (item) {
        var localPath;
        switch (osType) {
            case "Windows":
            {
                localPath = __dirname + "\\uploads\\" + req.headers.id;
            }
                break;
            case "Linux":
            {
                localPath = __dirname + "\/uploads\/" + req.headers.id;
            }
        }
        fs.readdir(localPath, function(err, files){
            if (!err) {
                var k = '';
                var maxK = 0;
                var checkIs = false;
                var attachfileName = item.name.slice(0,item.name.lastIndexOf('.'));
                files.forEach(function(fileName){
                    if (fileName == item.name) {
                        k = 1;
                        checkIs = true;
                    } else {
                        if ((fileName.indexOf(attachfileName) === 0) &&
                            (fileName.lastIndexOf(attachfileName) === 0) &&
                            (fileName.lastIndexOf(').') !== -1) &&
                            (fileName.lastIndexOf('(') !== -1) &&
                            (fileName.lastIndexOf('(') < fileName.lastIndexOf(').')) &&
                            (attachfileName.length == fileName.lastIndexOf('('))) {
                            var intVal = fileName.slice(fileName.lastIndexOf('(')+1,fileName.lastIndexOf(').'));
                            k = parseInt(intVal) + 1;
                        }
                    }
                    if (maxK < k) {
                        maxK = k;
                    }
                });
                if (!(maxK == 0) && checkIs) {
                    item.name = attachfileName + '(' + maxK + ')' + item.name.slice(item.name.lastIndexOf('.'));
                }
            }
        });

        fs.readFile(item.path, function (err, data) {
            switch (osType) {
                case "Windows":
                {
                    path = __dirname + "\\uploads\\" + req.headers.id + "\\" + item.name;
                    dir = __dirname + "\\uploads\\" + req.headers.id;
                }
                    break;
                case "Linux":
                {
                    path = __dirname + "\/uploads\/" + req.headers.id +"\/" + item.name;
                    dir = __dirname + "\/uploads\/" + req.headers.id;
                }
            }
            fs.writeFile(path, data, function (err) {
                if (!err) {
                    var file = {};
                    file._id = mongoose.Types.ObjectId();
                    file.name = item.name;
                    console.log(osType);


                    file.path = path;
                    file.size = item.size;
                    file.uploadDate = new Date();
                    file.uploaderName = req.session.uName;
                    files.push(file);

                    if (files.length == req.files.attachfile.length) {
                        if (callback) {
                            callback(files);
                        }
                    }
                } else {
                    console.log(err);
                    res.send(500);
                }

            });
        });
    });

}

app.post('/uploadApplicationFiles', function (req, res, next) {
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    var dir;
    switch (osType) {
        case "Windows":
            {
                dir = __dirname + "\\uploads\\" + req.headers.id;
            }
            break;
        case "Linux":
            {
                dir = __dirname + "\/uploads\/" + req.headers.id;
            }
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            fs.mkdir(dir, function (errr) {
                uploadFileArray(req, res, function (files) {
                    requestHandler.uploadApplicationFile(req, res, req.headers.id, files);
                });

            });
        } else {
            uploadFileArray(req, res, function (files) {
                requestHandler.uploadApplicationFile(req, res, req.headers.id, files);
            });
        }
    });

});

app.post('/uploadEmployeesFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File employees<<<<<<<<<<<<<<<<<<<<<<<');
    //data = {};
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    var dir;
    switch (osType) {
        case "Windows":
            {
                dir = __dirname + "\\uploads\\" + req.headers.id;
            }
            break;
        case "Linux":
            {
                dir = __dirname + "\/uploads\/" + req.headers.id;
            }
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            fs.mkdir(dir, function (errr) {
                uploadFileArray(req, res, function (files) {
                    requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
                });

            });
        } else {
            uploadFileArray(req, res, function (files) {
                requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
            });
        }
    });

});

app.post('/uploadProjectsFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File Projects<<<<<<<<<<<<<<<<<<<<<<<');
    //data = {};
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    var dir;
    switch (osType) {
        case "Windows":
            {
                dir = __dirname + "\\uploads\\" + req.headers.id;
            }
            break;
        case "Linux":
            {
                dir = __dirname + "\/uploads\/" + req.headers.id;
            }
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            fs.mkdir(dir, function (errr) {
                uploadFileArray(req, res, function (files) {
                    requestHandler.uploadProjectsFiles(req, res, req.headers.id, files);
                });

            });
        } else {
            uploadFileArray(req, res, function (files) {
                requestHandler.uploadProjectsFiles(req, res, req.headers.id, files);
            });
        }
    });
});

app.post('/uploadTasksFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File Tasks<<<<<<<<<<<<<<<<<<<<<<<');
    //data = {};
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    var dir;
    switch (osType) {
        case "Windows":
            {
                dir = __dirname + "\\uploads\\" + req.headers.id;
            }
            break;
        case "Linux":
            {
                dir = __dirname + "\/uploads\/" + req.headers.id;
            }
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            fs.mkdir(dir, function (errr) {
                uploadFileArray(req, res, function (files) {
                    requestHandler.uploadTasksFiles(req, res, req.headers.id, files);
                });

            });
        } else {
            uploadFileArray(req, res, function (files) {
                requestHandler.uploadTasksFiles(req, res, req.headers.id, files);
            });
        }
    });
});
// upload files Opportunities (add Vasya);
app.post('/uploadOpportunitiesFiles', function (req, res, next) {
    console.log('>>>>>>>>>>>Uploading File Opportunities<<<<<<<<<<<<<<<<<<<<<<<');
    //data = {};
    var os = require("os");
    var osType = (os.type().split('_')[0]);
    var dir;
    switch (osType) {
        case "Windows":
            {
                dir = __dirname + "\\uploads\\" + req.headers.id;
            }
            break;
        case "Linux":
            {
                dir = __dirname + "\/uploads\/" + req.headers.id;
            }
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            fs.mkdir(dir, function (errr) {
                uploadFileArray(req, res, function (files) {
                    requestHandler.uploadOpportunitiesFiles(req, res, req.headers.id, files);
                });

            });
        } else {
            uploadFileArray(req, res, function (files) {
                requestHandler.uploadOpportunitiesFiles(req, res, req.headers.id, files);
            });
        }
    });
});


app.get('/logout', function (req, res, next) {
    console.log('>>>>>>>>>>>logut<<<<<<<<<<<<<<');
    if (req.session) {
        req.session.destroy(function () { });
    }
    res.redirect('/#login');
});
app.post('/login', function (req, res, next) {
    console.log('>>>>>>>>>>>Login<<<<<<<<<<<<<<');
    var data = {};
    data = req.body;
    req.session.lastDb = data.dbId;
    requestHandler.login(req, res, data);
});

app.post('/Users', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.user = req.body;
    requestHandler.createUser(req, res, data);
});

app.get('/UserWithProfile', function (req, res) {
    console.log('---------------------getUsers-------------');
    var id = req.param('_id');
	console.log(id);
    requestHandler.getAllUserWithProfile(req, id, res);
});

app.get('/Users', function (req, res) {
    console.log('---------------------getUsers-------------');
    data = {};
    data.mid = req.param('mid');
    data.page = req.param('page');
    data.count = req.param('count');
    requestHandler.getUsers(req, res, data);
});

app.get('/currentUser', function (req, res) {
    requestHandler.currentUser(req, res);
});

app.post('/currentUser', function (req, res) {
    var data = {};
    if (req.body.oldpass && req.body.pass) {
        data.changePass = true;
    }
    requestHandler.updateCurrentUser(req, res, data);
});

app.put('/currentUser/:id', function (req, res) {
    var data = {};
    var id = req.param('id');
    if (req.body.oldpass && req.body.pass) {
        data.changePass = true;
    }
    requestHandler.updateCurrentUser(req, res, data);
});

app.get('/UsersForDd', function (req, res) {
    console.log('---------------------getUsers-------------');
    requestHandler.getUsersForDd(req, res);
});

app.get('/Users/:viewType', function (req, res) {
    console.log('-----------Filter-----getUsers-------------');
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getUserById(req, res, data);
            break;
        default: requestHandler.getFilterUsers(req, res);
            break;
    }
});

app.put('/Users/:viewType/:_id', function (req, res) {
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
    requestHandler.removeUser(req, res, id);
});
app.delete('/Users/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
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
    console.log('--------END SERVER-----getProfiles-------------------------------');
    requestHandler.getProfile(req, res);
});

app.get('/ProfilesForDd', function (req, res) {
    console.log('---------SERVER----getProfiles-------------------------------');
    data = {};
    data.mid = req.param('mid');
    console.log('--------END SERVER-----getProfiles-------------------------------');
    requestHandler.getProfileForDd(req, res);
});

app.put('/Profiles/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.profile = req.body;
    requestHandler.updateProfile(req, res, id, data);
});

app.delete('/Profiles/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeProfile(req, res, id);
});

//-----------------END----Users--and Profiles-----------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////

//-----------------------------getTotalLength---------------------------------------------
app.get('/totalCollectionLength/:contentType', function (req, res, next) {
    switch (req.params.contentType) {
        case ('Persons'): requestHandler.customerTotalCollectionLength(req, res);
            break;
        case ('Companies'): requestHandler.customerTotalCollectionLength(req, res);
            break;
        case ('ownCompanies'): requestHandler.customerTotalCollectionLength(req, res);
            break;
        case ('Projects'): requestHandler.projectsTotalCollectionLength(req, res);
            break;
        case ('Tasks'): requestHandler.projectsTotalCollectionLength(req, res);
            break;
        case ('Leads'): requestHandler.opportunitiesTotalCollectionLength(req, res);
            break;
        case ('Opportunities'): requestHandler.opportunitiesTotalCollectionLength(req, res);
            break;
        case ('Employees'): requestHandler.employeesTotalCollectionLength(req, res);
            break;
        case ('Applications'): requestHandler.employeesTotalCollectionLength(req, res);
            break;
        case ('JobPositions'): requestHandler.jobPositionsTotalCollectionLength(req, res);
            break;
        case ('Users'): requestHandler.usersTotalCollectionLength(req, res);
            break;
        default: next();
    }
});
//------------------------END--getTotalLength---------------------------------------------

app.get('/getNewModules', function (req, res) {
    //console.log(req.body);
    //console.log(req.session);
    data = {};
    //data = req.body;
    data.uid = req.param('uid');
    data.hash = req.param('hash');
    //if (req.session.loggedIn) console.log('We Are the BEST');
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

app.get('/getPersonAlphabet', function (req, res) {
    requestHandler.getCustomersAlphabet(req, res);
});

app.get('/getPersonsForMiniView', function (req, res) {
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    requestHandler.getFilterPersonsForMiniView(req, res, data);

});




//--------------------------Customers----------------------------------------------------------     

app.get('/Customer', function (req, res) {
    console.log('---------SERVER----Customer-------------------------------');
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    data.mid = req.param('mid');
    requestHandler.getCustomer(req, res, data);
});

//Get images for persons or companies or owncompanies
app.get('/getCustomersImages', function (req, res) {
    requestHandler.getCustomersImages(req, res);
    console.log('-----------getCustomersImages');
});

//----------------------------Persons---------------------------------------------------------

app.post('/Persons', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.person = req.body;
    requestHandler.createPerson(req, res, data);
});

app.get('/Persons/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getPersonById(req, res, data);
            break;
        default: requestHandler.getFilterCustomers(req, res);
            break;
    }
});

app.get('/Persons', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getPersons(req, res, data);
});

app.put('/Persons/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    var remove = req.headers.remove;
    data.person = req.body;
    requestHandler.updatePerson(req, res, id, data, remove);
});

app.patch('/Persons/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    requestHandler.personUpdateOnlySelectedFields(req, res, id, req.body);
});

app.delete('/Persons/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removePerson(req, res, id);
});

app.delete('/Persons/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removePerson(req, res, id);
});

//---------------------------Projects--------------------------------------------------------
app.get('/ProjectsListLength', function (req, res) {
    data = {};
    //data.mid = req.param('mid');
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    requestHandler.getProjectsListLength(req, res, data);
});

app.get('/projectType', function (req, res) {
    console.log('Get getProjectType');
    requestHandler.getProjectType(req, res);
});

app.get('/Projects', function (req, res) {
    console.log('Get Projects');
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjects(req, res, data);
});

app.get('/Projects/form/:_id', function (req, res) {
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
app.get('/getProjectPMForDashboard', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjectPMForDashboard(req, res, data);
});
app.get('/getProjectStatusCountForDashboard', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjectStatusCountForDashboard(req, res, data);
});

app.get('/getProjectByEndDateForDashboard', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getProjectByEndDateForDashboard(req, res, data);
});

app.post('/Projects', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.createProject(req, res, data);
});

app.put('/Projects/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    var remove = req.headers.remove;
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.updateProject(req, res, id, data, remove);
});

app.patch('/Projects/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    console.log(req.body);
    requestHandler.updateOnlySelectedFields(req, res, id, req.body);
});

app.put('/Projects/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    var remove = req.headers.remove;
    data.project = req.body;
    requestHandler.updateProject(req, res, id, data, remove);
});

app.delete('/Projects/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.params._id;
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.removeProject(req, res, id, data);
});

app.delete('/Projects/:_id', function (req, res) {
    data = {};
    var id = req.params._id;
    data.mid = req.headers.mid;
    data.project = req.body;
    requestHandler.removeProject(req, res, id, data);
});

app.get('/Projects/:viewType', function (req, res, next) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getProjectsById(req, res, data);
            break;
        case "list": requestHandler.getProjectsForList(req, res, data);
            break;

        default: requestHandler.getProjects(req, res, data, next);
            break;
    }

});


//--------------Tasks----------------------------------------------------------
app.get('/getTasksLengthByWorkflows', function (req, res) {
    var options = {};
    for (var i in req.query) {
        options[i] = req.query[i];
    }
    requestHandler.getTasksLengthByWorkflows(req, options, res);
});

app.post('/Tasks', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.task = req.body;
    requestHandler.createTask(req, res, data);
});
//Patch recover
app.patch('/Tasks/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    console.log(req.body);
    requestHandler.taskUpdateOnlySelectedFields(req, res, id, req.body);
});

app.get('/Tasks', function (req, res) {//---------------Remove this method in future
    //data = {};
    //data.mid = req.param('mid');
    //requestHandler.getTasks(req, res, data);
    console.log('------------>--------->-----chackingGetTasks----<-----');
});

app.get('/Tasks/:viewType', function (req, res) {
    var data = req.query;
    console.log(req.query);
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getTaskById(req, res, data);
            break;
        case "list": requestHandler.getTasksForList(req, res, data);
            break;
        case "kanban": requestHandler.getTasksForKanban(req, res, data);
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
    var remove = req.headers.remove;
    requestHandler.updateTask(req, res, id, data, remove);
});

app.patch('/Tasks/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    requestHandler.taskUpdateOnlySelectedFields(req, res, id, req.body);
});

app.put('/Tasks/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.task = req.body;
    var remove = req.headers.remove;
    requestHandler.updateTask(req, res, id, data, remove);
});

app.delete('/Tasks/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeTask(req, res, id, data);
});

app.delete('/Tasks/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeTask(req, res, id, data);
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
    data.type = req.param('type');
    requestHandler.getRelatedStatus(req, res, data);
});

app.get('/Workflows', function (req, res) {
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    requestHandler.getWorkflow(req, res, data);
});

app.get('/WorkflowContractEnd', function (req, res) {
    data = {};
    data.id = req.param('id');
    //console.log(req.body);
    data.mid = req.param('mid');
    requestHandler.getWorkflowContractEnd(req, res, data);
});

app.get('/WorkflowsForDd', function (req, res) {
    data = {};
    type = {};
    //data.id = req.param('id');
    data.mid = req.param('mid');
    //type.name = 'task';
    type.id = req.param('id');
    data.type = type;
    requestHandler.getWorkflowsForDd(req, res, data);
});

app.get('/taskWorkflows', function (req, res) {
    data = {};
    type = {};
    //data.id = req.param('id');
    data.mid = req.param('mid');
    //type.name = 'task';
    type.id = "Task";
    data.type = type;
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
    requestHandler.getWorkflowsForDd(req, res, data);
});

app.post('/Workflows', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.value = req.body.value;
    //data._id = req.headers.id;
    data._id = req.body.wId;
    data.wName = req.body.name;
    requestHandler.createWorkflow(req, res, data);
});

app.put('/Workflows/:_id', function (req, res) {
    console.log('Request for update Workflow');
    data = {};
    var _id = req.param('_id');
    data.status = req.body.status;
    data.name = req.body.name;
    data.wName = req.body.wName;
    //
    requestHandler.updateWorkflow(req, res, _id, data);
});

app.patch('/Workflows/:_id', function (req, res) {
    console.log('Request for update Workflow');
    data = {};
    var _id = req.param('_id');
	for (var i in req.body) {
        data[i] = req.body[i];
    }
    requestHandler.updateWorkflowOnlySelectedField(req, res, _id, data);
});
app.delete('/Workflows/:_id', function (req, res) {
    data = {};
    var _id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeWorkflow(req, res, _id, data);
});
//-------------------Companies--------------------------------------------------

app.post('/Companies', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.company = req.body;
    requestHandler.createCompany(req, res, data);
});
app.get('/CompaniesForDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getCompaniesForDd(req, res, data);
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
        default: requestHandler.getFilterCustomers(req, res);
            break;
    }
});

app.get('/ownCompanies/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getCompanyById(req, res, data);
            break;
        default: requestHandler.getFilterCustomers(req, res);
            break;
    }
});

app.put('/Companies/:viewType/:_id', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.company = req.body;
    var remove = req.headers.remove;
    if (data.company.salesPurchases.salesPerson && (typeof (data.company.salesPurchases.salesPerson) == 'object')) {
        data.company.salesPurchases.salesPerson = data.company.salesPurchases.salesPerson._id;
    }
    if (data.company.salesPurchases.salesTeam && (typeof (data.company.salesPurchases.salesTeam) == 'object')) {
        data.company.salesPurchases.salesTeam = data.company.salesPurchases.salesTeam._id;
    }
    requestHandler.updateCompany(req, res, id, data, remove);
});
app.patch('/Companies/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    requestHandler.companyUpdateOnlySelectedFields(req, res, id, req.body);
});
app.delete('/Companies/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCompany(req, res, id, data);
});

app.delete('/Companies/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCompany(req, res, id, data);
});

app.delete('/ownCompanies/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCompany(req, res, id, data);
});

app.delete('/ownCompanies/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeCompany(req, res, id, data);
});

app.put('/ownCompanies/:_id', function (req, res) {
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
app.patch('/ownCompanies/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    requestHandler.companyUpdateOnlySelectedFields(req, res, id, req.body);
});
app.put('/ownCompanies/:viewType/:_id', function (req, res) {
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

app.get('/getCompaniesAlphabet', function (req, res) {
    requestHandler.getCustomersAlphabet(req, res);
});

app.get('/getownCompaniesAlphabet', function (req, res) {
    requestHandler.getCustomersAlphabet(req, res);
});

//------------------JobPositions---------------------------------------------------
app.get('/jobType', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    //data._id = req.param('_id');
    requestHandler.getJobType(req, res, data);
});

app.post('/JobPositions', function (req, res) {
    data = {};
    data.mid = req.headers.mid;
    data.jobPosition = req.body;
    requestHandler.createJobPosition(req, res, data);
});

app.get('/JobPosition', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    //data._id = req.param('_id');
    requestHandler.getJobPosition(req, res, data);
});

app.get('/JobPositionForDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    //data._id = req.param('_id');
    requestHandler.getJobPositionForDd(req, res, data);
});

app.get('/JobPositions/:viewType', function (req, res) {
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getJobPositionById(req, res, data);
            break;
        default: requestHandler.getFilterJobPosition(req, res);
            break;
    }

});

app.get('/JobPosition/:_id', function (req, res) {
    data = {};
    data._id = req.params._id;
    //data._id = req.param('_id');
    res.send(200, { success: 'ok' });
    //requestHandler.getJobPosition(req, res, data);
});

//app.put('/JobPositions/:viewType/:_id', function (req, res) {
//    data = {};
//    var id = req.param('_id');
//    data.mid = req.headers.mid;
//    data.jobPosition = req.body;
//    requestHandler.updateJobPosition(req, res, id, data);
//});

app.patch('/JobPositions/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.jobPosition = req.body;
    requestHandler.updateJobPosition(req, res, id, data);
});

app.put('/JobPositions/:_id', function (req, res) {
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

app.delete('/JobPositions/:_id', function (req, res) {
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

app.get('/DepartmentsForDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getDepartmentForDd(req, res, data);
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
    } 3
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getDepartmentById(req, res, data);
            break;
        default: requestHandler.getCustomDepartment(req, res, data);
            break;
    }

});

app.put('/Departments/:_id', function (req, res) {
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

app.delete('/Departments/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeDepartment(req, res, id, data);
});
app.get('/getDepartmentsForEditDd', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    var id = req.param('id');
    requestHandler.getDepartmentForEditDd(req, res, id, data);
});


//------------------Employee---------------------------------------------------

app.get('/Employees', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getEmployees(req, res, data);
});

app.get('/Birthdays', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.Birthdays(req, res, data);
});

app.get('/getForDdByRelatedUser', function (req, res) {
    console.log('------getAccountsForDd-----------------');
    data = {};
    //data.ownUser = true;
    data.mid = req.param('mid');
    requestHandler.getForDdByRelatedUser(req, res, data);
});

app.get('/Employees/:viewType', function (req, res) {
    console.log('-------------------------------');
    var data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    var viewType = req.params.viewType;
    switch (viewType) {
        case "list": requestHandler.getEmployeesFilter(req, res);
            break;
        case "thumbnails": requestHandler.getEmployeesFilter(req, res);
            break;
        case "form": requestHandler.getEmployeesById(req, res);
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
app.patch('/Employees/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    console.log(req.body);
    requestHandler.employeesUpdateOnlySelectedFields(req, res, id, req.body);
});

app.delete('/Employees/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.removeEmployees(req, res, id, data);
});

app.delete('/Employees/:_id', function (req, res) {
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

app.get('/getEmployeesAlphabet', function (req, res) {
    console.log('------getAccountsForDd-----------------');
    data = {};
    //data.ownUser = true;
    data.mid = req.param('mid');
    requestHandler.getEmployeesAlphabet(req, res, data);
});

app.get('/getEmployeesImages', function (req, res) {
    data = {};
    data.ids = req.param('ids') || [];
    requestHandler.getEmployeesImages(req, res, data);
});

//------------------Applications---------------------------------------------------

app.get('/getApplicationsLengthByWorkflows', function (req, res) {
    requestHandler.getApplicationsLengthByWorkflows(req, res);
});

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
    viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getApplicationById(req, res, data);
            break;
        case "list": requestHandler.getEmployeesFilter(req, res);
            break;
        case "kanban": requestHandler.getApplicationsForKanban(req, res, data);
            break;
    }


});

app.post('/Applications', function (req, res) {
    console.log('-------------------/createEmployee-----------------------------');
    data = {};
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.createApplication(req, res, data);
});

app.put('/Applications/:_id', function (req, res) {
    console.log('-----SERVER put Applications---------------');
    var data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateApplication(req, res, id, data);
});

app.patch('/Applications/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    console.log(req.body);
    requestHandler.aplicationUpdateOnlySelectedFields(req, res, id, req.body);
});
app.patch('/Applications/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    console.log(req.body);
    requestHandler.aplicationUpdateOnlySelectedFields(req, res, id, req.body);
});
app.put('/Applications/:viewType/:_id', function (req, res) {
    console.log('-----SERVER put Applications---------------');
    var data = {};
    var id = req.body._id;
    data.mid = req.headers.mid;
    data.employee = req.body;
    requestHandler.updateApplication(req, res, id, data);
});

app.delete('/Applications/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeApplication(req, res, id, data);
});

app.delete('/Applications/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeApplication(req, res, id, data);
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

//----------------------campaign----------------------------------------------------------------
app.get('/Campaigns', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getCampaigns(req, res, data);
});

app.get('/sources', function (req, res) {
    requestHandler.getSources(req, res);
});
app.get('/Languages', function (req, res) {
    requestHandler.getLanguages(req, res);
});

//----------------------Leads----------------------------------------------------------------
app.get('/LeadsForChart', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    data.source = req.param('source');
    data.dataRange = req.param('dataRange');
    data.dataItem = req.param('dataItem');
    requestHandler.getLeadsForChart(req, res, data);
});

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
    console.log('============== /Leads/:viewType=================');
    var viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getLeadsById(req, res, data);
            break;
        case "list": requestHandler.getFilterOpportunities(req, res);
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
    requestHandler.updateLead(req, res, id, data);
});

app.put('/Leads/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.lead = req.body;
    requestHandler.updateLead(req, res, id, data);
});

app.delete('/Leads/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeLead(req, res, id, data);
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
    viewType = req.params.viewType;
    switch (viewType) {
        case "form": requestHandler.getOpportunityById(req, res, data);
            break;
        case "kanban": requestHandler.getFilterOpportunitiesForKanban(req, res, data);
            break;
        default: requestHandler.getFilterOpportunities(req, res);
    }
});

app.get('/OpportunitiesForMiniView', function (req, res) {
    data = {};
    for (var i in req.query) {
        data[i] = req.query[i];
    }
    requestHandler.getFilterOpportunitiesForMiniView(req, res, data);

});

app.get('/Opportunities', function (req, res) {
    data = {};
    data.mid = req.param('mid');
    requestHandler.getOpportunities(req, res, data);
});

app.get('/getLengthByWorkflows', function (req, res) {
    requestHandler.getOpportunitiesLengthByWorkflows(req, res);
});

app.put('/Opportunities/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.toBeConvert = req.headers.toBeConvert;
    data.opportunitie = req.body;
    requestHandler.updateOpportunitie(req, res, id, data, remove);
});

app.put('/Opportunities/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.toBeConvert = req.headers.toBeConvert;
    data.opportunitie = req.body;
    requestHandler.updateOpportunitie(req, res, id, data);
});

app.patch('/Opportunities/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.toBeConvert = req.headers.toBeConvert;
    data.opportunitie = req.body;
    requestHandler.opportunitieUpdateOnlySelectedFields(req, res, id, data);
});
app.patch('/Opportunities/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    data.toBeConvert = req.headers.toBeConvert;
    data.opportunitie = req.body;
    requestHandler.opportunitieUpdateOnlySelectedFields(req, res, id, data);
});

app.delete('/Opportunities/:viewType/:_id', function (req, res) {
    data = {};
    var id = req.param('_id');
    data.mid = req.headers.mid;
    requestHandler.removeOpportunitie(req, res, id, data);
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
    data.idArray = req.param('idArray');
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
app.post('/SendToGoogleCalendar', function (req, res) {
    requestHandler.sendToGoogleCalendar(req, res);
});
app.get('/ChangeSyncCalendar', function (req, res) {
    var id = req.param('id');
    var isSync = req.param('isSync');
    requestHandler.changeSyncCalendar(id, isSync, res, req);
});
app.get('/:id', function (req, res) {
    var id = req.param('id');
    if (!isNaN(parseFloat(id))) {
        requestHandler.redirectFromModuleId(req, res, id);
    } else {
        res.send(500);
    }
});
app.listen(8088);

//console.log(app.routes);

console.log("server start");
