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
            "home/content-:type(/:viewtype)(/:curitem)(/:hash)": "getList",
            "home/action-:type/:action(/:curitem)(/:hash)": "makeAction",
            "*actions": "main"
        },

        getList: function (contentType, viewType, itemIndex, hash) {
            if (this.mainView == null) this.main();
            //if (hash) {
            //    if (hash.length != 24) {
            //        itemIndex = hash;
            //        hash = null;
            //    }
            //}
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
                var contentCollection = new ContentCollection();
                contentCollection.bind('reset', _.bind(createViews, self));
                function createViews() {
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
                    if (contentType === "Projects" || contentType === "Tasks" || contentType === "Persons" || contentType === "Departments" || contentType === "JobPositions" || contentType === "Employees")
                        topBarView.bind('editEvent', contentView.editItem, contentView);
                    if (contentType === "LeadsWorkflow")
                        topBarView.bind('createEvent', contentView.createItem, contentView);

                    this.changeView(contentView);
                    this.changeTopBarView(topBarView);

                    Backbone.history.navigate(url, { replace: true });
                }
            });

        },

        makeAction: function (contentType, action, itemIndex, hash) {
            //if (/\s/.test(contentType)) {
            //    var contentTypeArray = contentType.split(' ');
            //    contentType = contentTypeArray.join('');
            //}
            //if (hash) {
            //    if (hash.length != 24) {
            //        itemIndex = hash;
            //        hash = null;
            //    }
            //}
            if (this.mainView == null) this.main();
            var actionVariants = ["Create", "Edit", "View"];

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
                    //this.Custom.setCurrentCL(contentCollection.models.length);

                    //if (itemIndex) 
                    //    this.Custom.setCurrentII(itemIndex);
                    if (itemIndex) contentCollection.setElement(itemIndex);

                    //itemIndex = this.Custom.getCurrentII();

                    var url = "#home/action-" + contentType + "/" + action;

                    if (action === "Edit" && contentType != "Profiles") {
                        url += "/" + itemIndex;
                    }
                    if (!hash && App.hash) {
                        hash = App.hash;
                    }
                    if (hash && (action === "Create" || action === "View" || action === "Edit")) {
                        url += "/" + hash;
                    }

                    Backbone.history.navigate(url, { replace: true});

                    var topBarView = new TopBarView({ actionType: action, collection: contentCollection }),
                        actionView = new ActionView({ collection: contentCollection, pId: hash });

                    topBarView.bind('saveEvent', actionView.saveItem, actionView);
                    if (contentType == "Profiles") {
                        topBarView.bind('nextEvent', actionView.nextForm, actionView);
                        topBarView.bind('deleteEvent', actionView.deleteItem, actionView);
                    }

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
