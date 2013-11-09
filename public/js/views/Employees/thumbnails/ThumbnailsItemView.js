define([
    "text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html",
    "common"
],
    function (ThumbnailsItemTemplate, common) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName: "div",
            className: "thumbnailwithavatar",

            initialize: function () {
                this.model.on('change', this.render, this);
                this.render();
            },

            events: {
                "click": "gotoForm",
                "click #delete": "deleteEvent",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click #edit": "gotoEditForm"
            },

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = this.$el.data("index") + 1;
                window.location.hash = "#home/action-Employees/Edit/" + itemIndex;
            },

            openDropDown: function (e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("normal");
            },

            pickColor: function (e) {
                e.preventDefault();
                var mid = 39;
                var color = $(e.target).data("color");
                this.changeColor(color);
                this.model.set({ color: color });
                this.model.save({ color: color }, {
                    headers: {
                        mid: mid
                    }
                });
            },

            changeColor: function (color) {
                var rgbColor = common.hexToRgb(color);
                this.$el.css('background-color', 'rgba(' + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.20)');
                this.$('p').css({ 'color': color, 'font-weight': 'bold', 'text-shadow': '0 1px 1px rgba(' + 255 + ',' + 255 + ',' + 255 + ', 0.5)' });
            },
            
            deleteEvent: function (e) {
                common.deleteEvent(e, this);
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                if ($(e.target).closest("div").attr("class") != "dropDown") {
                    var id = this.$el.attr("id");
                    window.location.hash = "#easyErp/Employees/form/" + id;
                }
            },
            calculateAge: function(dateString){
                if(!dateString) return "";
                var today = new Date();
                var birthDate = new Date(dateString);
                if(typeof birthDate.getMonth !== 'function'){
                    console.log("Employees -> calculateAge: birthDate is not a correct Date value");
                    return "";
                }
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0  && today.getDate() < birthDate.getDate())){
                    age--;
                }
                return age;
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function () {
                var age = this.calculateAge(this.model.get("dateBirth"));
                this.model.set({ age: age }, { silent: true });
                
                this.$el.attr("data-index", this.model.collection.indexOf(this.model));
                this.$el.attr("id", this.model.get('_id'));
                this.$el.html(this.template(this.model.toJSON()));
                this.changeColor(this.model.get('color'));
                return this;
            }
        });

        return ThumbnailsItemView;
    });