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

        var displayControlBtnsByActionType = function(actionType, viewType){
        $("#saveDiscardHolder").hide();
        $("#top-bar-createBtn").hide();
        $("#top-bar-deleteBtn").hide();
        $("#top-bar-editBtn").hide();
        $("#top-bar-renameBtn").hide();
        $("#top-bar-nextBtn").hide();
        $("#top-bar-discardBtn").hide();
        $('#top-bar-saveBtn').hide();
        $("ul.changeContentIndex").hide();
        if(!actionType || actionType === "Content"){
            $("#top-bar-createBtn").show();
            if(viewType == "form"){
                //$("#top-bar-createBtn").hide();
                $('#top-bar-editBtn').show();
                $("ul.changeContentIndex").show();
                $('#top-bar-deleteBtn').show();
            }
            if(viewType == "thumbnails" || viewType == "list"){
                $('#top-bar-editBtn').hide();
            }        }
        else if(actionType === "View"){
            $('#top-bar-createBtn').show();
            $('#top-bar-editBtn').show();
            $('#top-bar-deleteBtn').show();
        }
        else if(actionType === "Edit"){
           // $('#top-bar-saveBtn').show();
           // $('#top-bar-discardBtn').show();
            //$("#saveDiscardHolder").show();
            $("#saveDiscardHolder").hide();
            $("#top-bar-createBtn").show();
        }
        else if(actionType === "Create"){
            $('#top-bar-saveBtn').show();
            $('#top-bar-nextBtn').show();
            $('#top-bar-discardBtn').show();
            $('#top-bar-saveBtn').show();
            $("#saveDiscardHolder").show();
        }
    }

        var getFromLocalStorage = function(key){
            if(window.localStorage){
                return window.localStorage.getItem(key);
            } else{
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        }

        var saveToLocalStorage = function(key, value){
            if(window.localStorage){
                window.localStorage.setItem(key,value);
            } else{
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        }

        var populateProjectsDd = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if(model && model.project){
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

            });
        }

        var populateEmployeesDd = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if(model && (model.projectmanager || model.salesPerson)){
                    options = $.map(response.data, function (item) {
                        return ((model.projectmanager && model.projectmanager._id === item._id) || (model.salesPerson && model.salesPerson._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                        });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                }
                selectList.append(options);

            });
        }
        var populateCompanies = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if(model&&model.company){
                    options = $.map(response.data, function (item) {
                        return model.company._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                        });
                } else{
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first);
                    });
                }
                selectList.append(options);

            });
        }
        var populateDepartments = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if(model && (model.department || model.salesTeam)){
                    options = $.map(response.data, function (item) {
                        return ((model.department && model.department._id === item._id) || (model.salesTeam && model.salesTeam._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.departmentName);
                        });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.departmentName);
                    });
                }
                selectList.append(options);

            });
        };
        var populatePriority = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.priority) {
                    options = $.map(response.data, function (item) {
                        return model.priority._id === item._id ?
                            $('<option/>').val(item._id).text(item.priority).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.priority);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.priority);
                    });
                }
                selectList.append(options);

            });
        }
        var populateCustomers = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39 }, function (response) {
                var options = [];
                if (model && model.customer) {
                    options = $.map(response.data, function (item) {
                        return (model.customer && (model.customer._id === item._id)) ?
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
        }
        var populateWorkflows = function (workflowType, selectId, workflowNamesDd, url, model) {
            var selectList = $(selectId);
            var workflowNamesDd = $(workflowNamesDd);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, { mid: 39, id: workflowType }, function (response) {
                var options = [];
                if (model && model.workflow) {
                    options = $.map(response.data, function (item) {
                        return model.workflow._id === item._id ?
                            $('<option/>').val(item.status).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
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
            });
        }

        return {
            populateProjectsDd:populateProjectsDd,
            populatePriority: populatePriority,
            populateDepartments: populateDepartments,
            populateCompanies: populateCompanies,
            populateWorkflows: populateWorkflows,
            populateCustomers: populateCustomers,
            populateEmployeesDd: populateEmployeesDd,
            utcDateToLocaleDate: utcDateToLocaleDate,
            toObject: toObject,
            displayControlBtnsByActionType: displayControlBtnsByActionType,
            ISODateToDate: ISODateToDate,
            hexToRgb: hexToRgb,
            deleteEvent: deleteEvent,
            canvasDraw: canvasDraw,
            saveToLocalStorage: saveToLocalStorage,
            getFromLocalStorage: getFromLocalStorage
        }
    });
