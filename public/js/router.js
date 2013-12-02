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
            "kanban/:contentType(/:parrentContentId)": "goToKanban",
            "home/content-:type(/:viewtype)(/:curitem)(/:hash)": "getList",
            "*actions": "main"
        },

        goToKanban: function (contentType, parrentContentId) {
            if (this.mainView == null) this.main();
            var ContentViewUrl = "views/" + contentType + "/kanban/KanbanView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/" + contentType + "/" + "kanbanCollection";
            
            self = this;
            
            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                collection = new ContentCollection(parrentContentId);
                collection.bind('reset', _.bind(createViews, self));

                function createViews() {
                    var contentView = new ContentView({ collection: collection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: collection });
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                }
            });
        },

        getList: function (contentType, viewType, itemIndex, hash) {
           if (this.mainView == null) this.main();
            console.log('GetList: ' + contentType + " " + viewType + " " + itemIndex + " " + hash);

            var ContentViewUrl = "views/" + contentType + "/ContentView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection",
                self = this;
            if (contentType == "Birthdays") {
                CollectionUrl = "collections/Employees/EmployeesCollection";
            } else if (contentType == "ownCompanies") {
                TopBarViewUrl = "views/Companies/TopBarView";
                ContentViewUrl = "views/Companies/ContentView";
                CollectionUrl = "collections/Companies" + "/" + contentType + "Collection";
            }

            self.Custom = Custom;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var start = new Date();
                var contentCollection = new ContentCollection();
                contentCollection.bind('reset', _.bind(createViews, self));
                function createViews() {
                    console.log("=========================Collection fetch time:" + (new Date() - start)/1000 + " ms");

                    contentCollection.unbind('reset');
                    //this.Custom.setCurrentCL(contentCollection.models.length);

                    if (viewType) {
                        if (!App.contentType || App.contentType != contentType) {
                            App.contentType = contentType;
                        }
                        this.Custom.setCurrentVT(viewType);

                    } else {
                        App.ownContentType = false;
                        if (!App.contentType || App.contentType != contentType) {
                            App.contentType = contentType;
                        }
                        this.Custom.getCurrentVT({
                            contentType: contentType
                        });
                    }
                    if (itemIndex) contentCollection.setElement(itemIndex);

                    viewType = this.Custom.getCurrentVT({
                        contentType: contentType
                    });

                    //itemIndex = this.Custom.getCurrentII();

                    var url = "#home/content-" + contentType + "/" + viewType;

                    if (itemIndex) {
                        url += "/" + itemIndex;
                    }
                    if (hash) {
                        url += "/" + hash;
                    }
                    //if (viewType === "form" && (!hash || hash.length == 24)) {
                    //    App.hash = hash;
                    //    url += "/" + itemIndex;
                    //}

                    var contentView = new ContentView({ collection: contentCollection });
                    var topBarView = new TopBarView({ actionType: "Content", collection: contentCollection });
                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);

                    if (contentType === "Projects" || contentType === "Tasks" || contentType === "Persons" || contentType === "Departments" || contentType === "JobPositions" || contentType === "Employees" || contentType === "Leads" || contentType === "Opportunities" || contentType === "Companies" || contentType === "Applications") {
                        topBarView.bind('editEvent', contentView.editItem, contentView);
                        topBarView.bind('createEvent', contentView.createItem, contentView);
                    }
                    if (contentType === "LeadsWorkflow")
                        topBarView.bind('createEvent', contentView.createItem, contentView);

                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);

                    Backbone.history.navigate(url, { replace: true });
                }
            });

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
