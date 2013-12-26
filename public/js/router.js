// Filename: router.js
define([
  'views/main/MainView',
  'views/login/LoginView',
  'custom',
    'common'
], function (MainView, LoginView, Custom, Common) {

    var AppRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView: null,
        topBarView: null,
        view: null,

        routes: {
            "home": "main",
            "login": "login",
            "easyErp/:contentType/kanban(/:parrentContentId)": "goToKanban",
            "easyErp/:contentType/thumbnails(/:parrentContentId)": "goToThumbnails",
            "easyErp/:contentType/form/:modelId": "goToForm",
            "easyErp/:contentType/list": "goToList",
            "easyErp/Profiles": "goToProfiles",
            "easyErp/Workflows": "goToWorkflows",
            "easyErp/Dashboard": "goToDashboard",
            "easyErp/:contentType": "getList"

        },

        goToProfiles: function () {
            if (this.mainView == null) this.main();

            var ContentViewUrl = "views/Profiles/ContentView",
                TopBarViewUrl = "views/Profiles/TopBarView",
                CollectionUrl = "collections/Profiles/ProfilesCollection";

            var self = this;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection();

                collection.bind('reset', _.bind(createViews, self));
                Custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content" });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editProfileDetails, contentView);
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                    topBarView.bind('saveEvent', contentView.saveProfile, contentView);

                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    //var url = '#easyErp/' + contentType + '/list';
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToDashboard: function () {
            if (this.mainView == null) this.main();

            var ContentViewUrl = "views/Dashboard/ContentView",
                TopBarViewUrl = "views/Dashboard/TopBarView",
                CollectionUrl = "collections/Profiles/ProfilesCollection";

            var self = this;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection();

                collection.bind('reset', _.bind(createViews, self));
                Custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content" });

                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    //var url = '#easyErp/' + contentType + '/list';
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },
        goToWorkflows: function () {
            if (this.mainView == null) this.main();

            var ContentViewUrl = "views/Workflows/ContentView",
                TopBarViewUrl = "views/Workflows/TopBarView",
                CollectionUrl = "collections/Workflows/WorkflowsCollection";

            var self = this;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection();

                collection.bind('reset', _.bind(createViews, self));
                Custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content" });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editWorkflowsDetails, contentView);
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                    topBarView.bind('saveEvent', contentView.saveProfile, contentView);

                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    //var url = '#easyErp/' + contentType + '/list';
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },
        buildCollectionRoute: function (contentType) {
            if (!contentType) {
                throw new Error("Error building collection route. ContentType is undefined");
                return;
            }
            switch (contentType) {
                case 'Birthdays':
                    return "collections/Employees/EmployeesCollection";
                default:
                    return "collections/" + contentType + "/filterCollection";
            }
        },

        goToList: function (contentType) {
            // console.API.clear();
            if (this.mainView == null) this.main();

            var ContentViewUrl = "views/" + contentType + "/list/ListView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = this.buildCollectionRoute(contentType);

            var self = this;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection({ viewType: 'list', page: 1, count: 5 });

                collection.bind('reset', _.bind(createViews, self));
                Custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);

                    collection.bind('showmore', contentView.showMoreContent, contentView);
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    //var url = '#easyErp/' + contentType + '/list';
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToForm: function (contentType, modelId) {
            if (this.mainView == null) this.main();
            //console.log(contentType + "Model");
            if (contentType !== 'ownCompanies') {
                var ContentFormModelUrl = "models/" + contentType + "Model",
                    ContentFormViewUrl = "views/" + contentType + "/form/FormView",
                    TopBarViewUrl = "views/" + contentType + "/TopBarView";
            } else {
                var ContentFormModelUrl = "models/CompaniesModel",
                ContentFormViewUrl = "views/" + contentType + "/form/FormView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView";
            }
            var self = this;
            Custom.setCurrentVT('form');
            require([ContentFormModelUrl, ContentFormViewUrl, TopBarViewUrl], function (ContentFormModel, ContentFormView, TopBarView) {
                var GetModel = new ContentFormModel();
                GetModel.urlRoot = '/' + contentType + '/form';
                GetModel.fetch({
                    data: { id: modelId },
                    success: function (model, response, options) {
                        self.convertModelDates(model);
                        var topBarView = new TopBarView({ actionType: "Content" });
                        var contentView = new ContentFormView({ model: model });
                        topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                        topBarView.bind('editEvent', contentView.editItem, contentView);
                        topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                        contentView.render();
                        self.changeView(contentView);
                        self.changeTopBarView(topBarView);
                    },
                    error: function () { }
                });
            });
        },

        convertModelDates: function (model) {
            if (model.has('createdBy'))
                model.get('createdBy').date = Common.utcDateToLocaleDateTime(model.get('createdBy').date);
            if (model.has('editedBy'))
                model.get('editedBy').date = Common.utcDateToLocaleDateTime(model.get('editedBy').date);
            if (model.has('dateBirth'))
                model.set({
                    dateBirth: Common.utcDateToLocaleDate(model.get('dateBirth'))
                });
            if (model.has('nextAction'))
                model.set({
                    nextAction: Common.utcDateToLocaleDate(model.get('nextAction').date)
                });
        },

        goToKanban: function (contentType, parrentContentId) {
            if (this.mainView == null) this.main();
            var ContentViewUrl = "views/" + contentType + "/kanban/KanbanView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = this.buildCollectionRoute(contentType);

            self = this;
            Custom.setCurrentVT('kanban');
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection({ viewType: 'kanban', page: 1, count: 10, parrentContentId: parrentContentId });
                collection.bind('reset', _.bind(createViews, self));
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);

                    collection.bind('showmore', contentView.showMoreContent, contentView);
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    var url = 'easyErp/' + contentType + '/kanban';
                    if (parrentContentId) {
                        url += '/' + parrentContentId;
                    }
                    Backbone.history.navigate(url, { replace:true});
                }
            });
        },

        goToThumbnails: function (contentType, parrentContentId) {
            //console.API.clear();
            if (this.mainView == null) this.main();
            var ContentViewUrl,
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl;
            if (contentType !== 'Calendar' && contentType !== 'Workflows') {
                ContentViewUrl = "views/" + contentType + "/thumbnails/ThumbnailsView";
                CollectionUrl = this.buildCollectionRoute(contentType);
            } else {
                ContentViewUrl = "views/" + contentType + '/ContentView';
                CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection";
            }

            self = this;
            Custom.setCurrentVT('thumbnails');
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                collection = (contentType !== 'Calendar') && (contentType !== 'Workflows') ? new ContentCollection({ viewType: 'thumbnails', page: 1, count: 50, parrentContentId: parrentContentId }) : new ContentCollection();
                collection.bind('reset', _.bind(createViews, self));
                function createViews() {
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);

                    collection.bind('showmore', contentView.showMoreContent, contentView);
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    var url = '#easyErp/' + contentType + '/thumbnails';
                    url = (parrentContentId) ? url + '/' + parrentContentId : url;
                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        getList: function (contentType) {
            if (contentType) {
                var viewType = Custom.getCurrentVT({ contentType: contentType });
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

        main: function () {
            this.mainView = new MainView();
            this.changeWrapperView(this.mainView);
        },

        login: function () {
            this.mainView = null;
            this.changeWrapperView(new LoginView());
        }
    });
    return AppRouter;
});
