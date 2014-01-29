define([
        "text!templates/Tasks/kanban/KanbanItemTemplate.html",
        "common"
],
    function (KanbanItemTemplate, common) {
        var TasksItemView = Backbone.View.extend({
            className: "item",
            id: function () {
                return this.model.get("_id");
            },

            colors:[
                {dataColor: "#1ABC9C", className: "color_0"},
                {dataColor: "#2ECC71", className: "color_1"},
                {dataColor: "#3498DB", className: "color_2"},
                {dataColor: "#9B59B6", className: "color_3"},
                {dataColor: "#34495E", className: "color_4"},
                {dataColor: "#F1C40F", className: "color_5"},
                {dataColor: "#F39C12", className: "color_6"},
                {dataColor: "#E74C3C", className: "color_7"},
                {dataColor: "#27AE60", className: "color_8"},
                {dataColor: "#2980B9", className: "color_9"}
            ],

            initialize: function () {
                //this.render();
            },

            events: {
                //"click #delete": "deleteEvent",
                //"click .dropDown > a": "openDropDown",
                //"click .colorPicker a": "pickColor",
                //"click .task-content": "gotoForm",
                //"click #edit": "gotoEditForm",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"

            },
            notHide: function (e) {
				return false;
            },

			nextSelect:function(e){
				this.showNewSelect(e,false,true)
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false)
			},
            showNewSelect:function(e,prev,next){
				var elementVisible = 25;
				var newSel = $(e.target).parent().find(".newSelectList")
				if (prev||next){
					newSel = $(e.target).closest(".newSelectList")
				}
				var parent = newSel.length>0?newSel.parent():$(e.target).parent();
                var currentPage = 1;
                if (newSel.is(":visible")&&!prev&&!next){
                    newSel.hide();
					return;
				}

                if (newSel.length){
                    currentPage = newSel.data("page");
                    newSel.remove();
                }
				if (prev)currentPage--;
				if (next)currentPage++;
                var s="<ul class='newSelectList' data-page='"+currentPage+"'>";
                var start = (currentPage-1)*elementVisible;
				var options = parent.find("select option");
                var end = Math.min(currentPage*elementVisible,options.length);
                for (var i = start; i<end;i++){
                    s+="<li class="+$(options[i]).text().toLowerCase()+">"+$(options[i]).text()+"</li>";                                                
                }
				var allPages  = Math.ceil(options.length/elementVisible)
                if (options.length>elementVisible)
                    s+="<li class='miniStylePagination'><a class='prev"+ (currentPage==1?" disabled":"")+"' href='javascript:;'>&lt;Prev</a><span class='counter'>"+(start+1)+"-"+end+" of "+parent.find("select option").length+"</span><a class='next"+ (currentPage==allPages?" disabled":"")+"' href='javascript:;'>Next&gt;</a></li>";
                s+="</ul>";
                parent.append(s);
                return false;
                
            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();;
            },
			   chooseOption:function(e){
				   var k = $(e.target).parent().find("li").index($(e.target));
				   $(e.target).parents("p").find("select option:selected").removeAttr("selected");
				   $(e.target).parents("p").find("select option").eq(k).attr("selected","selected");
				   $(e.target).parents("p").find(".current-selected").text($(e.target).text());
				   var id=$(e.target).parents("p").find("select").attr("id").replace("priority","");
				   var obj = this.model;
				   var extr = this.model.get('extrainfo');
				   extr.priority=$(e.target).parents("p").find("select option").eq(k).val();
				   obj.set({"extrainfo":extr });
                   obj.save({}, {
                       headers: {
                           mid: 39
                       },
                       success: function () {
                       }
                   });

				   this.hideNewSelect();
				   return false;
			   },

			   styleSelect:function(id){
				   $(id).parent().find(".current-selected").remove();
				   var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
				   $(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a><div class='clearfix'></div>");
				   $(id).hide();
				   $(document).on("click",this.hideNewSelect);
			   },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".item").data("index") + 1;
                //var inder = this.data("index");
                window.location.hash = "#home/action-Tasks/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var id = $(e.target).closest(".item").data("id");
                App.ownContentType = true;
                window.location.hash = "home/content-Tasks/form/" + id;
            },

            deleteEvent: function (e) {
                common.deleteEvent(e, this);
            },

            openDropDown: function (e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("fast");
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
//                this.$(".colorPicker a").closest(".task-header").css('background-color', color).closest(".item").css('border-color', color);
            },

            isLater: function (str1, str2) {
                return new Date(str1) > new Date(str2);
            },

            changeDeadlineColor: function () {
                if ((this.$el.attr("id") == this.model.get('id'))) {
                    this.$(".deadline").css({ 'color': '#E74C3C' });
                }
            },

            render: function () {
				var self = this;
                var todayString = new Date().format("yyyy-mm-dd");

                if (this.model.get('deadline')) {
                    var deadlineString = this.model.get('deadline').split('T')[0];
                    this.model.set({ deadline: deadlineString.replace(/-/g, '/') }, { silent: true });
                }
                this.$el.html(this.template({model: this.model.toJSON(), colors: this.colors}));
                if (this.isLater(todayString, deadlineString)) {
                    this.changeDeadlineColor();
                }
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-id", this.model.get('_id'));
                this.$el.addClass(this.model.get('extrainfo').priority);
				var item = this.model.toJSON();
				var id="#priority"+item._id;
                common.populatePriority(id, "/Priority", item, function () { self.styleSelect(id); });
                return this;
            }
        });

        return TasksItemView;
    });
