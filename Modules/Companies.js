var Company = function (logWriter, mongoose) {

    var CompanySchema = mongoose.Schema({
        image: { type: String, default: '' },
        isOwnCompany: { type: Boolean, default: false },
        email: { type: String, default: '' },
        name: { type: String, default: 'emptyCompany' },
        address: {
            street1: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        website: { type: String, default: '' },
        contacts: { type: Array, default: [] },
        phones: {
            phone: { type: String, default: '' },
            mobile: { type: String, default: '' },
            fax: { type: String, default: '' },
        },
        internalNotes: { type: String, default: '' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: false },
            isSupplier: { type: Boolean, default: false },
            salesPerson: { type: String, default: '' },
            salesTeam: { type: String, default: '' },
            active: { type: Boolean, default: true },
            reference: { type: String, default: '' },
            language: { type: String, default: 'English' },
            date: { type: Date, default: null },
            receiveMessages: { type: Number, default: 0 }
        },
        social: {
            fb: { type: String, default: '' },
            li: { type: String, default: '' }
        },
        history: { type: Array, default: [] }
    }, { collection: 'Companies' });

    var company = mongoose.model('Companies', CompanySchema);

    return {
        create: function(data, res) {
            try {
                if (!data) {
                    logWriter.log('Company.create Incorrect Incoming Data');
                    res.send(400, { error: 'Company.create Incorrect Incoming Data' });
                    return;
                } else {
                    company.find({ cname: data.name }, function(error, result) {
                        if (error) {
                            logWriter.log("Company.js. create Company.find" + error);
                            res.send(500, { error: 'Company.create find error' });
                        }
                        if (result) {
                            if (doc[0].name === data.name) {
                                res.send(400, { error: 'An company with the same Name already exists' });
                            }
                        } else if (result.length === 0) {
                            savetoBd(data);
                        }
                    });
                }

                function savetoBd(data) {
                    try {
                        _company = new company();
                        if (data.isOwnCompany) {
                            _company.isOwnCompany = data.isOwnCompany;
                        }
                        if (data.email) {
                            _company.email = data.email;
                        }
                        if (data.cname) {
                            _company.name = data.name;
                        }
                        if (data.cinternalNotes) {
                            _company.internalNotes = data.internalNotes;
                        }
                        if (data.address) {
                            if (data.address.street1) {
                                _company.address.street1 = data.address.street1;
                            }
                            if (data.address.street2) {
                                _company.address.street2 = data.address.street2;
                            }
                            if (data.address.city) {
                                _company.address.city = data.address.city;
                            }
                            if (data.caddress.state) {
                                _company.address.state = data.address.state;
                            }
                            if (data.address.zip) {
                                _company.address.zip = data.address.zip;
                            }
                            if (data.address.country) {
                                _company.address.country = data.address.country;
                            }
                        }
                        if (data.website) {
                            _company.website = data.website;
                        }
                        if (data.phones) {
                            if (data.phones.phone) {
                                _company.phones.phone = data.phones.phone;
                            }
                            if (data.phones.mobile) {
                                _company.phones.mobile = data.phones.mobile;
                            }
                            if (data.phones.fax) {
                                _company.phones.fax = data.phones.fax;
                            }
                        }
                        if (data.internalNotes) {
                            _company.internalNotes = data.internalNotes;
                        }
                        if (data.salesPurchases) {
                            if (data.salesPurchases.active) {
                                _company.salesPurchases.active = data.salesPurchases.active;
                            }
                            if (data.salesPurchases.language) {
                                _company.salesPurchases.language = data.salesPurchases.language;
                            }
                            if (data.salesPurchases.isCustomer) {
                                _company.salesPurchases.isCustomer = data.salesPurchases.isCustomer;
                            }
                            if (data.salesPurchases.isSupplier) {
                                _company.salesPurchases.isSupplier = data.salesPurchases.isSupplier;
                            }
                            if (data.salesPurchases.salesPerson) {
                                _company.salesPurchases.salesPerson = data.salesPurchases.salesPerson;
                            }
                            if (data.salesPurchases.salesTeam) {
                                _company.salesPurchases.salesTeam = data.salesPurchases.salesTeam;
                            }
                            if (data.salesPurchases.reference) {
                                _company.salesPurchases.reference = data.salesPurchases.reference;
                            }
                            if (data.salesPurchases.date) {
                                _company.salesPurchases.date = data.salesPurchases.date;
                            }
                            if (data.salesPurchases.receiveMessages) {
                                _company.salesPurchases.receiveMessages = data.salesPurchases.receiveMessages;
                            }
                        }
                        if (data.history) {
                            _company.history = data.history;
                        }
                        _company.save(function(err, result) {
                            if (err) {
                                console.log(err);
                                logWriter.log("Company.js create savetoBd _company.save" + err);
                                res.send(500, { error: 'Company .save BD error' });
                            } else {
                                res.send(201, { success: 'A new Company create success' });
                            }
                        });
                    } catch(error) {
                        console.log(error);
                        logWriter.log("Company.js create savetoBd" + error);
                        res.send(500, { error: 'Company .save Script error' });
                    }
                }
            } catch(Exception) {
                console.log(Exception);
                logWriter.log("Company.js  " + Exception);
                res.send(500, { error: 'Company .save Script error' });
            }
        },//End create

        getById: function (id, func) {
            try {
                var res = {}
                res['data'] = {};
                res['result'] = {
                    'status': '1',
                    'description': 'No user was finde with this Login'
                };

                if (uid != null) {
                    company.findById(id, function (err, _company) {
                        try {
                            console.log(_company);
                            if (err) {
                                res['result'] = {
                                    'status': '2',
                                    'description': err
                                };

                                logWriter.log("Company.js findById Company.findById " + err);
                                func(res);
                            }

                            if (_company) {
                                //res['data']['uid'] = _company._id;
                                //res['data']['utype'] = _company.utype;
                                //res['data']['ulogin'] = _company.ulogin;
                                //res['data']['uemail'] = _company.uemail;
                                //res['data']['uname'] = _company.uname;
                                //res['data']['ucompanyid'] = _company.ucompanyid;
                                //res['data']['uactive'] = _company.uactive;
                                //res['data']['ulang'] = _company.ulang;
                                //res['data']['utimezone'] = _company.utimezone;
                                res['data'] = _company;
                                res['result'] = {
                                    'status': '0',
                                    'description': 'No errors'
                                };

                                func(res);
                            }
                                //???? ????? ???????, ? ?????? ??
                            else {
                                res['result'] = {
                                    'status': '3',
                                    'description': 'Incorrect uid'
                                };
                                func(res);
                            }
                        }
                        catch (error) {
                            logWriter.log("Company.js findById Company.findById " + error);
                        }
                    }); //End find method
                    //console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq');
                }
                //End Validating input data for login

            }
            catch (Exception) {
                logWriter.log("CompanyB.js  getById" + Exception);
            }
        },

        getForDd: function (data, func) {
            var res = {};
            res['result'] = {};
            res['result']['status'] = '2';
            res['result']['description'] = 'An error was find';
            res['data'] = [];
            var query = (data.isOwnCompany) ? { isOwnCompany: true } : {};
            Company.find(query, { _id: 1, cname: 1 }, function (err, companies) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log("Company.js geForDd Company.find " + err);
                        res['result']['description'] = err;
                        func(res);
                    } else {
                        if (companies) {
                            console.log(companies);
                            res['result']['status'] = '0';
                            res['result']['description'] = 'returned User is success';
                            res['data'] = companies;
                            func(res);
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Company.js geForDd Company.find " + Exception);
                }
            });
        },

        get: function (response) {
            var res = {};
            res['data'] = [];
            var query = company.find({});
            query.sort({ cname: 1 });
            query.exec(function (err, companies) {
                if (err) {
                    console.log(err);
                    logWriter.log("Company.js get Company.find " + err);
                    response.send(500, { error: "Can't find Person" });
                } else {
                    res['data'] = companies;
                    response.send(res);
                }
            });
        },

        remove: function (_id, res) {
            company.remove({ _id: _id }, function (err, companies) {
                if (err) {
                    console.log(err);
                    logWriter.log("Companies.js remove company.remove " + err);
                    res.send(500, { error: "Can't remove Company" });
                } else {
                    res.send(200, { success: 'Company removed' });
                }
            });
        },

        update: function (id, data, res) {
            try {
                delete data._id;
                company.update({ _id: id }, data, function (err, companies) {

                    if (err) {
                        console.log(err);
                        logWriter.log("Company.js update company.update " + err);
                        res.send(500, { error: "Can't update Company" });
                    } else {
                        res.send(200, { success: 'Company updated success' });
                    }
                });
            }
            catch (Exception) {
                console.log(Exception);
                logWriter.log("Companies.js update " + Exception);
                res.send(500, { error: 'Person updated error' });
            }
        },

        getForCompanies: function (func) {
            var res = {};
            res['result'] = {};
            res['result']['status'] = '2';
            res['result']['description'] = 'An error was find';
            res['data'] = [];
            company.find({ isOwnCompany: true }, { __v: 0 }, function (err, companies) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log("Company.js get Company.find " + err);
                        res['result']['description'] = err;
                        func(res);
                    } else {
                        if (companies) {
                            console.log(companies);
                            res['result']['status'] = '0';
                            res['result']['description'] = 'returned User is success';
                            res['data'] = companies;
                            func(res);
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Company.js get Company.find " + Exception);
                }
            });
        },

        getCustomersForDd: function (func) {
            var res = {};
            res['result'] = {};
            res['result']['status'] = '2';
            res['result']['description'] = 'An error was find';
            res['data'] = [];
            company.find({ 'csalesPurchases.isCustomer': true }, { _id: 1, cname: 1 }, function (err, companies) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log("Company.js getCustomersForDd Company.find " + err);
                        res['result']['description'] = err;
                        func(res);
                    } else {
                        if (companies) {
                            //console.log(companies);
                            for (var i in companies) {
                                var obj = {};
                                obj.type = 'Company';
                                obj._id = companies[i]._id;
                                obj.name = companies[i].cname;
                                res['data'].push(obj);
                            }
                            res['result']['status'] = '0';
                            res['result']['description'] = 'returned CompanyCustomers is success';
                            //res['data'] = companies;
                            func(res);
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Company.js getCustomersForDd Company.find " + Exception);
                }
            });
        },

        getAllForCustomers: function (func) {
            var res = {};
            res['result'] = {};
            res['result']['status'] = '2';
            res['result']['description'] = 'An error was find';
            res['data'] = [];
            company.find({}, {
                _id: 1,
                cname: 1,
                cemail: 1,
                caddress: 1,
                cphones: 1
            }, function (err, companies) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log("Company.js getAllCustomers Company.find " + err);
                        res['result']['description'] = err;
                        func(res);
                    } else {
                        if (companies) {
                            for (var i in companies) {
                                var obj = {};
                                obj._id = companies[i]._id;
                                obj.name = companies[i].cname;
                                obj.type = 'Company';
                                obj.email = companies[i].cemail;
                                obj.address = companies[i].caddress;
                                obj.phones = companies[i].cphones;
                                obj.tags = [];
                                res['data'].push(obj);
                                console.log(obj);
                                console.log(res['data']);
                            }
                            res['result']['status'] = '0';
                            res['result']['description'] = 'returned CompanyCustomers is success';
                            //res['data'] = accounts;
                            func(res);
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Company.js getAllCustomers Company.find " + Exception);
                }
            });
        },
        Company: Company
    };
};

module.exports = Company;