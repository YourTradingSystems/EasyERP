define(['libs/date.format'], function (dateformat) {
    var runApplication = function (success, description) {
        if (!Backbone.history.fragment)
            Backbone.history.start({ silent: true });
        if (success) {
            var url = (App.requestedURL == null) ? Backbone.history.fragment : App.requestedURL;
            if ((url == "") || (url == "login")) url = 'home';

            Backbone.history.fragment = "";
            Backbone.history.navigate(url, { trigger: true });
        } else {
            if (App.requestedURL == null)
                App.requestedURL = Backbone.history.fragment;

            Backbone.history.fragment = "";
            Backbone.history.navigate("login", { trigger: true });
        }

    };

    var changeItemIndex = function (event, hash, actionType, contentType) {
        event.preventDefault();
        if (!this.actionType || !this.contentType) {
            this.actionType = actionType;
            this.contentType = contentType;
        }
        var shift = $(event.target).attr('data-shift'),
            itemIndex = getCurrentII(),
            viewType = getCurrentVT();

        switch (shift) {
            case "left":
                {
                    setCurrentII(parseInt(itemIndex) - 1);
                    break;
                }
            case "right":
                {
                    setCurrentII(parseInt(itemIndex) + 1);
                    break;
                }
        }

        itemIndex = getCurrentII();

        if (this.actionType == 'Content') {
            if (!hash) {
                window.location.hash = "#home/content-" + this.contentType + "/" + viewType + "/" + itemIndex;
            } else {
                window.location.hash = "#home/content-" + this.contentType + "/" + viewType + "/" + hash + "/" + itemIndex;
            }
        } else if (this.actionType == 'Edit') {
            window.location.hash = "#home/action-" + this.contentType + "/" + this.actionType + "/" + itemIndex;
        }
    };

    var changeContentViewType = function (event, hash, contentType) {

        event.preventDefault();
        var itemIndex = getCurrentII();
        if (contentType) {
            this.contentType = contentType;
        }
        var viewtype = $(event.target).attr('data-view-type'),
    		url = "#home/content-" + this.contentType + "/" + viewtype;

        if (hash) {
            url += "/" + hash;
        }

        if (viewtype == "form") {
            url += "/" + itemIndex;
        }

        App.ownContentType = true;

        Backbone.history.navigate(url, { trigger: true });
    };

    var getCurrentII = function () {
        if (App.currentItemIndex == null) {
            App.currentItemIndex = 1;
            return App.currentItemIndex;
        }

        var testIndex = new RegExp(/^[1-9]{1}[0-9]*$/), itemIndex;
        if (testIndex.test(App.currentItemIndex) == false) {
            App.currentItemIndex = 1;
            itemIndex = 1;
        } else {
            itemIndex = App.currentItemIndex;
        }
        return itemIndex;
    };

    var setCurrentII = function (index) {
        var testIndex = new RegExp(/^[1-9]{1}[0-9]*$/),
    		contentLength = getCurrentCL();

        if (testIndex.test(index) == false)
            index = 1;
        if (index > contentLength) index = contentLength;
        App.currentItemIndex = index;

        return index;
    };

    var getCurrentVT = function (option) {
        var viewType;
        if (option && (option.contentType != App.contentType)) {
            App.ownContentType = false;
        }
        if (App.currentViewType == null) {
            if (option) {
                switch (option.contentType) {
                    case 'Tasks':
                        App.currentViewType = "kanban";
                        break;
                    case 'Applications':
                        App.currentViewType = "kanban";
                        break;
                    case 'Profiles':
                        App.currentViewType = "list";
                        break;
                    case 'Departments':
                        App.currentViewType = "list";
                        break;
                    case 'Users':
                        App.currentViewType = "list";
                        break;
                    case 'JobPositions':
                        App.currentViewType = "list";
                        break;
                    case 'Degrees':
                        App.currentViewType = "list";
                        break;
                    case 'SourceOfApplicants':
                        App.currentViewType = "list";
                        break;
                    case 'Leads':
                        App.currentViewType = "list";
                        break;
                    case 'Opportunities':
                        App.currentViewType = "kanban";
                        break;
                    default:
                        App.currentViewType = "thumbnails";
                        break;
                }
            } else {
                App.currentViewType = "thumbnails";
            }

            return App.currentViewType;
        } else {
            if (option && !App.ownContentType) {
                switch (option.contentType) {
                    case 'Tasks':
                        App.currentViewType = "kanban";
                        break;
                    case 'Applications':
                        App.currentViewType = "kanban";
                        break;
                    case 'Profiles':
                        App.currentViewType = "list";
                        break;
                    case 'Departments':
                        App.currentViewType = "list";
                        break;
                    case 'Users':
                        App.currentViewType = "list";
                        break;
                    case 'JobPositions':
                        App.currentViewType = "list";
                        break;
                    case 'Degrees':
                        App.currentViewType = "list";
                        break;
                    case 'SourceOfApplicants':
                        App.currentViewType = "list";
                        break;
                    case 'Leads':
                        App.currentViewType = "list";
                        break;
                    case 'Opportunities':
                        App.currentViewType = "kanban";
                        break;
                    default:
                        App.currentViewType = "thumbnails";
                        break;
                }
            }
        }

        var viewVariants = ["kanban", "list", "form", "thumbnails", "gantt"];

        if ($.inArray(App.currentViewType, viewVariants) == -1) {
            App.currentViewType = "thumbnails";
            viewType = "thumbnails";
        } else {
            viewType = App.currentViewType;
        }

        return viewType;
    };

    var setCurrentVT = function (viewType) {
        var viewVariants = ["kanban", "list", "form", "thumbnails", "gantt"];

        if ($.inArray(viewType, viewVariants) != -1) {
            App.currentViewType = viewType;
        } else {
            viewType = "thumbnails";
            App.currentViewType = viewType;
        }

        return viewType;
    };

    var getCurrentCL = function () {
        if (App.currentContentLength == null) {
            App.currentContentLength = 0;
            return App.currentContentLength;
        }

        var testLength = new RegExp(/^[0-9]{1}[0-9]*$/), contentLength;
        if (testLength.test(App.currentContentLength) == false) {
            App.currentContentLength = 0;
            contentLength = 0;
        } else {
            contentLength = App.currentContentLength;
        }
        return contentLength;
    };

    var setCurrentCL = function (length) {
        var testLength = new RegExp(/^[0-9]{1}[0-9]*$/);

        if (testLength.test(length) == false)
            length = 0;
        App.currentContentLength = length;

        return length;
    };
    var calculateHours = function (startDate, endDate) {
        var hours = 0;
        if (!startDate || !endDate) {
            throw new Error("CalculateTaskHours: Start or end date is undefined");
        }
        if (startDate > endDate) {
            throw new Error("CalculateTaskHours: Start date can not be greater that end date");
        }
        try {
            var delta = new Date(endDate) - new Date(startDate);
            hours = Math.floor(((delta / 1000) / 60) / 60);
        } catch (error) {
            throw new Error(error.message);
        }
        return hours;
    };

    var getProjectsCollectionMinDate = function (jsonProjectsArray) {
        var minDate;
        var dateArray = $.map(jsonProjectsArray, function (val) {
            return val.StartDate;
        });
        minDate = findMinDate(dateArray);
    }

    var convertProjectsCollectionForGantt = function (collection) {
        var anyProjectHasTasks = false;
        var duration = 0;
        var jsonCollection;
        collection.length > 0 ? jsonCollection = collection.toJSON() : jsonCollection = [];
        for (i = 0; i < jsonCollection.length; i++) {
            if (jsonCollection[i].task.tasks.length > 0) {
                anyProjectHasTasks = true;
                duration += parseInt(jsonCollection[i].estimated);
            }
        }
        //if we have no projects with tasks then exit
        if (!anyProjectHasTasks)
            return {
                data: []
            };

        //else add parent holder for projects "Gantt View"
        var projects = [];
        var minDate;
        (jsonCollection && jsonCollection.length > 0 && jsonCollection[0].info.StartDate) ?
            minDate = dateFormat(new Date(jsonCollection[0].info.StartDate), "dd-mm-yyyy") :
            minDate = dateFormat(new Date(), "dd/mm-yyyy");

        projects.push({
            'id': 1,
            'text': "Gantt View",
            'start_date': minDate,
            'duration': duration,
            'progress': 0,
            'open': true
        });

        if (jsonCollection.length > 0) {
            jsonCollection.forEach(function (project) {
                if (project.task.tasks.length > 0) {
                    projects.push({
                        'id': project._id || project.id,
                        'text': project.projectname,
                        'start_date': dateFormat(new Date(jsonCollection[0].info.StartDate), "dd-mm-yyyy"),
                        'duration': project.estimated,
                        'progress': project.progress / 100,
                        'open': true,
                        'parent': 1
                    });
                }
            });
        }

        return {
            data: projects
        };
    };

    var convertTasksCollectionForGantt = function (collection) {
        var jsonCollection;
        collection.length > 0 ? jsonCollection = collection.toJSON() : jsonCollection = [];
        var projects = [];

        for (var i = 0; i < jsonCollection.length; i++) {
            if (jsonCollection[i].task.tasks.length > 0) {
                projects.push({
                    'id': jsonCollection[i]._id || jsonCollection[i].id,
                    'text': jsonCollection[i].projectname,
                    'start_date': new Date(jsonCollection[i].info.StartDate),
                    'duration': jsonCollection[i].info.duration,
                    'progress': jsonCollection[i].progress / 100,
                    'open': true
                });

                for (j = 0, len = jsonCollection[i].task.tasks.length; j < len; j++) {
                    var task = jsonCollection[i].task.tasks[j];
                    projects.push({
                        'id': task.id || task._id,
                        'text': task.summary,
                        'start_date': new Date(task.extrainfo.StartDate),
                        'duration': task.estimated,
                        'progress': task.progress / 100,
                        'assignedto': task.assignedto.uname,
                        'parent': jsonCollection[i].id || jsonCollection[i]._id
                    });
                }
            }
        }

        return {
            data: projects
        };
    };

    function applyDefaultSettings(chartControl) {
        chartControl.setImagePath("/crm_backbone_repo/images/");
        chartControl.setEditable(false);
        chartControl.showTreePanel(true);
        chartControl.showContextMenu(false);
        chartControl.showDescTask(true, 'd,s-f');
        chartControl.showDescProject(true, 'n,d');
    }



    function findMinDate(dateArray) {
        return _.min(dateArray);
    }

    return {
        convertTasksCollectionForGantt: convertTasksCollectionForGantt,
        convertProjectsCollectionForGantt: convertProjectsCollectionForGantt,

        calculateHours: calculateHours,


        runApplication: runApplication,
        changeItemIndex: changeItemIndex,
        changeContentViewType: changeContentViewType,
        getCurrentII: getCurrentII,
        setCurrentII: setCurrentII,
        getCurrentVT: getCurrentVT,
        setCurrentVT: setCurrentVT,
        getCurrentCL: getCurrentCL,
        setCurrentCL: setCurrentCL
    };
});