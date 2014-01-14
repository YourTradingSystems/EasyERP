var Opportunities = function (logWriter, mongoose, customer, workflow, department, models) {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var newObjectId = mongoose.Types.ObjectId;
    var opportunitiesSchema = mongoose.Schema({
        isOpportunitie: { type: Boolean, default: false, index: true },
        name: { type: String, default: '' },
        expectedRevenue: {
            value: { type: Number, default: '' },
            progress: { type: Number, default: '' },
            currency: { type: String, default: '' }
        },
        creationDate: { type: Date, default: Date.now },
        tempCompanyField: { type: String, default: '' },
        company: { type: ObjectId, ref: 'Customers', default: null },
        customer: { type: ObjectId, ref: 'Customers', default: null },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        contactName: {
            first: { type: String, default: '' },
            last: { type: String, default: '' }
        },
        email: { type: String, default: '' },
        phones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' },
            fax: { type: String, default: '' }
        },
        func: { type: String, default: '' },
        salesPerson: { type: ObjectId, ref: 'Employees', default: null },
        salesTeam: { type: ObjectId, ref: 'Department', default: null },
        internalNotes: { type: String, default: '' },
        nextAction: {
            desc: { type: String, default: '' },
            date: { type: Date, default: Date.now }
        },
        expectedClosing: { type: Date, default: null },
        priority: { type: String, default: 'Trivial' },
        categories: {
            id: { type: String, default: '' },
            name: { type: String, default: '' }
        },
        color: { type: String, default: '#4d5a75' },
        active: { type: Boolean, default: true },
        optout: { type: Boolean, default: false },
        reffered: { type: String, default: '' },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        info: {
            StartDate: Date,
            EndDate: Date,
            duration: Number,
            sequence: { type: Number, default: 0 },
            parent: { type: String, default: null }
        },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        campaign: { type: String, default: '' },
        source: { type: String, default: '' },
        isConverted: { type: Boolean, default: false },
        convertedDate: { type: Date, default: Date.now }
    }, { collection: 'Opportunities' });

    mongoose.model('Opportunities', opportunitiesSchema);

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('Opprtunities.create Incorrect Incoming Data');
                res.send(400, { error: 'Opprtunities.create Incorrect Incoming Data' });
                return;
            } else {
                var query = { name: data.name };
                models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find(query, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log('Opprtunities.js. create opportunitie.find' + error);
                        res.send(500, { error: 'Opprtunities.create find error' });
                    }
                    if (doc.length > 0) {
                        if (doc[0].name === data.name) {
                            res.send(400, { error: 'An Opprtunities with the same Name already exists' });
                        }
                    } else if (doc.length === 0) {
                        savetoDb(data);
                    }
                });
            }

            function savetoDb(data) {
                try {
                    //					var last = 365*24*60*60*1000;

                    //					for (var i=0;i<4000;i++){

                    _opportunitie = new models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema)();
                    _opportunitie.isOpportunitie = (data.isOpportunitie) ? data.isOpportunitie : false;
                    if (data.name) {
                        _opportunitie.name = data.name;
                    }
                    if (data.color) {
                        _opportunitie.color = data.color;
                    }
                    if (data.expectedRevenue) {
                        if (data.expectedRevenue.value) {
                            _opportunitie.expectedRevenue.value = data.expectedRevenue.value;
                        }
                        if (data.expectedRevenue.progress) {
                            _opportunitie.expectedRevenue.progress = data.expectedRevenue.progress;
                        }
                        if (data.expectedRevenue.currency) {
                            _opportunitie.expectedRevenue.currency = data.expectedRevenue.currency;
                        }
                    }
                    if (data.creationDate) {
                        _opportunitie.creationDate = data.creationDate;
                    }
                    if (data.company) {
                        if (data.company.id) {
                            _opportunitie.company = data.company.id;
                        } else if (data.company.name) {
                            _opportunitie.tempCompanyField = data.company.name;
                        }
                    }
                    if (data.customer) {
                        _opportunitie.customer = data.customer;
                    }
                    if (data.address) {
                        if (data.address.street) {
                            _opportunitie.address.street = data.address.street;
                        }
                        if (data.address.city) {
                            _opportunitie.address.city = data.address.city;
                        }
                        if (data.address.state) {
                            _opportunitie.address.state = data.address.state;
                        }
                        if (data.address.zip) {
                            _opportunitie.address.zip = data.address.zip;
                        }
                        if (data.address.country) {
                            _opportunitie.address.country = data.address.country;
                        }
                    }
                    if (data.contactName) {
                        if (data.contactName.first) {
                            _opportunitie.contactName.first = data.contactName.first;
                        }
                        if (data.contactName.last) {
                            _opportunitie.contactName.last = data.contactName.last;
                        }
                    }
                    if (data.email) {
                        _opportunitie.email = data.email;
                    }
                    if (data.phones) {
                        if (data.phones.phone) {
                            _opportunitie.phones.phone = data.phones.phone;
                        }
                        if (data.phones.mobile) {
                            _opportunitie.phones.mobile = data.phones.mobile;
                        }
                        if (data.fax) {
                            _opportunitie.phones.fax = data.phones.fax;
                        }
                    }
                    if (data.func) {
                        _opportunitie.func = data.func;
                    }
                    if (data.salesPerson) {
                        _opportunitie.salesPerson = data.salesPerson;
                    }
                    if (data.salesTeam) {
                        _opportunitie.salesTeam = data.salesTeam;
                    }
                    if (data.internalNotes) {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if (data.nextAction) {
                        if (data.nextAction.desc) {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (data.nextAction.date) {
                            _opportunitie.nextAction.date = new Date(data.nextAction.date);
                        }
                    }
                    if (data.expectedClosing) {
                        _opportunitie.expectedClosing = new Date(data.expectedClosing);
                    }
                    if (data.priority) {
                        if (data.priority) {
                            _opportunitie.priority = data.priority;
                        }
                    }
                    if (data.categories) {
                        if (data.categories._id) {
                            _opportunitie.categories.id = data.categories._id;
                        }
                        if (data.categories.name) {
                            _opportunitie.categories.name = data.categories.name;
                        }
                    }
                    if (data.groups) {
                        _opportunitie.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _opportunitie.whoCanRW = data.whoCanRW;
                    }
                    if (data.info) {
                        if (data.info.StartDate) {
                            _opportunitie.info.StartDate = data.info.StartDate;
                        }
                        if (data.info.EndDate) {
                            _opportunitie.info.EndDate = data.info.EndDate;
                        }
                        if (data.info.sequenc) {
                            _opportunitie.info.sequence = data.info.sequence;
                        }
                        if (data.info.parent) {
                            _opportunitie.info.parent = data.info.parent;
                        }

                    }
                    if (data.workflow) {
                        _opportunitie.workflow = data.workflow;
                    }
                    if (data.active) {
                        _opportunitie.active = data.active;
                    }
                    if (data.optout) {
                        _opportunitie.optout = data.optout;
                    }
                    if (data.reffered) {
                        _opportunitie.reffered = data.reffered;
                    }
                    if (data.uId) {
                        _opportunitie.createdBy.user = data.uId;
                    }
                    if (data.campaign) {
                        _opportunitie.campaign = data.campaign;
                    }
                    if (data.source) {
                        _opportunitie.source = data.source;
                    }

                    /*					function makeArr()
                                        {
                                            var text = "";
                                            var possible = [						
                                            "linkedin",
                                            "jobscore.com",
                                            "stackoverflow.com",
                                            "jobvite.com",
                                            "zappos.com",
                                            "sixtostart.com",
                                            "creativecircle.com",
                                            "sangfroidgame.com",
                                            "partner",
                                            "customer",
                                            "selfGenerated",
                                            "website"];
                    
                                            return possible[Math.floor(Math.random() * possible.length)];
                    
                    
                                        }
                                        function makeid()
                                        {
                                            var text = "";
                                            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    
                                            for( var i=0; i < 20; i++ )
                                                text += possible.charAt(Math.floor(Math.random() * possible.length));
                    
                                            return text;
                                        }
                                        //delete its
                                            var a = new Date()-Math.floor(Math.random()*last);
                                            var c = new Date(a);
                                            _opportunitie.source = makeArr();
                                            _opportunitie.name = makeid();
                                            console.log(_opportunitie.name);
                                            if (data.uId) {
                                                _opportunitie.createdBy.user = data.uId;
                                                _opportunitie.createdBy.date = c;
                                            }
                                            if (Math.random()>0.7){
                                                _opportunitie.isOpportunitie=true;
                                                _opportunitie.isConverted = true;
                                                _opportunitie.workflow="528cdcb4f3f67bc40b000006"
                                            }*/
                    _opportunitie.save(function (err, result) {
                        if (err) {
                            //								console.log(err);
                            console.log("Opportunities.js create savetoDB _opportunitie.save " + err);
                            res.send(500, { error: 'Opportunities.save BD error' });
                        } else {
                            logWriter.log("Opportunities.js create savetoDB " + result);
                            res.send(201, { success: 'A new Opportunities create success' });
                        }
                    });
                    //					}
                } catch (error) {
                    console.log(error);
                    logWriter.log("Opportunities.js create savetoDB " + error);
                    res.send(500, { error: 'Opportunities.save  error' });
                }
            }

        } catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js  " + exception);
            res.send(500, { error: 'opportunitie.save  error' });
        }
    };

    function getLeadsForChart(req, response, data) {
        var res = {};
        console.log(data);
        if (!data.dataRange) data.dataRange = 365;
        if (!data.dataItem) data.dataItem = "M";
        switch (data.dataItem) {
            case "M":
                data.dataItem = "$month"
                break;
            case "W":
                data.dataItem = "$week"
                break;
            case "D":
                data.dataItem = "$dayOfYear"
                break;
            case "DW":
                data.dataItem = "$dayOfWeek"
                break;
            case "DM":
                data.dataItem = "$dayOfMonth"
                break;

        }
        if (data.source) {

            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate({ $match: { $and: [{ createdBy: { $ne: null }, $or: [{ isConverted: true }, { isOpportunitie: false }] }, { 'createdBy.date': { $gte: a } }] } }, { $group: { _id: { source: "$source", isOpportunitie: "$isOpportunitie" }, count: { $sum: 1 } } }, { $project: { "source": "$_id.source", count: 1, "isOpp": "$_id.isOpportunitie", _id: 0 } }).exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Opportunities.js chart' + err);
                    response.send(500, { error: "Can't get chart" });
                } else {
                    res['data'] = result;
                    response.send(res);
                }

            });
        } else {
            var item = data.dataItem;
            var myItem = {};
            myItem["$project"] = { isOpportunitie: 1, convertedDate: 1 };
            myItem["$project"]["dateBy"] = {};
            myItem["$project"]["dateBy"][data.dataItem] = "$convertedDate";
            if (data.dataItem == "$dayOfYear") {
                myItem["$project"]["year"] = {};
                myItem["$project"]["year"]["$year"] = "$convertedDate";
            }
            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate(
				{
				    $match: {
				        $and: [{
				            createdBy: { $ne: null },
				            $or: [{ isConverted: true }, { isOpportunitie: false }]
				        },
							   {
							       'createdBy.date': { $gte: a }
							   }]
				    }
				},
				myItem,
				{
				    $group: {
				        _id: { dateBy: "$dateBy", isOpportunitie: "$isOpportunitie", year: "$year" },
				        count: { $sum: 1 },
				        date: { $push: "$convertedDate" }
				    }
				},
				{
				    $project: {
				        "source": "$_id.dateBy",
				        count: 1,
				        date: 1,
				        year: "$_id.year",
				        "isOpp": "$_id.isOpportunitie",
				        _id: 0
				    }
				},
				{
				    $sort: { year: 1, source: 1 }
				}
			).exec(function (err, result) {
			    if (err) {
			        console.log(err);
			        logWriter.log('Opportunities.js chart' + err);
			        response.send(500, { error: "Can't get chart" });
			    } else {
			        res['data'] = result;
			        console.log(result);
			        response.send(res);
			    }

			});
        }
    }

    function get(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find({ isOpportunitie: true });
        query.sort({ name: 1 });
        query.populate('company customer salesPerson salesTeam workflow').
            populate('createdBy.user').
            populate('editedBy.user');

        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getById(req, id, response) {
        var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).findById(id);
        query.populate('company customer salesPerson salesTeam workflow').
            populate('groups.users').
            populate('groups.group').
            populate('createdBy.user').
            populate('editedBy.user');


        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, { error: "Can't find Opportunities" });
            } else {
                response.send(result);
            }
        });
    };

    function getLeads(req, response) {
        //var res = {};
        //res['data'] = [];
        //var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find({ isOpportunitie: false });
        //query.sort({ name: 1 });
        //query.populate('customer salesPerson salesTeam workflow').
        //    populate('createdBy.user').
        //    populate('editedBy.user');

        //query.exec(function (err, result) {
        //    if (err) {
        //        console.log(err);
        //        logWriter.log('Leads.js get lead.find' + err);
        //        response.send(500, { error: "Can't find Leads" });
        //    } else {
        //        res['data'] = result;
        //        console.log(res);
        //        response.send(res);
        //    }
        //});
    };

    function getLeadsCustom(req, data, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: false
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.populate('customer', 'name').
                                populate('workflow', '_id name').
                                populate('createdBy.user', 'login').
                                populate('editedBy.user', 'login').
                                skip((data.page - 1) * data.count).
                                limit(data.count).
                                exec(function (error, _res) {
                                    if (!error) {
                                        res['data'] = _res;
                                        res['listLength'] = _res.length;
                                        response.send(res);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    };
    function getLeadsForList(req, data, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: false
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.select("_id createdBy editedBy name workflow contactName phones campaign source email contactName").
								populate('company', 'name').
								populate('workflow',"name").
                                populate('createdBy.user', 'login').
                                populate('editedBy.user', 'login').
                                skip((data.page - 1) * data.count).
                                limit(data.count).
                                exec(function (error, _res) {
                                    if (!error) {
                                        res['data'] = _res;
                                        res['listLength'] = _res.length;
                                        response.send(res);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    };

    function update(req, _id, data, res) {
        function updateOpp() {
            var createPersonCustomer = function (company) {
                if (data.contactName && (data.contactName.first || data.contactName.last)) {                           //�������� Person
                    var _person = {
                        name: data.contactName,
                        email: data.email,
                        company: company._id,
                        salesPurchases: {
                            isCustomer: true,
                            salesPerson: data.salesPerson
                        },
                        type: 'Person',
                        createdBy: { user: req.session.uId }
                    }
                    models.get(req.session.lastDb - 1, "Customers", customer.customerSchema).find({ $and: [{ 'name.first': data.contactName.first }, { 'name.last': data.contactName.last }] }, function (err, _persons) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Opportunities.js update opportunitie.update " + err);
                        } else if (_persons.length > 0) {
                            if (_persons[0].salesPurchases && !_persons[0].salesPurchases.isCustomer) {
                                models.get(req.session.lastDb - 1, "Customers", customer.customerSchema).update({ _id: _persons[0]._id }, { $set: { 'salesPurchases.isCustomer': true } }, function (err, success) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("Opportunities.js update opportunitie.update " + err);
                                    }
                                });
                            }
                        } else {
                            var _Person = new models.get(req.session.lastDb - 1, "Customers", customer.customerSchema)(_person);
                            _Person.save(function (err, _res) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                                }
                            });
                        }
                    });
                }                                              //����� �������� Person
            };


            console.log(_id);
            console.log(data.groups);


            if (data.company && data.company._id) {
                data.company = data.company._id;
            } else if (data.company) {
                data.tempCompanyField = data.company;
                delete data.company;
            } else {
                delete data.company;
            }
            if (data.customer && data.customer._id) {
                data.customer = data.customer._id;
            }
            if (data.salesPerson && data.salesPerson._id) {
                data.salesPerson = data.salesPerson._id;
            }
            if (data.salesTeam && data.salesTeam._id) {
                data.salesTeam = data.salesTeam._id;
            }
            if (data.workflow && data.workflow._id) {
                data.workflow = data.workflow._id;
            }
            if (data.groups&&data.groups.group) {
                data.groups.group.forEach(function (group, index) {
                    if (group._id) data.groups.group[index] = newObjectId(group._id.toString());
                });
            }
            if (data.groups&&data.groups.users) {
                data.groups.users.forEach(function (user, index) {
                    if (user._id) data.groups.users[index] = newObjectId(user._id.toString());
                });
            }

			if (data.workflowForList){
				data={
					$set:{
						workflow:data.workflow
					}
				}
			}

            models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).update({ _id: _id }, data, function (err, result) {
                console.log(data);
                if (err) {
                    console.log(err);
                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                    res.send(500, { error: "Can't update Opportunities" });
                } else {
                    if (data.createCustomer) {                       //�������� ���������
                        console.log('************Cre Cust***********');
                        console.log(data.tempCompanyField);
                        console.log('*******************************');
                        if (data.tempCompanyField) {                          //�������� �������
                            var _company = {
                                name: {
                                    first: data.tempCompanyField,
                                    last: ''
                                },
                                email: data.email,
                                salesPurchases: {
                                    isCustomer: true,
                                    salesPerson: data.salesPerson
                                },
                                type: 'Company',
                                createdBy: { user: req.session.uId }
                            };
                            console.log(_company);
                            models.get(req.session.lastDb - 1, 'Customers', customer.customerSchema).find({ 'name.first': data.tempCompanyField }, function (err, companies) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                                } else if (companies.length > 0) {
                                    if (companies[0].salesPurchases && !companies[0].salesPurchases.isCustomer) {
                                        models.get(req.session.lastDb - 1, 'Customers', customer.customerSchema).update({ _id: companies[0]._id }, { $set: { 'salesPurchases.isCustomer': true } }, function (err, success) {
                                            if (success) {
                                                createPersonCustomer(companies[0]);
                                            }
                                        })
                                    }
                                } else {
                                    var _Company = new models.get(req.session.lastDb - 1, 'Customers', customer.customerSchema)(_company);
                                    _Company.save(function (err, _res) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log("Opportunities.js update opportunitie.update " + err);
                                        } else {
                                            models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).update({ _id: _id }, { $set: { company: _res._id, customer: _res._id } }, function (err, result) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                            createPersonCustomer(_res);
                                        }
                                    });
                                }
                            });

                        } else {                                              //кінець кастомер Компанія
                            createPersonCustomer({});
                        }
                    }
                    res.send(200, { success: 'Opportunities updated success' });
                }
            });
        };

        try {
            delete data._id;
            delete data.createdBy;
            if (data.workflow && data.workflow.wId == 'Lead') {
                models.get(req.session.lastDb - 1, 'workflows', workflow.workflowSchema).findOne({ wId: 'Opportunity' }, function (err, _workflow) {
                    if (_workflow) {
                        data.workflow._id = _workflow._id;
                    }
                    updateOpp();
                });
            } else {
                updateOpp();
            }

        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js update " + exception);
            res.send(500, { error: 'Opportunities updated error' });
        }
    };// end update

    function getFilterOpportunities(req, data, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: true
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find().where('_id').in(result);
                                if (data && data.status && data.status.length > 0)
                                    query.where('workflow').in(data.status);
                                query.populate('customer', 'name').
                                populate('workflow', '_id name').
                                populate('createdBy.user', 'login').
                                populate('editedBy.user', 'login').
                                skip((data.page - 1) * data.count).
                                limit(data.count).
                                exec(function (error, _res) {
                                    if (!error) {
                                        res['data'] = _res;
                                        res['listLength'] = _res.length;
                                        response.send(res);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    }

    function getFilterOpportunitiesForKanban(req, data, response) {
        var res = {};
        res['data'] = [];
        res['options'] = [];
        var optionsArray = [];
        var showMore = false;
        models.get(req.session.lastDb - 1, "Department", department.DepartmentSchema).aggregate(
            {
                $match: {
                    users: newObjectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (!err) {
                    var arrOfObjectId = deps.objectID();
                    console.log(arrOfObjectId);
                    models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: true
                                    },
                                    {
                                        $or: [
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.users': newObjectId(req.session.uId) }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { whoCanRW: 'group' },
                                                            { 'groups.group': { $in: arrOfObjectId } }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { whoCanRW: 'owner' },
                                                    { 'groups.owner': newObjectId(req.session.uId) }
                                                ]
                                            },
                                            { whoCanRW: "everyOne" }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                workflow: 1
                            }
                        },
                        {
                            $group: {
                                _id: "$workflow",
                                opportunitieId: { $push: "$_id" },
                                count: { $sum: 1 }
                            }
                        },
                        function (err, responseOpportunities) {
                            if (!err) {
                                console.log(responseOpportunities);
                                var responseOpportunitiesArray = [];
                                var columnValue = data.count;
                                var page = data.page;
                                var startIndex, endIndex;
                                showMore = responseOpportunities.getShowmore(page * columnValue);
                                responseOpportunities.forEach(function (value) {
                                    if ((data.page - 1) * data.count > value.opportunitieId.length) {
                                        startIndex = value.count;
                                    } else {
                                        startIndex = (data.page - 1) * data.count;
                                    }

                                    if (data.page * data.count > value.count) {
                                        endIndex = value.count;
                                    } else {
                                        endIndex = data.page * data.count;
                                    }

                                    for (var k = startIndex; k < endIndex; k++) {
                                        responseOpportunitiesArray.push(value.opportunitieId[k]);
                                    }
                                    optionsArray.push(value);
                                });
                                models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).find().
                                where('_id').in(responseOpportunitiesArray).
								select("_id customer salesPerson workflow editedBy.date name nextAction expectedRevenue").
                                //populate('relatedUser').
								populate('customer','name').
                                //populate('department').
                                //populate('jobPosition').
                                populate('salesPerson','name').
                                populate('workflow','_id').
								sort({ 'editedBy.date': -1 }).
								//populate('createdBy.user','login').
                                //populate('editedBy.user','login').
                                //populate('groups.users','_id login').
                                //populate('groups.group', '_id departmentName').
                                exec(function (err, result) {
                                    if (!err) {
                                        res['showMore'] = showMore;
                                        res['options'] = optionsArray;
                                        res['data'] = result;
                                        response.send(res);
                                    } else {
                                        logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban opportunitie.find" + err);
                                        response.send(500, { error: "Can't find Opportunitie" });
                                    }
                                })
                            } else {
                                logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban task.find " + err);
                                response.send(500, { error: "Can't group Opportunitie" });
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function remove(req, _id, res) {
        models.get(req.session.lastDb - 1, "Opportunities", opportunitiesSchema).remove({ _id: _id }, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Opportunities.js remove opportunitie.remove " + err);
                res.send(500, { error: "Can't remove Opportunities" });
            } else {
                res.send(200, { success: 'Opportunities removed' });
            }
        });
    };// end remove

    return {
        create: create,

        get: get,

        getById: getById,

        getFilterOpportunities: getFilterOpportunities,

        getFilterOpportunitiesForKanban: getFilterOpportunitiesForKanban,

        getLeads: getLeads,

        getLeadsForChart: getLeadsForChart,

		getLeadsForList: getLeadsForList,

        getLeadsCustom: getLeadsCustom,

        update: update,

        remove: remove,

        opportunitiesSchema: opportunitiesSchema
    }
};
module.exports = Opportunities;
