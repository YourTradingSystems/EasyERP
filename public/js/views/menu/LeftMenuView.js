define([
    'views/menu/MenuItem',
    'collections/menu/MenuItems'
],
    function (MenuItemView) {

        var LeftMenuView = Backbone.View.extend({
            tagName: 'nav',
            className: 'menu',
            el: '#leftmenu-holder nav',
            currentSection: null,
            setCurrentSection: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.render(true);
            },
            mouseOver: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.render(false);
            },

            initialize: function (options) {
                console.log("init MenuView");
                if (!options.collection) throw "No collection specified!";
                this.collection = options.collection;
                _.bindAll(this, 'render');
                this.render();
                this.collection.bind('reset', _.bind(this.render, this));
            },

            render: function (options) {
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
                var mousOver = (options) ? options : false;
                if (currentModule == null) currentModule = root[0];
                var elem = $el.append(this.renderMenu(this.collection.children(currentModule), mousOver));
                return this;
            },

            events: {
                "click a": "selectMenuItem"
            },

            selectMenuItem: function (e) {
                this.$('li.hover').removeClass('hover');
                $(e.target).closest('li').addClass('hover');

            },

            renderMenu: function (list, mouseOver) {
                if (_.size(list) === 0) {
                    return null;
                }
                var $dom = $('<ul></ul>');

                _.each(list, function (model) {
                    var html = this.renderMenuItem(model);

                    $dom.append(html);
                    var kids = this.collection.children(model);
                    $dom.find(':last').append(this.renderMenu(kids));
                }, this);
                if (mouseOver) {
                    var clickEl = $($dom).find('a')[0];
                    $($dom.find('a')[0]).click(function () {
                        $(clickEl).closest('li').addClass('hover');

                    });
                    $($dom).find('a')[0].click();
                    //$($dom.find('a')[0]).trigger('click');
                }
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






























