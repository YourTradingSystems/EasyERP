define([
    'text!templates/Tasks/list/ListHeader.html',
    'views/Tasks/CreateView',
    'views/Tasks/list/ListItemView'
],

function (TasksListTemplate, CreateView, ListItemView) {
    var TasksListView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            listLimit = this.collection.count;
            arrayOfTasks = [];
            counter = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .checkbox": "checked",
            "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm"
        },

        render: function () {
            $('.ui-dialog ').remove();
            var that = this;
            this.$el.html(_.template(TasksListTemplate));
                       // this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            _.each( this.collection.models, function (taskModel,modelKey ){
                if (modelKey < listLimit) {
                    counter++;
                    var listItemView  = new ListItemView({ model: taskModel,index: counter});
                    listItemView.render();
                } else {
                    arrayOfTasks.push(taskModel);
                }
            });

            if (arrayOfTasks.length > 0) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
               }

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });

        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            debugger;
            var that = this;
            var localCounter = 0;
            for (var i=0; i<arrayOfTasks.length; i++) {
                counter++;
                localCounter++;
                var listItemView  = new ListItemView({ model: arrayOfTasks[i],index: counter});
                listItemView.render();
                arrayOfTasks.splice(i,1);
                i--;
            }

            _.each( newModels.models, function (taskModel ){
                if (localCounter < listLimit) {
                    localCounter++;
                    counter++;
                    var listItemView  = new ListItemView({ model: taskModel,index: counter});
                    listItemView.render();
                } else {
                    arrayOfTasks.push(taskModel);
                }
            });

            if (arrayOfTasks.length == 0) {
                $('#showMoreDiv').hide();
            }

        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#easyErp/Tasks/form/" + id;
        },

        createItem: function () {
            //create editView in dialog here
            new CreateView();
        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model;
            $.each($("tbody input:checked"), function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });

            this.collection.trigger('reset');
        }

    });

    return TasksListView;
});
