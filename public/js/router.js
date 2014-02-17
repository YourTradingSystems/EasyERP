// Filename: router.js
define([
  'views/main/MainView',
  'views/login/LoginView',
  'custom',
  'common'
], function (mainView, loginView, custom, common) {

    var appRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView: null,
        topBarView: null,
        view: null,

        routes: {
            "home": "main",
            "login": "login",
            "easyErp/:contentType/kanban(/:parrentContentId)": "goToKanban",
            "easyErp/:contentType/thumbnails": "goToThumbnails",
            "easyErp/:contentType/form/:modelId": "goToForm",
            "easyErp/:contentType/list(/:parrentContentId)": "goToList",
            "easyErp/Profiles": "goToProfiles",
            "easyErp/myProfile": "goToUserPages",
            "easyErp/Workflows": "goToWorkflows",
            "easyErp/Dashboard": "goToDashboard",
            "easyErp/projectDashboard": "goToProjectDashboard",
            "easyErp/:contentType": "getList",
            "*eny": "main"
        },

        initialize: function () {
            this.on('all', function () {
                $(".ui-dialog").remove();
            });
  			$(document).on("keydown",".ui-dialog",function (e) {
                switch (e.which) {
                    case 27:
					    $(".edit-dialog").remove();
                        break;
					case 13:
					    $(".ui-dialog-buttonset .ui-button").eq(0).trigger("click");
					    break;
                    default:
                        break;
                }
            });
        },

        goToProfiles: function () {
            var startTime = new Date();
            if (this.mainView == null) this.main("Profiles");

            var contentViewUrl = 'views/Profiles/ContentView';
            var topBarViewUrl = 'views/Profiles/TopBarView';
            var collectionUrl = 'collections/Profiles/ProfilesCollection';

            var self = this;

            require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                var collection = new contentCollection();

                collection.bind('reset', _.bind(createViews, self));
                custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentview = new contentView({ collection: collection, startTime: startTime });
                    var topbarView = new topBarView({ actionType: "Content" });

                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editProfileDetails, contentview);
                    topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                    topbarView.bind('saveEvent', contentview.saveProfile, contentview);

                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);
                    var url = '#easyErp/Profiles';
                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToUserPages: function () {

            var startTime = new Date();
            var contentViewUrl = "views/myProfile/ContentView";
            var topBarViewUrl = "views/myProfile/TopBarView";
            var self = this;

            if (this.mainView == null) this.main("Persons");

            require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                custom.setCurrentVT('list');

                var contentview = new contentView({ startTime: startTime });
                var topbarView = new topBarView({ actionType: "Content" });

                self.changeView(contentview);
                self.changeTopBarView(topbarView);
                var url = '#easyErp/myProfile';
                Backbone.history.navigate(url, { replace: true });
            });
        },

        goToDashboard: function () {
            var startTime = new Date();
            var contentViewUrl = "views/Dashboard/ContentView";
            var topBarViewUrl = "views/Dashboard/TopBarView";
            var self = this;

            if (this.mainView == null) this.main("Dashboard");

            require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                custom.setCurrentVT('list');

                var contentview = new contentView({ startTime: startTime });
                var topbarView = new topBarView({ actionType: "Content" });
                self.changeView(contentview);
                self.changeTopBarView(topbarView);
            });
        },
        goToProjectDashboard: function () {
            var startTime = new Date();
            var contentViewUrl = "views/projectDashboard/ContentView";
            var topBarViewUrl = "views/projectDashboard/TopBarView";
            var self = this;

            if (this.mainView == null) this.main("projectDashboard");

            require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                custom.setCurrentVT('list');

                var contentview = new contentView({ startTime: startTime });
                var topbarView = new topBarView({ actionType: "Content" });
                self.changeView(contentview);
                self.changeTopBarView(topbarView);
            });
        },

        goToWorkflows: function () {
            var startTime = new Date();
            if (this.mainView == null) this.main("Workflows");

            var contentViewUrl = "views/Workflows/ContentView",
                topBarViewUrl = "views/Workflows/TopBarView",
                collectionUrl = "collections/Workflows/WorkflowsCollection";

            var self = this;

            require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                var collection = new contentCollection();

                collection.bind('reset', _.bind(createViews, self));
                custom.setCurrentVT('list');

                function createViews() {
                    collection.unbind('reset');
                    var contentview = new contentView({ collection: collection, startTime: startTime });
                    var topbarView = new topBarView({ actionType: "Content" });

                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editWorkflowsDetails, contentview);
                    topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                    topbarView.bind('saveEvent', contentview.saveProfile, contentview);

                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);
                    var url = '#easyErp/Workflows';
                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        buildCollectionRoute: function (contentType) {
            if (!contentType) {
                throw new Error("Error building collection route. ContentType is undefined");
            }
            switch (contentType) {
                case 'Birthdays':
                    return "collections/" + contentType + "/filterCollection";
                default:
                    return "collections/" + contentType + "/filterCollection";
            }
        },

        goToList: function (contentType, parrentContentId) {
            var self = this;
            var startTime = new Date();
            var contentViewUrl = "views/" + contentType + "/list/ListView";
            var topBarViewUrl = "views/" + contentType + "/TopBarView";
            var collectionUrl = this.buildCollectionRoute(contentType);

            if (this.mainView == null) this.main(contentType);

            require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                var collection = new contentCollection({
                    viewType: 'list',
                    page: 1,
                    count: 50,
                    status: [],
                    parrentContentId: parrentContentId,
                    contentType: contentType,
                    newCollection: true
                });//status - to filter by workflows

                collection.bind('reset', _.bind(createViews, self));
                custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var topbarView = new topBarView({ actionType: "Content", collection: collection });
                    var contentview = new contentView({ collection: collection, startTime: startTime });
                   
                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editItem, contentview);
                    topbarView.bind('deleteEvent', contentview.deleteItems, contentview);

                    collection.bind('showmore', contentview.showMoreContent, contentview);
                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);
                    var url;
                    if (parrentContentId) {
                         url = '#easyErp/' + contentType + '/list/' + parrentContentId;
                    } else {
                         url = '#easyErp/' + contentType + '/list';
                    }

                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToForm: function (contentType, modelId) {
            var self = this;
            var startTime = new Date();
            var contentFormModelUrl;
            var contentFormViewUrl;
            var topBarViewUrl;

            if (this.mainView == null) this.main(contentType);

            if (contentType !== 'ownCompanies') {
                contentFormModelUrl = "models/" + contentType + "Model";
                contentFormViewUrl = "views/" + contentType + "/form/FormView";
                topBarViewUrl = "views/" + contentType + "/TopBarView";
            } else {
                contentFormModelUrl = "models/CompaniesModel";
                contentFormViewUrl = "views/" + contentType + "/form/FormView";
                topBarViewUrl = "views/" + contentType + "/TopBarView";
            }

            custom.setCurrentVT('form');
            require([contentFormModelUrl, contentFormViewUrl, topBarViewUrl], function (contentFormModel, contentFormView, topBarView) {
                var getModel = new contentFormModel();

                getModel.urlRoot = '/' + contentType + '/form';
                getModel.fetch({
                    data: { id: modelId },
                    success: function (model) {
						console.log(model);
//                        self.convertModelDates(model);
                        var topbarView = new topBarView({ actionType: "Content" });
                        var contentView = new contentFormView({ model: model, startTime: startTime });

                        topbarView.bind('deleteEvent', contentView.deleteItems, contentView);
                        topbarView.bind('editEvent', contentView.editItem, contentView);
                        topbarView.bind('deleteEvent', contentView.deleteItems, contentView);

                        contentView.render();
                        self.changeView(contentView);
                        self.changeTopBarView(topbarView);
                    },
                    error: function (model, response) {
                        if (response.status === 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            });
        },

        convertModelDates: function (model) {
            if (model.has('createdBy'))
                model.get('createdBy').date = common.utcDateToLocaleDateTime(model.get('createdBy').date);
            if (model.has('editedBy'))
                model.get('editedBy').date = common.utcDateToLocaleDateTime(model.get('editedBy').date);
            if (model.has('dateBirth'))
                model.set({
                    dateBirth: common.utcDateToLocaleDate(model.get('dateBirth'))
                });
            if (model.has('nextAction'))
                model.set({
                    nextAction: common.utcDateToLocaleDate(model.get('nextAction').date)
                });
        },

        goToKanban: function (contentType, parrentContentId) {
            var self = this;
            var contentViewUrl = "views/" + contentType + "/kanban/KanbanView";
            var topBarViewUrl = "views/" + contentType + "/TopBarView";
            var collectionUrl = "collections/Workflows/WorkflowsCollection";

            if (this.mainView == null) this.main(contentType);
            custom.setCurrentVT('kanban');
            require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, workflowsCollection) {
                var startTime = new Date();

                var collection = new workflowsCollection({ id: contentType });
                var url = 'easyErp/' + contentType + '/kanban';

                collection.bind('reset', _.bind(createViews, self));

                function createViews() {
                    var contentview = new contentView({ workflowCollection: collection, startTime: startTime, parrentContentId: parrentContentId });
                    var topbarView = new topBarView({ actionType: "Content" });

                    collection.unbind('reset');

                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editItem, contentview);
                    topbarView.bind('editKanban', contentview.editKanban, contentview);

                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);

                    if (parrentContentId) {
                        url += '/' + parrentContentId;
                    }

                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToThumbnails: function (contentType) {
            custom.setCurrentVT('thumbnails');

            var startTime = new Date();
            var self = this;
            var contentViewUrl;
            var topBarViewUrl = "views/" + contentType + "/TopBarView";
            var collectionUrl;

            if (this.mainView == null) this.main(contentType);
            if (contentType !== 'Calendar' && contentType !== 'Workflows') {
                contentViewUrl = "views/" + contentType + "/thumbnails/ThumbnailsView";
                collectionUrl = this.buildCollectionRoute(contentType);
            } else {
                contentViewUrl = "views/" + contentType + '/ContentView';
                collectionUrl = "collections/" + contentType + "/" + contentType + "Collection";
            }

            require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {

                var collection = (contentType !== 'Calendar') && (contentType !== 'Workflows')
                    ? new contentCollection({
                            viewType: 'thumbnails',
                            page: 1,
                            count: 50,
                            contentType: contentType
                        })

                    : new contentCollection();

                collection.bind('reset', _.bind(createViews, self));

                function createViews() {
                    var contentview = new contentView({ collection: collection, startTime: startTime });
                    var topbarView = new topBarView({ actionType: "Content", collection: collection });
                    var url = '#easyErp/' + contentType + '/thumbnails';

                    collection.unbind('reset');

                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editItem, contentview);
                    topbarView.bind('deleteEvent', contentview.deleteItems, contentview);

                    collection.bind('showmore', contentview.showMoreContent, contentview);
                    collection.bind('showmoreAlphabet', contentview.showMoreAlphabet, contentview);

                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);

                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        getList: function (contentType) {
            if (contentType) {
                var viewType = custom.getCurrentVT({ contentType: contentType });
                Backbone.history.navigate('#easyErp/' + contentType + '/' + viewType, { trigger: true, replace: true });
            }
        },

        changeWrapperView: function (wrapperView) {
            if (this.wrapperView) {
                this.wrapperView.undelegateEvents();
            }
            this.wrapperView = wrapperView;
        },

        changeTopBarView: function (topBarView) {
            if (this.topBarView) {
                this.topBarView.undelegateEvents();
            }
            this.topBarView = topBarView;
        },

        changeView: function (view) {
            if (this.view) {
                this.view.undelegateEvents();
            }
            this.view = view;
        },

        main: function (contentType) {
            this.mainView = new mainView({ contentType: contentType });
            this.changeWrapperView(this.mainView);
        },

        login: function () {
            var url = "/getDBS";
            var that = this;

            this.mainView = null;

            $.ajax({
                url: url,
                type: "GET",
                success: function (response) {
                    that.changeWrapperView(new loginView({ dbs: response.dbsNames }));
                },
                error: function () {
                    that.changeWrapperView(new loginView());
                }
            });
        }
    });

    return appRouter;
});
