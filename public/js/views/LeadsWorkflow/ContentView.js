define([
    'text!templates/LeadsWorkflow/list/ListTemplate.html',
    'text!templates/LeadsWorkflow/form/FormTemplate.html',
    'text!templates/LeadsWorkflow/CreateTemplate.html',
    'collections/LeadsWorkflow/LeadsWorkflowCollection',
    "collections/RelatedStatuses/RelatedStatusesCollection",
    'custom',
    'common'
],
function (ListTemplate, FormTemplate, CreateTemplate, LeadsWorkflowCollection, RelatedStatusesCollection, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        selectedLead:"",
        template: _.template(FormTemplate),
        leadNamesForList:[],
        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.relatedStatusesCollection = new RelatedStatusesCollection();
            if(this.collection.length > 0)
                this.selectedLead = this.collection.models[0].toJSON();
            this.render();
        },

        getLeadNamesForList: function(){
            return _.map(this.collection.toJSON(), function(lead){
                return {
                    wId: lead.wId,
                    name: lead.name
                }
            });
        },

        events: {
            "click .checkbox": "checked" ,
            "click td:not(:has('input[type='checkbox']'))": "gotoForm",
            "click .leadsWorkflow": "leadSelect"
        },

        createItem:function(){
            var formString = _.template(CreateTemplate, {relatedStatusesCollection:this.relatedStatusesCollection.toJSON()});
            $(formString).dialog({
                title:"Create Lead"
            });
            //this.el = $('#.')
        },

        leadSelect: function(event){
            event.preventDefault();
            var leadName = event.currentTarget.innerHTML.trim();
            this.selectedLead = this.collection.findWhere({name: leadName}).toJSON();
            this.render();
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-LeadsWorkflow/form/" + itemIndex;
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Departments View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        var list = this.getLeadNamesForList();
                        this.$el.html(_.template(ListTemplate, {leadsList:this.getLeadNamesForList(), selectedLead:this.selectedLead}));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
            }
            return this;

        },

        checked: function () {
            if(this.collection.length > 0){
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }
        },

        deleteItems: function () {
            var self = this,
               mid = 39,
               model,
               viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = self.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                        });

                        this.collection.trigger('reset');
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                Backbone.history.navigate("#home/content-LeadsWorkflow", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
