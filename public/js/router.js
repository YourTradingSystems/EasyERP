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
            "easyErp/:contentType/thumbnails(/:parrentContentId)": "goToThumbnails",
            "easyErp/:contentType/form/:modelId": "goToForm",
            "easyErp/:contentType/list(/:parrentContentId)": "goToList",
            "easyErp/Profiles": "goToProfiles",
            "easyErp/myProfile": "goToUserPages",
            "easyErp/Workflows": "goToWorkflows",
            "easyErp/Dashboard": "goToDashboard",
            "easyErp/:contentType": "getList",
            "*eny": "main"
        },

        initialize: function () {
            this.on('all', function () {
                $(".ui-dialog").remove();
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

                    this.changeView(contentView);
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
                var collection = new contentCollection({ viewType: 'list', page: 1, count: 50, status: [], parrentContentId: parrentContentId });

                collection.bind('reset', _.bind(createViews, self));
                custom.setCurrentVT('list');
                function createViews() {
                    collection.unbind('reset');
                    var contentview = new contentView({ collection: collection, startTime: startTime });
                    var topbarView = new topBarView({ actionType: "Content", collection: collection });

                    topbarView.bind('createEvent', contentview.createItem, contentview);
                    topbarView.bind('editEvent', contentview.editItem, contentview);
                    topbarView.bind('deleteEvent', contentview.deleteItems, contentview);

                    collection.bind('showmore', contentview.showMoreContent, contentview);
                    this.changeView(contentview);
                    this.changeTopBarView(topbarView);
                    var url = '#easyErp/' + contentType + '/list';
                    
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
            require([contentFormModelUrl, contentFormViewUrl, topBarViewUrl], function (ContentFormModel, ContentFormView, TopBarView) {
                var GetModel = new ContentFormModel();
                GetModel.urlRoot = '/' + contentType + '/form';
                GetModel.fetch({
                    data: { id: modelId },
                    success: function (model, response, options) {
                        self.convertModelDates(model);
                        var topBarView = new TopBarView({ actionType: "Content" });
                        var contentView = new ContentFormView({ model: model, startTime: startTime });

                        topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                        topBarView.bind('editEvent', contentView.editItem, contentView);
                        topBarView.bind('deleteEvent', contentView.deleteItems, contentView);

                        contentView.render();
                        self.changeView(contentView);
                        self.changeTopBarView(topBarView);
                    },
                    error: function(model, response, options) {
                        if (response.status === 401) Backbone.history.navigate('#login', {trigger: true});
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
            if (this.mainView == null) this.main(contentType);
            var ContentViewUrl = "views/" + contentType + "/kanban/KanbanView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/Workflows/WorkflowsCollection";

            self = this;
            custom.setCurrentVT('kanban');

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, WorkflowsCollection) {
                var startTime = new Date();
                var collection = new WorkflowsCollection({ id: contentType });
                collection.bind('reset', _.bind(createViews, self));
                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ workflowCollection: collection, startTime: startTime });
                    var topBarView = new TopBarView({ actionType: "Content" });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);
                    topBarView.bind('editKanban', contentView.editKanban, contentView);
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    var url = 'easyErp/' + contentType + '/kanban';
                    if (parrentContentId) {
                        url += '/' + parrentContentId;
                    }
                    Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToThumbnails: function (contentType, parrentContentId) {
            var startTime = new Date();
            if (this.mainView == null) this.main(contentType);
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
            custom.setCurrentVT('thumbnails');
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {

                collection = (contentType !== 'Calendar') && (contentType !== 'Workflows')
                    ? new ContentCollection({
                            viewType: 'thumbnails',
                            page: 1,
                            count: 50,
                            parrentContentId: parrentContentId
                        })
                    : new ContentCollection();
                collection.bind('reset', _.bind(createViews, self));

                function createViews() {
                    collection.unbind('reset');
                    var contentView = new ContentView({ collection: collection, startTime: startTime });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });

                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);

                    collection.bind('showmore', contentView.showMoreContent, contentView);
                    collection.bind('showmoreAlphabet', contentView.showMoreAlphabet, contentView);

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
            this.mainView = null;
            var url = "/getDBS";
            var that = this;
            $.ajax({
                url: url,
                type: "GET",
                success: function (response) {
                    that.changeWrapperView(new loginView({ dbs: response.dbsNames }));
                },
                error: function (data) {
                    that.changeWrapperView(new loginView());
                }
            });

        }
    });

    return appRouter;
});
