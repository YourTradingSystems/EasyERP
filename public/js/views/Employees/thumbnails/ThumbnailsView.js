define([
    "text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html",
    'views/Employees/EditView',
    'views/Employees/CreateView',
    'dataService',
    'models/EmployeesModel',
    'common',
    'text!templates/Alpabet/AphabeticTemplate.html'
],

    function (thumbnailsItemTemplate, editView, createView, dataService, currentModel, common, AphabeticTemplate) {
        var EmployeesThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(thumbnailsItemTemplate),
            checkClearView: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.countPerPage = options.collection.length;
                this.allAlphabeticArray = common.buildAllAphabeticArray();
                this.selectedLetter = "";
                this.getTotalLength(this.countPerPage);
                this.render();
                this.asyncLoadImgs(this.collection);
            },

            events: {
                "click #showMore": "showMore",
                "click .thumbnail": "gotoEditForm",
                "click .letter:not(.empty)": "alpabeticalRender"
            },

            getTotalLength: function (currentNumber) {
                dataService.getData('/totalCollectionLength/Employees', { currentNumber: currentNumber, letter: this.selectedLetter  }, function (response, context) {
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

            asyncLoadImgs: function (collection) {
                var ids = _.map(collection.toJSON(), function (item) {
                    return item._id;
                });
                common.getImages(ids, "/getEmployeesImages");
            },

            alpabeticalRender: function (e) {
                this.startTime = new Date();
                $(e.target).parent().find(".current").removeClass("current");
                $(e.target).addClass("current");
                this.selectedLetter = $(e.target).text();
                if ($(e.target).text() == "All") {
                    this.selectedLetter = "";
                }
                this.checkClearView = true;
                this.collection.showMore({ page: 1, letter: this.selectedLetter });
                this.getTotalLength(null);
            },

            render: function () {
                _.bind(this.collection.showMore, this.collection);
                var self = this;
                var currentEl = this.$el;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";

                currentEl.html('');
                common.buildAphabeticArray(this.collection,function(arr){
                    $(".startLetter").remove();
                    self.alphabeticArray = arr;
                    self.$el.prepend(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray,selectedLetter: (self.selectedLetter==""?"All":self.selectedLetter),allAlphabeticArray:self.allAlphabeticArray}));
                });

                if (this.collection.length > 0) {
                    currentEl.append(this.template({ collection: this.collection.toJSON() }));
                } else {
                    currentEl.html('<h2>No Employees found</h2>');
                }

                currentEl.append(createdInTag);
                return this;
            },

            gotoEditForm: function (e) {
                var clas = $(e.target).parent().attr("class");
                if ((clas === "dropDown") || (clas === "inner")) {
                } else {
                    e.preventDefault();
                    var id = $(e.target).closest('.thumbnail').attr("id");
                    var model = new currentModel({validate: false});
                    model.urlRoot = '/Employees/form/' + id;
                    model.fetch({
                        data: {id: id},
                        success: function (model) {
                            new editView({ model: model });
                        },
                        error: function () { alert('Please refresh browser'); }
                    });
                }
            },

            showMore: function () {
                this.collection.showMore({letter: this.selectedLetter });
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                if (this.checkClearView) {
                    this.checkClearView = null;
                    $('.thumbnail').remove();
                    this.countPerPage = 0;
                    this.collection.page = 1;
                }
                this.countPerPage += newModels.length;
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
                this.getTotalLength(this.countPerPage);
                showMore.before(this.template({ collection: this.collection.toJSON() }));
                showMore.after(created);
                this.asyncLoadImgs(newModels);
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
                var mid = 39,
                    model;
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

        return EmployeesThumbnalView;
    });