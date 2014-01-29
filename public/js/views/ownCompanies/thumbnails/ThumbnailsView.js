define([
    'common',
    'views/ownCompanies/EditView',
    'views/ownCompanies/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    "text!templates/ownCompanies/thumbnails/ThumbnailsItemTemplate.html",
    'dataService'
],

    function (common, editView, createView, AphabeticTemplate, ThumbnailsItemTemplate, dataService) {
        var OwnCompaniesThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(ThumbnailsItemTemplate),

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.countPerPage = options.collection.length;
                this.getTotalLength(this.countPerPage);
                this.render();
            },

            events: {
                "click #showMore": "showMore",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .gotoForm": "gotoForm",
                "click .company": "gotoCompanyForm"
            },

            getTotalLength: function(currentNumber) {
                dataService.getData('/totalCollectionLength/ownCompanies', { currentNumber: currentNumber}, function (response, context) {
                    var showMore = context.$el.find('#showMoreDiv');
                    if (response.showMore) {
                        if (showMore.length === 0) {
                            var created = context.$el.find('#timeRecivingDataFromServer');
                            created.before('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
                        } else {
                            showMore.show();
                        }
                    } else {
                        showMore.hide();
                    }
                }, this);
            },
            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/ownCompanies/form/" + id;
            },

            gotoCompanyForm: function (e) {
                e.preventDefault();
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/ownCompanies/form/" + id;
            },
            render: function () {
                console.log(' ======= ==== ====  ');
                console.log(this.collection.toJSON());
                var self = this;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var currentEl = this.$el;

                currentEl.html('');
                if (this.collection.length > 0) {
                    currentEl.append(this.template({ collection: this.collection.toJSON() }));
                } else {
                    currentEl.html('<h2>No ownCompanies found</h2>');
                }
                currentEl.append(createdInTag);
                return this;
            },

            showMore: function () {
                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({});
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                this.countPerPage += newModels.length;
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
                this.getTotalLength(this.countPerPage);
                showMore.before(this.template({ collection: this.collection.toJSON() }));
                showMore.after(created);
            },

            createItem: function () {
                //create editView in dialog here
                new createView();
            },

            editItem: function () {
                //create editView in dialog here
                new editView({ collection: this.collection });
            },

            deleteItems: function () {
                var mid = 39;
                var model;

                model = this.collection.get(this.$el.attr("id"));
                this.$el.fadeToggle(200, function () {
                    model.destroy({
                        headers: {
                            mid: mid
                        }
                    });
                    $(this).remove();
                });
            }
        });

        return OwnCompaniesThumbnalView;
    });
