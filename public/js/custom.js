define(['libs/date.format', 'common'], function (dateformat, common) {

    var runApplication = function (success) {
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

    var changeContentViewType = function (event, contentType, collection) {

        event.preventDefault();
        if (contentType) {
            this.contentType = contentType;
        }
        var windowLocHash = window.location.hash.split('/')[3];
        var id;
        if (typeof windowLocHash != "undefined" && windowLocHash.length == 24) {
            id = windowLocHash;
        }
        var viewtype = $(event.target).attr('data-view-type'),
            url = "#easyErp/" + this.contentType + "/" + viewtype;

        if (id) {
            if (viewtype != "list" && (viewtype != "thumbnails")) {
                url += "/" + id;
            }
            if (collection) collection.setElement(id);
        } else {

            if (viewtype == "form" && collection) {
                var model = collection.getElement();
                url += "/" + model.attributes._id;
            }
        }

        App.ownContentType = true;

        Backbone.history.navigate(url, { trigger: true });
    };

    var getCurrentVT = function (option) {
        var viewType;
        if (option && (option.contentType != App.contentType)) {
            App.ownContentType = false;
        }
        if (App.currentViewType == null) {
            if (option) {
                switch (option.contentType) {
                    case 'Dashboard':
                        App.currentViewType = 'list';
                    case 'Tasks':
                        App.currentViewType = "list";
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
                    case 'Birthdays':
                        App.currentViewType = "list";
                        break;
                    case 'LeadsWorkflow':
                        App.currentViewType = "list";
                        break;
                    case 'myProfile':
                        App.currentViewType = "list";
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
                        App.currentViewType = "list";
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
                    case 'Birthdays':
                        App.currentViewType = "list";
                        break;
                    case 'LeadsWorkflow':
                        App.currentViewType = "list";
                        break;
                    default:
                        App.currentViewType = "thumbnails";
                        break;
                }
            }
        }

        var viewVariants = ["kanban", "list", "form", "thumbnails"];
        if ($.inArray(App.currentViewType, viewVariants) == -1) {
            App.currentViewType = "thumbnails";
            viewType = "thumbnails";
        } else {
            viewType = App.currentViewType;
        }
        return viewType;
    };

    var setCurrentVT = function (viewType) {
        var viewVariants = ["kanban", "list", "form", "thumbnails"];

        if (viewVariants.indexOf(viewType) != -1) {
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


    function applyDefaultSettings(chartControl) {
        chartControl.setImagePath("/crm_backbone_repo/images/");
        chartControl.setEditable(false);
        chartControl.showTreePanel(false);
        chartControl.showContextMenu(false);
        chartControl.showDescTask(true, 'd,s-f');
        chartControl.showDescProject(true, 'n,d');
    }

    return {
        runApplication: runApplication,
        changeContentViewType: changeContentViewType,
        //getCurrentII: getCurrentII,
        //setCurrentII: setCurrentII,
        getCurrentVT: getCurrentVT,
        setCurrentVT: setCurrentVT,
        getCurrentCL: getCurrentCL,
        setCurrentCL: setCurrentCL
    };
});
