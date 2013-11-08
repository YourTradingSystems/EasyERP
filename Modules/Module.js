var Module = function (logWriter, mongoose, users, profile) {
    var moduleSchema = mongoose.Schema({
        _id: Number,
        mname: String,
        href: { type: String, default: '' },
        ancestors: [Number],
        users: {},
        parrent: Number,
        link: Boolean,
        visible: Boolean
    }, { collection: 'modules' });

    var _module = mongoose.model('modules', moduleSchema);

    return {
        create: function (data, func) {
            var testmmodule = new _module();
            testmmodule._id = data._id;
            testmmodule.mname = data.mname;
            testmmodule.ancestors = data.ancestors;
            testmmodule.users = data.users;
            testmmodule.parrent = data.parrent;
            testmmodule.link = data.link;
            testmmodule.save(function (err, res) {
                if (err) {
                    console.log(err);
                    logWriter.log(err);
                } else {
                    console.log('Save is success');
                    func(res);
                }
            });
        },//End create

        get: function (uId, response) {
            var res = [];
            var query = _module.find({ $and: [{ 'users.user': uId }, {visible: true}]});
            query.sort({ sequence: 1 });
            //query.select({
            //    _id: 1,
            //    mname: 1,
            //    parrent: 1,
            //    link: 1,
            //    href: 1,
            //    sequence: 1
            //});
            query.exec(function (err, moduless) {
                try {
                    if (err) {
                        console.log(err);
                        logWriter.log(err);
                        response.send(500, { error: "Can't find Modules" });
                    } else {
                        if (moduless) {
                            res = moduless;
                            response.send(res);
                            console.log('Sending Modules...');
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Module.js get _testmodule.find " + Exception);
                }
            });
            /*console.log(".......................GetModules.........................");
            console.log(data);
            console.log("-----------------------------------------------------");*/
        },

        getNewModules: function (data, func) {
            var res = {};
            res['result'] = {};
            res['result']['status'] = '2';
            res['result']['description'] = 'Get modules is success';
            res['data'] = [];

            var query = profile.profile.find({
                $or: [
                    { 'profileAccess.access': [true, true, true] },
                    { 'profileAccess.access': [true, false, true] },
                    { 'profileAccess.access': [true, false, false] }
                ]
            });
            //query.sort({ sequence: 1 });
            //query.select({
            //    _id: 1, mname: 1, parrent: 1, link: 1
            //});
            query.exec(function (err, moduless) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log(err);
                        res['result']['description'] = err;
                        func(res);
                    } else {
                        if (moduless) {
                            //console.log(moduless);
                            res['data'] = moduless;
                            res['result']['status'] = '0';
                            func(res);
                        }
                    }
                }
                catch (Exception) {
                    logWriter.log("Module.js get _testmodule.find " + Exception);
                }
            });
            /*console.log(".......................GetModules.........................");
            console.log(data);
            console.log("-----------------------------------------------------");*/
        },

        update: function (func) {
            _module.find({}, function (err, modules) {
                if (!err) {
                    console.log(modules);
                    upMod(0, modules);
                } else {
                    console.log(err);
                    logWriter.log(err);
                }
            });

            function toHref(str) {
                str.trim();
                var arr = str.split(' ');
                var s = '';
                for (var i in arr) {
                    s += arr[i];
                }
                return s.toLowerCase();
            }

            var upMod = function (count, modules) {
                if (!(count === (modules.length - 1))) {
                    var value = toHref(modules[count].mname);
                    _module.update({ _id: modules[count]._id }, { $set: { href: value } }, function (err, res) {
                        if (!err) {
                            console.log(res);
                            count++;
                            upMod(count, modules);
                        } else {
                            console.log(err);
                            logWriter.log(err);
                            func(false);
                        }
                    });
                } else {
                    func(true);
                }

            }

        },

        access: function (_access, data, func) {
            _module.findOne({ _id: data.mid })
            .where('users.user').equals(data.uid)
            .where('users.permissions').equals(_access)
            .select('users.user users.permissions')
            .exec(function (err, moduless) {
                try {
                    if (err) {
                        //func();
                        console.log(err);
                        logWriter.log(err);
                        func(false);
                    } else {
                        if (moduless) {
                            /*console.log('user in module');
                            console.log(moduless);*/
                            for (var i in moduless.users) {
                                /*console.log(i);
                                console.log(data.uid);
                                console.log(moduless.users[i]);*/
                                if (moduless.users[i].user == data.uid) {
                                    /* console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                     console.log(moduless.users[i].permissions);*/
                                    if (moduless.users[i].permissions.indexOf(_access) != -1) {
                                        /* console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                         console.log(moduless);*/
                                        func(true);
                                    } else { func(false); }
                                }
                            }
                        }
                        else { func(false); }
                    }
                }
                catch (Exception) {
                    logWriter.log("Module.js access findOne " + Exception);
                }
            });
        }
    };
}

module.exports = Module;