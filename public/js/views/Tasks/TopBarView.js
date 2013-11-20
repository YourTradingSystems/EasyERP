define([
    'text!templates/Tasks/TopBarTemplate.html',
    'custom',
    'common'
],
    function (ContentTopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: "Tasks",
            actionType: null,
            collectionLength: 0,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-saveBtn": "saveEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn": "editEvent"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            changeItemIndex: function (e) {
                //var windowLocHash = window.location.hash.split('/')[3];
                var actionType = "Content";
                //var hash;
                //if (typeof windowLocHash != "undefined" && windowLocHash.length == 24) {
                //    hash = windowLocHash;
                //}
                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
            },

            initialize: function (options) {
                this.actionType = options.actionType;
                if (this.actionType !== "Content")
                    Custom.setCurrentVT("form");
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            render: function () {
                var viewType = Custom.getCurrentVT();
                //var collectionLength = this.collection.length;
                //var itemIndex = Custom.getCurrentII();
                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType }));
                Common.displayControlBtnsByActionType(this.actionType, viewType);
                return this;
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            },
            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },


            saveEvent: function (event) {
                event.preventDefault();
                this.trigger('saveEvent');
            },

            discardEvent: function (event) {
                event.preventDefault();
                $('#content-holder').html('');
                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            }

        });

        return TopBarView;
    });