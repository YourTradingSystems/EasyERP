define(function () {
        var MyModel = Backbone.Model.extend({
            idAttribute: '_id'
        });

        var MenuItems = Backbone.Collection.extend({
            model: MyModel,
            url: function () {
                return "/getModules"
            },

            setCurrentModule: function (moduleName) {
                this.currentModule = moduleName;
                this.trigger('change:currentModule', this.currentModule, this);
            },

            currentModule: "HR",

            initialize: function () {

                this.fetch({
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,

            parse: function (response) {
                //console.log('parse');
                //$.each(response, function (index, val) {
                //    response[index]["id"] = response[index]["_id"];
                //    delete response[index]["_id"];
                //});
                return response;
            },

            fetchSuccess: function (collection, response) {
                console.log("fetchSuccess");
                collection.relationships();
            },

            fetchError: function (collection, response) {
                throw new Error("Not collection received from fetch");
            },

            relationships: function () {
                this.relations = _.groupBy(this.models, this.parent);
            },

            root: function () {
                if (!this.relations) this.relationships();
                return this.relations[0];
            },

            getRootElements: function () {
                var model = Backbone.Model.extend({});
                if (!this.relations) this.relationships();
                return $.map(this.relations[0], function (current) {
                    return new model({
                        _id: current.get('_id'),
                        mname: current.get('mname')
                    });
                });
            },

            children: function (model) {

                if (!this.relations) this.relationships();
                return (typeof this.relations[model["id"]] === 'undefined') ? [] : this.relations[model["id"]];
            },

            parent: function (model) {
                var parrent = model.get('parrent');
                return (!parrent) ? 0 : parrent;
            }
        });

        return MenuItems;
    });