define([
    'common',
    'views/Persons/EditView',
    'views/Persons/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html",
    'dataService'
],

function (common, editView, createView, AphabeticTemplate, ThumbnailsItemTemplate, dataService) {
    var PersonsThumbnalView = Backbone.View.extend({
        el: '#content-holder',
        countPerPage: 0,
        template: _.template(ThumbnailsItemTemplate),
        
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.selectedLetter = "";
            _.bind(this.collection.showMoreAlphabet, this.collection);
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
            dataService.getData('/totalCollectionLength/Persons', { currentNumber: currentNumber, letter: this.selectedLetter }, function (response, context) {
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

        alpabeticalRender: function (e) {
            var target = $(e.target);
            target.parent().find(".current").removeClass("current");
            target.addClass("current");
            this.selectedLetter = target.text();
            if (target.text() == "All") {
                this.selectedLetter = "";
            }
            this.collection.showMoreAlphabet({page: 1, letter: this.selectedLetter });
        },
        gotoForm: function (e) {
            e.preventDefault();
            App.ownContentType = true;
            var id = $(e.target).closest("a").data("id");
            window.location.hash = "#easyErp/Persons/form/" + id;
        },

        gotoCompanyForm: function (e) {
            e.preventDefault();
            var id = $(e.target).closest("a").data("id");
            window.location.hash = "#easyErp/Companies/form/" + id;
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
                currentEl.html('<h2>No persons found</h2>');
            }

            common.buildAphabeticArray(this.collection, function (arr) {
                $("#startLetter").remove();
                self.alphabeticArray = arr;
                currentEl.prepend(_.template(AphabeticTemplate, {
                    alphabeticArray: self.alphabeticArray,
                    selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter),
                    allAlphabeticArray: self.allAlphabeticArray
                }));
            });
     
            currentEl.append(createdInTag);
            return this;
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({ letter: this.selectedLetter });
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
        
        showMoreAlphabet: function (newModels) {
            var holder = this.$el;
            var alphaBet = holder.find('#startLetter');
            var created = holder.find('#timeRecivingDataFromServer');
            var showMore = holder.find('#showMoreDiv');
            var content = holder.find(".thumbnailwithavatar");
            var countPerPage = this.countPerPage = newModels.length;

            content.remove();
            
            holder.append(this.template({ collection: newModels.toJSON() }));

            this.getTotalLength(countPerPage);

            holder.prepend(alphaBet);
            holder.append(created);
            created.before(showMore);
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

    return PersonsThumbnalView;
});
