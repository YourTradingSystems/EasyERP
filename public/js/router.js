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
            "home/content-:type(/:viewtype)(/:hash)(/:curitem)": "getList",
            "home/action-:type/:action(/:hash)(/:curitem)": "makeAction",
            "*actions": "main"
        },

        getList: function (contentType, viewType, hash, itemIndex) {
            if (/\s/.test(contentType)) {
                var contentTypeArray = contentType.split(' ');
                contentType = contentTypeArray.join('');
            }
            if (this.mainView == null) this.main();
            if (hash) {
                if (hash.length != 24) {
                    itemIndex = hash;
                    hash = null;
                }
            }
            
            console.log('GetList: ' + contentType + " " + viewType + " " + hash + " " + itemIndex);

            var ContentViewUrl = "views/" + contentType + "/ContentView",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection",
                self = this;
            if (contentType == "Birthdays") {
                CollectionUrl = "collections/Employees/EmployeesCollection";
            }

            self.Custom = Custom;

            require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function (ContentView, TopBarView, ContentCollection) {
                var contentCollection = new ContentCollection();
                contentCollection.bind('reset', _.bind(createViews, self));
                function createViews() {

                    contentCollection.unbind('reset');
                    this.Custom.setCurrentCL(contentCollection.models.length);

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
                    if (itemIndex)
                        this.Custom.setCurrentII(itemIndex);

                    viewType = this.Custom.getCurrentVT({
                        contentType: contentType
                    });
                    
                    itemIndex = this.Custom.getCurrentII();

                    var url = "#home/content-" + contentType + "/" + viewType;

                    if (hash) {
                        url += "/" + hash;
                    }

                    if (viewType === "form" && (!hash || hash.length == 24)) {
                        url += "/" + itemIndex;
                    }
                    
                    var contentView = new ContentView({ collection: contentCollection });
                    var topBarView = new TopBarView({ actionType: "Content" });
                    if(contentType == "Profiles")
                        contentView.bind('editEvent', contentView.editItem, contentView);

                    topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                   
                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);
                    
                    Backbone.history.navigate(url, { replace: true });
                }

            });

        },
        makeAction: function (contentType, action, projectId, itemIndex) {
            if (/\s/.test(contentType)) {
                var contentTypeArray = contentType.split(' ');
                contentType = contentTypeArray.join('');
            }
            if (projectId) {
                if (projectId.length != 24) {
                    itemIndex = projectId;
                    projectId = null;
                }
            }
            if (this.mainView == null) this.main();
            var actionVariants = ["Create", "Edit"];

            if ($.inArray(action, actionVariants) == -1) {
                action = "Create";
            }
            var ActionViewUrl = "views/" + contentType + "/" + action + "View",
                TopBarViewUrl = "views/" + contentType + "/TopBarView",
                CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection";

            var self = this;

            self.Custom = Custom;

            require([ActionViewUrl, TopBarViewUrl, CollectionUrl], function (ActionView, TopBarView, ContentCollection) {
                var contentCollection = new ContentCollection();
                contentCollection.bind('reset', _.bind(createViews, self));

                function createViews() {
                    contentCollection.unbind('reset');
                    this.Custom.setCurrentCL(contentCollection.models.length);

                    if (itemIndex)
                        this.Custom.setCurrentII(itemIndex);

                    itemIndex = this.Custom.getCurrentII();

                    var url = "#home/action-" + contentType + "/" + action;

                    if (action === "Edit") {
                        url += "/" + itemIndex;
                    }
                    if (!projectId && App.projectId) {
                        projectId = App.projectId
                    }
                    if (projectId && action === "Create") {
                        url += "/" + projectId
                    }
                    Backbone.history.navigate(url, { replace: true });

                    var topBarView = new TopBarView({ actionType: action}),
                        actionView = new ActionView({ collection: contentCollection, pId: projectId });

                    topBarView.bind('saveEvent', actionView.saveItem, actionView);

                    this.changeView(actionView);
                    this.changeTopBarView(topBarView);
                }
            }, self);
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