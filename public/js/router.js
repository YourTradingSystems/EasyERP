// Filename: router.js
define([
  'views/main/MainView',
  'views/login/LoginView',
  'custom'
], function (MainView, LoginView, Custom) {

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
            //"home/content-:type(/:viewtype)(/:curitem)(/:hash)": "getList",
            "easyErp/:contentType": "getList",
            "*actions": "main"
        },

        goToList: function (contentType) {
            console.API.clear();
            if (this.mainView == null) this.main();
            if (contentType !== 'Birthdays') {
	            var ContentViewUrl = "views/" + contentType + "/list/ListView",
	                TopBarViewUrl = "views/" + contentType + "/TopBarView",
	                CollectionUrl = "collections/" + contentType + "/filterCollection";
            } else {
            	var ContentViewUrl = "views/" + contentType + "/list/ListView",
            		TopBarViewUrl = "views/" + contentType + "/TopBarView",
            		CollectionUrl = "collections/Employees/EmployeesCollection";
            }
            var self = this;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var collection = new ContentCollection({ viewType: 'list', page: 1, count: 50 });

                collection.bind('reset', _.bind(createViews, self));
                Custom.setCurrentVT('list');
                function createViews() {
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
            console.log(contentType + "Model");
            var ContentFormModelUrl = "models/" + contentType + "Model",
                ContentFormViewUrl = "views/" + contentType + "/form/FormView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView";
            var self = this;
            Custom.setCurrentVT('form');
            require([ContentFormModelUrl, ContentFormViewUrl, TopBarViewUrl], function (ContentFormModel, ContentFormView, TopBarView) {
                var GetModel = new ContentFormModel();
                GetModel.urlRoot = '/' + contentType + '/form';
                GetModel.fetch({
                    data: { id: modelId },
                    success: function (model, response, options) {
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

        goToKanban: function (contentType, parrentContentId) {
            var ContentViewUrl = "views/" + contentType + "/kanban/KanbanView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/" + contentType + "/" + "filterCollection";

            self = this;
            Custom.setCurrentVT('kanban');
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var  collection = new ContentCollection({ viewType: 'kanban', page: 1, count: 10, parrentContentId: parrentContentId });
                collection.bind('reset', _.bind(createViews, self));
                function createViews() {
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });
                    
                    topBarView.bind('createEvent', contentView.createItem, contentView);
                    topBarView.bind('editEvent', contentView.editItem, contentView);

                    collection.bind('showmore', contentView.showMoreContent, contentView);
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    //var url = '#easyErp/' + contentType + '/kanban';
                    //url = (parrentContentId) ? url + '/' + parrentContentId : url;
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        goToThumbnails: function (contentType, parrentContentId) {
            console.API.clear();
            if (this.mainView == null) this.main();
            var ContentViewUrl,
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl;
            if (contentType !== 'Calendar'&& contentType !== 'Workflows' ) {
                ContentViewUrl = "views/" + contentType + "/thumbnails/ThumbnailsView";
                CollectionUrl = "collections/" + contentType + "/" + "filterCollection";
            } else {
                ContentViewUrl = "views/" + contentType + '/ContentView';
                CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection";
            }

            self = this;
            Custom.setCurrentVT('thumbnails');
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                collection = (contentType !== 'Calendar') && (contentType !== 'Workflows') ? new ContentCollection({ viewType: 'thumbnails', page: 1, count: 20, parrentContentId: parrentContentId }) : new ContentCollection();
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
                    //url = (parrentContentId) ? url + '/' + parrentContentId : url;
                    //Backbone.history.navigate(url, { replace: true });
                }
            });
        },

        getList: function (contentType) {
            if (contentType) Custom.getCurrentVT({ contentType: contentType });
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
