define([
    "text!templates/Companies/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, CompaniesCollection, EmployeesCollection, PersonsCollection, DepartmentsCollection, common, Custom,dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            imageSrc: '',

            initialize: function (options) {
                this.employeesCollection = new EmployeesCollection();
                //this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                //this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = options.collection;
                this.currentModel = this.companiesCollection.getElement();
                this.render();
            },


            events: {
                "click #tabList a": "switchTab",
                "click #contacts": "editContacts",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog"
            },

            hideDialog: function() {
                $(".edit-companies-dialog").remove();
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            editContacts: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },
            saveItem: function (event) {
                debugger;
                    event.preventDefault();
                    var self = this;
                    var mid = 39;


                    //var _salesPerson = common.toObject(salesPersonId, this.employeesCollection);
                    //var salesPerson = {};
                    //if (_salesPerson) {
                    //    salesPerson.id = _salesPerson._id;
                    //    salesPerson.name = _salesPerson.name.first + ' ' + _salesPerson.name.last;
                    //} else {
                    //    salesPerson = currentModel.defaults.salesPerson;
                    //}

                    //var _salesTeam = common.toObject(salesTeamId, this.departmentsCollection);
                    //var salesTeam = {};
                    //if (_salesTeam) {
                    //    salesTeam.id = _salesTeam._id;
                    //    salesTeam.name = _salesTeam.departmentName;
                    //} else {
                    //    salesTeam = currentModel.defaults.salesTeam;
                    //}

                  //  var date = (dateSt) ? new Date(Date.parse(dateSt)) : "";

                    var data = {
                        name: {
                            first: this.$el.find("#name").val(),
                            last: ''
                        },
                        imageSrc: this.imageSrc,
                        email: this.$el.find("#email").val(),
                        phones: {
                            phone: this.$el.find("#phone").val(),
                            mobile: this.$el.find("#mobile").val(),
                            fax: this.$el.find("#fax").val()
                        },
                        address: {
                            street: this.$el.find('#street').val(),
                            city: this.$el.find('#city').val(),
                            state: this.$el.find('#state').val(),
                            zip: this.$el.find('#zip').val(),
                            country: this.$el.find('#country').val()
                        },
                        website: this.$el.find('#website').val(),
                        internalNotes: $.trim(this.$el.find("#internalNotes").val()),

                        salesPurchases: {
                            isCustomer: this.$el.find("#isCustomer").is(":checked"),
                            isSupplier: this.$el.find("#isSupplier").is(":checked"),
                            active: this.$el.find("#active").is(":checked"),
                            salesPerson: this.$el.find('#salesPerson option:selected').val(),
                            salesTeam: this.$el.find("#salesTeam option:selected").val(),
                            reference: this.$el.find("#reference").val(),
                            language: this.$el.find("#language").val()
                        }
                    };
                console.log(data);

                this.currentModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            $(".edit-companies-dialog").remove();
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            $(".edit-companies-dialog").remove();
                            Backbone.history.navigate("home", { trigger: true });
                        }
                });
            },

            template: _.template(EditTemplate),

            populateDropDown: function(type, selectId, url){
                var selectList = $(selectId);
                var self = this;
                dataService.getData(url, {mid:39}, function(response){
                    debugger;
                    var options = $.map(response.data, function(item){
                        switch (type){
                            case "salesPerson":
                                return self.salesPersonOption(item);
                            case "salesTeam":
                                return self.salesTeamOption(item);
                        }
                    });
                    selectList.append(options);
                });
            },
            salesPersonOption: function(item){
                if (this.currentModel.get("salesPurchases").salesPerson !== null) {
                    return this.currentModel.get("salesPurchases").salesPerson._id === item._id ?
                        $('<option/>').val(item._id).text(item.name.first +' '+item.name.last).attr('selected','selected') :
                        $('<option/>').val(item._id).text(item.name.first +' '+item.name.last);
                } else {
                    return $('<option/>').val(item._id).text(item.name.first +' '+item.name.last);
                }
            },
            salesTeamOption: function(item){
                if (this.currentModel.get("salesPurchases").salesTeam !== null) {
                    return this.currentModel.get("salesPurchases").salesTeam._id === item._id ?
                        $('<option/>').val(item._id).text(item.departmentName).attr('selected','selected') :
                        $('<option/>').val(item._id).text(item.departmentName);
                } else {
                    return $('<option/>').val(item._id).text(item.departmentName);
                }
            },
            render: function () {
                console.log(this.currentModel);

                var formString = this.template({
                    model: this.currentModel.toJSON()
                });

                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:false,
                    dialogClass: "edit-companies-dialog",
                    width:"50%",
                    height:513,
                    title: 'Edit Company'
                });
                console.log(this.currentModel.get("salesPurchases"));

                this.populateDropDown("salesPerson", App.ID.salesPerson, "/getSalesPerson");
                this.populateDropDown("salesTeam", App.ID.salesTeam, "/getSalesTeam");

                this.delegateEvents(this.events);

                common.canvasDraw({ model:this.currentModel.toJSON() }, this);

                $('#date').datepicker({ dateFormat: "d M, yy" });

                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });