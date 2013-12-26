define([
    "dataService"
],
    function (dataService) {
        var toObject = function (_id, collection) {
            var _tempObject = null;
            if (_id && collection) {
                _tempObject = (collection.get(_id)) ? collection.get(_id).toJSON() : null;
            }
            return _tempObject;
        };

        var utcDateToLocaleDate = function (utcDateString) {
            utcDateString = (utcDateString) ? dateFormat(utcDateString, "d mmm, yyyy", false) : null;
            return utcDateString;

        }

        var utcDateToLocaleFullDateTime = function (utcDateString) {
            utcDateString = (utcDateString) ? dateFormat(utcDateString, "dddd, d mm yyyy HH:MM:s TT", false) : null;
            return utcDateString;
        }

        var utcDateToLocaleDateTime = function (utcDateString) {
            if (!utcDateString) return null;
            utcDateString = (utcDateString) ? dateFormat(utcDateString, "d/m/yyyy HH:MM", false) : null;
            return utcDateString;
        }

        var ISODateToDate = function (ISODate) {
            var date = ISODate.split('T')[0];
            return date;
        };

        var hexToRgb = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        var deleteEvent = function (e, that) {
            e.preventDefault();
            var answer = confirm("Realy DELETE item ?!");
            if (answer == true) {
                that.trigger('deleteEvent');
            }
        };

        var canvasDrawing = function (options, context) {
            var canvas = (options.canvas) ? options.canvas : context.$('#avatar')[0];
            var model = (options.model) ? options.model : {
                model: {
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
                }
            };
            var img = new Image();
            img.onload = function () {
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 120, 120);
            }
            img.src = model.imageSrc;
            context.imageSrc = model.imageSrc;
        };

        var canvasDraw = function (options, _context) {
            var model = (options && options.model) ? options.model : null;
            var context = (_context) ? _context : this;
            var canvas = context.$('#avatar')[0];
            var inputFile = context.$('#inputImg');
            inputFile.prop('accept', "image/*");
            var that = context;
            inputFile.on('change', function () {
                var file = inputFile[0].files[0];
                var fr = new FileReader();
                fr.onload = function () {
                    var src = "data:image/jpg;base64," + btoa(fr.result);
                    if (model) {
                        model.imageSrc = src;
                    } else {
                        model = {
                            imageSrc: src
                        }
                    }
                    canvasDrawing({ model: model, canvas: canvas }, context);
                };
                fr.readAsBinaryString(file);
            });
            canvasDrawing({ model: model }, context);
        };

        var displayControlBtnsByActionType = function (actionType, viewType) {
            $("#saveDiscardHolder").hide();
            $("#top-bar-createBtn").hide();
            $("#top-bar-deleteBtn").hide();
            $("#top-bar-editBtn").hide();
            $("#top-bar-renameBtn").hide();
            $("#top-bar-nextBtn").hide();
            $("#top-bar-discardBtn").hide();
            $('#top-bar-saveBtn').hide();
            $('#formBtn').closest('li').hide();
            $("ul.changeContentIndex").hide();
            if (!actionType || actionType === "Content") {
                $("#top-bar-createBtn").show();
                if (viewType == "form") {
                    $('#formBtn').closest('li').show();
                    $("#top-bar-createBtn").hide();
                    $('#top-bar-editBtn').show();
                    $("ul.changeContentIndex").hide();
                    $('#top-bar-deleteBtn').show();
                }
                if (viewType == "thumbnails" || viewType == "list") {
                    $('#top-bar-editBtn').hide();
                }
            } else if (actionType === "View") {
                $('#top-bar-createBtn').show();
                $('#top-bar-editBtn').show();
                $('#top-bar-deleteBtn').show();
            } else if (actionType === "Edit") {
                // $('#top-bar-saveBtn').show();
                // $('#top-bar-discardBtn').show();
                //$("#saveDiscardHolder").show();
                $("#saveDiscardHolder").hide();
                $("#top-bar-createBtn").show();
            } else if (actionType === "Create") {
                $('#top-bar-saveBtn').show();
                $('#top-bar-nextBtn').show();
                $('#top-bar-discardBtn').show();
                $('#top-bar-saveBtn').show();
                $("#saveDiscardHolder").show();
            }
        };

        var getFromLocalStorage = function (key) {
            if (window.localStorage) {
                return window.localStorage.getItem(key);
            } else {
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        };
        var deleteFromLocalStorage = function (key) {
            if (window.localStorage)
                window.localStorage.removeItem(key);
        };
        var saveToLocalStorage = function (key, value) {
            if (window.localStorage) {
                window.localStorage.setItem(key, value);
            } else {
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        };

        var populateProjectsDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.project) {
                    options = $.map(response.data, function (item) {
                        return (model.project._id == item._id) ?
                            $('<option/>').val(item._id).text(item.projectName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.projectName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.projectName);
                    });
                }
                selectList.append(options);
                if (callback) callback();

            });
        };

        var populateProfilesDd = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.profile) {
                    options = $.map(response.data, function (item) {
                        return (model.profile._id == item._id) ?
                            $('<option/>').val(item._id).text(item.profileName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.profileName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.profileName);
                    });
                }
                selectList.append(options);

            });
        };

        var populateEmployeesDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            //selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && (model.manager || model.projectmanager || (model.salesPurchases && model.salesPurchases.salesPerson) || model.salesPerson || model.departmentManager)) {
                    options = $.map(response.data, function (item) {
                        return ((model.manager && model.manager._id === item._id) ||
                                (model.projectmanager && model.projectmanager._id === item._id) ||
                                (model.salesPurchases && model.salesPurchases.salesPerson && model.salesPurchases.salesPerson._id === item._id) ||
                                (model.salesPerson && model.salesPerson._id === item._id) ||
                                //(model.salesTeam._id === item._id) ||
                                (model.departmentManager && model.departmentManager._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        }

        var populateCoachDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.coach) {
                    options = $.map(response.data, function (item) {
                        return (model.coach && model.coach._id === item._id) ?
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populateCompanies = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.company) {
                    options = $.map(response.data, function (item) {
                        return model.company._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return model._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };


        var populateTitle = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.company) {
                    options = $.map(response.data, function (item) {
                        return model.company._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };
        
        var populateRelatedStatuses = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
            	var options = [];
                if (model && model.status) {
                    options = $.map(response.data, function (item) {
                        return model.status._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.status);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populateDepartments = function (selectId, url, model, callback,removeSelect) {
            var selectList = $(selectId);
            var self = this;
			if (!removeSelect)
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && (model.department || (model.salesPurchases && model.salesPurchases.salesTeam) || model.salesTeam || model.parentDepartment)) {
                    options = $.map(response.data, function (item) {
                        return ((model.department && model.department._id === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam._id === item._id) || (model.salesTeam === item._id) || (model.parentDepartment && model.parentDepartment._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected').attr('data-level', item.nestingLevel) :
                            $('<option/>').val(item._id).text(item.departmentName).attr('data-level', item.nestingLevel);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.departmentName).attr('data-level', item.nestingLevel);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };
        
        var populateDepartmentsList = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && (model.department || (model.salesPurchases && model.salesPurchases.salesTeam) || model.salesTeam || model.parentDepartment)) {
                    options = $.map(response.data, function (item) {
                        return ((model.department && model.department._id === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam._id === item._id) || (model.salesTeam === item._id) || (model.parentDepartment && model.parentDepartment._id === item._id)) ?
                            $('<li/>').attr("id",item._id).text(item.departmentName).attr('selected', 'selected') :
                            $('<li/>').attr("id",item._id).text(item.departmentName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<li/>').attr("id",item._id).text(item.departmentName);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populateParentDepartments = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.parentDepartment && (model.department || (model.salesPurchases && model.salesPurchases.salesTeam) || model.salesTeam || model.parentDepartment)) {
                    options = $.map(response.data, function (item) {
                        return ((model.department && model.department._id === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam._id === item._id) || (model.salesTeam === item._id) || (model.parentDepartment && model.parentDepartment._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.departmentName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
						if (!item.parentDepartment){
                        return $('<option/>').val(item._id).text(item.departmentName);}
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populatePriority = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
   
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && ((model.extrainfo && model.extrainfo.priority) || model.priority)) {
                    options = $.map(response.data, function (item) {
                        return ((model.extrainfo && model.extrainfo.priority) || model.priority) === item.priority ?
                            $('<option/>').val(item.priority).text(item.priority).attr('selected', 'selected') :
                            $('<option/>').val(item.priority).text(item.priority);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return(item.priority == "P3") ? 
                        		$('<option/>').val(item.priority).text(item.priority).attr('selected', 'selected') :
                        		$('<option/>').val(item.priority).text(item.priority);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populateCustomers = function (selectId, url, model,callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model) {
                    options = $.map(response.data, function (item) {
                        return ((model.customer && (model.customer._id === item._id)) || (model._id === item._id) ) ?
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        };

        var populateDegrees = function (selectId, url, model,callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.degree) {
                    options = $.map(response.data, function (item) {
                        return (model.customer._id === item._id) ?
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                }
                selectList.append(options);
            });
            if (callback) callback();
        };

        var populateWorkflows = function (workflowType, selectId, workflowNamesDd, url, model, callback) {
            var selectList = $(selectId);
            var workflowNamesDd = $(workflowNamesDd);
            var self = this;
            dataService.getData(url, { mid: 39, id: workflowType }, function (response) {
                var options = [];
                if (model && model.workflow) {
                    if (model.workflow._id == undefined) {
                        options = $.map(response.data, function (item) {
                            return model.workflow == item._id ?
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });
                    } else {
                        options = $.map(response.data, function (item) {
                            return model.workflow._id === item._id ?
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });

                    }
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                    });
                }
                var wNames = $.map(response.data, function (item) {
                    return item.wName;
                });
                wNames = _.uniq(wNames);
                var wfNamesOption = $.map(wNames, function (item) {
                    return $('<option/>').text(item);
                });
                workflowNamesDd.append(wfNamesOption);
                selectList.append(options);
                if (callback) callback(selectId);
            });
        }
        var populateUsers = function (selectId, url, model, callback,removeSelect) {
            var selectList = $(selectId);
            var self = this;
			if (!removeSelect)
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.relatedUser) {
                    options = $.map(response.data, function (item) {
                        return model.relatedUser._id === item._id ?
                            $('<option/>').val(item._id).text(item.login).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.login);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.login);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        }
        var populateUsersForGroups = function (selectId, model, callback) {
            var selectList = $(selectId);
            var self = this;
            dataService.getData('/Users', { mid: 39 }, function (response) {
                var options = [];
                if (model) {
					var ids=$.map(model.users,function(item){
						return item._id
					});
					console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<");
					console.log(ids);
					var tt=_.filter(response.data, function(filteredItem) {
						return (ids.indexOf(filteredItem._id)!=-1);
					});
					console.log(tt);
					options = $.map(
						_.filter(response.data, function(filteredItem) {
							return (ids.indexOf(filteredItem._id)==-1);
						}),
						function (item) {
							return $('<li/>').attr('id', item._id).text(item.login);
						});
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<li/>').text(item.login).attr('id', item._id);
                    });
                }
                selectList.append(options);
                if (callback) callback();
            });
        }
        var populateJobPositions = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.jobPosition) {
                    options = $.map(response.data, function (item) {
                        return model.jobPosition._id === item._id ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
            });
        }
        var populateSourceApplicants = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.source) {
                    options = $.map(response.data, function (item) {
                        return model.source._id === item._id ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
            });
        }
        var buildAphabeticArray = function (collection) {
            if (collection && collection.length > 0) {
                var filtered = $.map(collection, function (item) {
                    if (item.name.last[0]) {
                        if ($.isNumeric(item.name.last[0].toUpperCase())) {
                            return "0-9"
                        }
                        return item.name.last[0].toUpperCase();
                    }
                });
                filtered.push("All");
                return _.sortBy(_.uniq(filtered), function (a) { return a });
            }
            return [];
        }
        var buildAllAphabeticArray = function () {
            var associateArray = ["All", "0-9"]
            for (i = 65; i <= 90; i++) {
                associateArray.push(String.fromCharCode(i).toUpperCase());
            }
            return associateArray;
        }

        return {
            deleteFromLocalStorage: deleteFromLocalStorage,
            populateProfilesDd: populateProfilesDd,
            buildAllAphabeticArray: buildAllAphabeticArray,
            buildAphabeticArray: buildAphabeticArray,
            populateDegrees: populateDegrees,
            populateSourceApplicants: populateSourceApplicants,
            populateJobPositions: populateJobPositions,
            populateUsers: populateUsers,
            utcDateToLocaleFullDateTime: utcDateToLocaleFullDateTime,
            utcDateToLocaleDateTime: utcDateToLocaleDateTime,
            utcDateToLocaleDate: utcDateToLocaleDate,
            populateProjectsDd: populateProjectsDd,
            populatePriority: populatePriority,
            populateDepartments: populateDepartments,
            populateCompanies: populateCompanies,
            populateWorkflows: populateWorkflows,
            populateCustomers: populateCustomers,
            populateEmployeesDd: populateEmployeesDd,
            populateCoachDd: populateCoachDd,
            utcDateToLocaleDate: utcDateToLocaleDate,
            populateRelatedStatuses:populateRelatedStatuses,
            toObject: toObject,
            displayControlBtnsByActionType: displayControlBtnsByActionType,
            ISODateToDate: ISODateToDate,
            hexToRgb: hexToRgb,
            deleteEvent: deleteEvent,
            canvasDraw: canvasDraw,
            saveToLocalStorage: saveToLocalStorage,
            getFromLocalStorage: getFromLocalStorage,
            populateUsersForGroups: populateUsersForGroups,
			populateParentDepartments:populateParentDepartments,
			populateDepartmentsList:populateDepartmentsList
        }
    });
