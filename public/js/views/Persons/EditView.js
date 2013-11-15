define([
    "text!templates/Persons/EditTemplate.html",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            contentType: "Persons",
            imageSrc: '',
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render");
                //this.renderView = _.after(2, this.render);
                this.personsCollection = options.collection;
                //this.companiesCollection = new CompaniesCollection();
                //this.departmentsCollection = new DepartmentsCollection();
                //this.departmentsCollection.bind('reset', _.bind(this.renderView, this));
                //this.companiesCollection.bind('reset', _.bind(this.renderView, this));
                this.currentModel = this.personsCollection.models[Custom.getCurrentII()-1];
                this.render();

            },
            events: {
                "click #saveBtn" : "saveItem",
                "click #cancelBtn" : "hideDialog"
            },
            hideDialog: function(){
                $('.edit-person-dialog').remove();
            },

            saveItem: function (event) {
                event.preventDefault();
                var self = this;
                var mid = 39;

                var dateBirthSt = $.trim($("#dateBirth").val());
                var dateBirth = "";
                if (dateBirthSt) {
                    dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                }

                var data = {
                    imageSrc: this.imageSrc,
                    name: {
                        first: $('#firstName').val(),
                        last: $('#lastName').val()
                    },
                    dateBirth: dateBirth,
                    department: {
                        id: $("#department option:selected").val(),
                        name: $("#department option:selected").text()
                    },
                    company: {
                        id: $('#companiesDd option:selected').val(),
                        name: $('#companiesDd option:selected').text()
                    },
                    address: {
                        street: $('#addressInput').val(),
                        city: $('#cityInput').val(),
                        state: $('#stateInput').val(),
                        zip: $('#zipInput').val(),
                        country: $('#countryInput').val()
                    },
                    website: $('#websiteInput').val(),
                    jobPosition: $('#jobPositionInput').val(),
                    skype: $('#skype').val(),
                    phones: {
                        phone: $('#phoneInput').val(),
                        mobile: $('#mobileInput').val(),
                        fax: $('#faxInput').val()
                    },
                    email: $('#emailInput').val(),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is('checked')
                    }
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        self.$el.dialog('close');
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        if (xhr && xhr.status === 401) {
                            Backbone.history.navigate("login", { trigger: true });
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }
                });


            },

            populateDropDown: function(type, selectId, url){
                var selectList = $(selectId);
                var self = this;
                dataService.getData(url, {mid:39, id:"Task"}, function(response){
                    var options = $.map(response.data, function(item){
                        switch (type){
                            case "project":
                                return self.projectOption(item);
                            case "company":
                                return self.companyOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "workflow":
                                return self.workflowOption(item);
                        }
                    });
                    selectList.append(options);
                });
            },
            workflowOption: function(item){
                return this.currentModel.get("workflow").id === item._id ?
                    $('<option/>').val(item._id).text(item.name + "(" + item.status + ")").attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.name + "(" + item.status + ")");
            },
            projectOption: function(item){
                return this.currentModel.get("project").id === item._id ?
                    $('<option/>').val(item._id).text(item.projectName).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.projectName);
            },
            companyOption: function(item){
                return (this.currentModel.get('company') && this.currentModel.get('company').id === item._id) ?
                    $('<option/>').val(item._id).text(item.name).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.name);
            },
            render: function () {
               console.log('render persons dialog');
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                    companiesCollection: this.companiesCollection,
                    departmentsCollection: this.departmentsCollection
                });
                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:false,
                    title: "Edit Person",
                    dialogClass: "edit-person-dialog"
                });
                this.populateDropDown("company", App.ID.companiesDd, "/Companies");
                //this.populateDropDown("person", App.ID.assignedToDd, "/getPersonsForDd");

                this.delegateEvents(this.events);

                common.canvasDraw({ model:this.currentModel.toJSON() }, this);

                $('#dateBirth').datepicker({
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
                return this;
            }

        });

        return EditView;
    });