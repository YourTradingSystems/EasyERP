define([
    'views/menu/MenuItem',
    'collections/menu/MenuItems'
],
    function (MenuItemView) {

        var LeftMenuView = Backbone.View.extend({
            tagName: 'nav',
            className: 'menu',
            el: '#submenu-holder nav',
            currentSection: null,
            selectedId: null,

            events: {
                "click a": "selectMenuItem",
                //                "click a": "hoverItem",
                "mouseover a": "hoverItem",
                "mouseleave a": "mouseLeave"
            },

            setCurrentSection: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.render();
            },
            mouseOver: function (section, selectedId) {

                if (this.leftMenu) {
                    this.leftMenu.currentSection = section;
                    this.leftMenu.render(true, selectedId);
                } else {
                    this.currentSection = section;
                    this.render(true, selectedId);

                }
            },

            initialize: function (options) {
                console.log("init MenuView");
                if (!options.collection) throw "No collection specified!";
                this.collection = options.collection;
                if (options.currentRoot)
                    this.currentSection = options.currentRoot[0].get('mname')
                this.currentChildren = options.currentChildren;
                _.bindAll(this, 'render');
                if (this.currentChildren && this.currentChildren.length > 0) {
                    this.render(null, this.currentChildren[0].get("_id"));
                } else {
                    this.render();
                }
                this.collection.bind('reset', _.bind(this.render, this));
                this.mouseLeave = _.debounce(this.mouseLeaveEl, 2000);
            },

            render: function (onMouseOver, selectedId) {
                console.log("Render LeftMenuView");
                var $el = $(this.el);
                $el.html('');
                var currentModule = null;
                var root = this.collection.root();
                if (this.currentSection == null)
                    this.currentSection = root[0].get('mname');

                for (var i = 0, len = root.length; i < len; i++) {
                    if (root[i].get('mname') == this.currentSection) {
                        currentModule = root[i];
                        break;
                    }
                }
                if (currentModule == null) currentModule = root[0];
                var elem = $el.append(this.renderMenu(this.collection.children(currentModule), onMouseOver));
                var currentSelElem = document.getElementById(selectedId);
                if ($(currentSelElem).length == 0) {
                    currentSelElem = document.getElementById(this.lastClickedLeftMenuItem);
                }
                $(currentSelElem).closest("ul").find(".selected").removeClass("selected");
                $(currentSelElem).addClass('selected');
                return this;
            },

            hoverItem: function (e) {
                this.$el.find('li.hover').removeClass('hover');
                $(e.target).closest('li').addClass('hover');
            },
            selectMenuItem: function (e) {
                debugger;
                this.selectedId = $(e.target).data('module-id');
                this.$('li.selected').removeClass('selected');
                this.lastClickedLeftMenuItem = $(e.target).data('module-id');
                $(e.target).closest('li').addClass('selected');
                var root = this.collection.root();
                for (var i = 0; i < root.length; i++) {
                    if (root[i].get('mname') == this.currentSection) {
                        $('#mainmenu-holder .selected').removeClass('selected');
                        $('#' + this.currentSection).closest('li').addClass('selected');
                    }
                }
            },
            mouseLeaveEl: function (option) {
                var that = this;
                var unSelect = function (section) {
                    var selectSection = $('#mainmenu-holder .selected > a').text();
                    if (selectSection === section) {
                        return;
                    } else {
                        //that.selectedId = $('#submenu-holder .selected > a').data('module-id');
                        that.mouseOver(selectSection, that.selectedId);
                        $('#mainmenu-holder .hover').not('.selected').removeClass('hover');
                    }
                };
                unSelect(option);
                //_.delay(unSelect, 1000, option);
            },
            mouseLeave: function (event) {
                this.mouseLeaveEl = _.bind(this.mouseLeaveEl, this, this.currentSection);
                this.mouseLeaveEl = _.debounce(this.mouseLeaveEl, 2000);
                this.mouseLeaveEl();
            },
            renderMenu: function (list, onMouseOver) {
                if (_.size(list) === 0) {
                    return null;
                }
                var $dom = $('<ul></ul>');

                _.each(list, function (model) {
                    var html = this.renderMenuItem(model);
                    $dom.append(html);
                    var kids = this.collection.children(model);
                    $dom.find(':last').append(this.renderMenu(kids, onMouseOver));
                }, this);
                var clickEl = $dom.find('a')[0];
                if (this.currentChildren) {
                    clickEl = $dom.find('li#' + this.currentChildren[0].get("_id") + " a")[0];
                }
                var _el = $('.selected > a').text();
                var that = this;

                //$(clickEl).click({ mouseOver: onMouseOver }, function (option) {
                $(clickEl).on("click", { mouseOver: onMouseOver }, function (option) {
                    if (_el == that.currentSection) {
                        $(clickEl).closest('li').addClass('selected');
                    }
                    if (!option.data.mouseOver) {
                        $(clickEl).closest('li').addClass('selected');
                        window.location.href = $(clickEl).attr('href');
                    }
                });
                if (!this.currentChildren) {
                   $(clickEl).click();
                }
                this.currentChildren = null;
                //var myEl = $('#submenu-holder li > a').filter(function() {
                //     return $(this).data("module-id") == selectedId
                //});
                //myEl.addClass('selected');
                return $dom;
            },

            renderMenuItem: function (model) {
                var view = new MenuItemView({ model: model });
                var elem = view.render().el;
                return elem;
            }
        });

        return LeftMenuView;
    }
)






























