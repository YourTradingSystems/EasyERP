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
            setCurrentSection: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.render();
            },
            mouseOver: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.render(true);
            },

            initialize: function (options) {
                console.log("init MenuView");
                if (!options.collection) throw "No collection specified!";
                this.collection = options.collection;
                _.bindAll(this, 'render');
                this.render();
                this.collection.bind('reset', _.bind(this.render, this));
            },

            render: function (onMouseOver) {
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
                return this;
            },

            events: {
                "click a": "selectMenuItem",
                "mouseover a": "hoverItem"
            },
            hoverItem: function (e) {
                console.log('hover');
            },
            selectMenuItem: function (e) {
                this.$('li.hover').removeClass('hover');
                $(e.target).closest('li').addClass('hover');

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
                var _el = $('.selected > a').text();
                var that = this;
                
                $(clickEl).click({ mouseOver: onMouseOver }, function (option) {
                    if (_el == that.currentSection) {
                        $(clickEl).closest('li').addClass('hover');
                    }
                    if (!option.data.mouseOver) {
                        $(clickEl).closest('li').addClass('hover');
                        clickEl.click();
                    }
                });
                $(clickEl).click();
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






























