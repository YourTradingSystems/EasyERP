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
                this.currentModel = this.companiesCollection.models[Custom.getCurrentII() - 1];
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #contacts": "editContacts",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog"
            },

            /*
            saveItem: function (event) {
                event.preventDefault();
                var self = this;

                var mid = 39;
                var companyName = $("input[name='name']").val() ? $("input[name='name']").val() : '';

                var street  = $("input[name='street']").val()  ? $("input[name='street']").val() : '';
                var city    = $("input[name='city']").val()    ? $("input[name='city']").val()   : '';
                var state   = $("input[name='state']").val()   ? $("input[name='state']").val()  : '';
                var zip     = $("input[name='zip']").val()     ? $("input[name='zip']").val()    : '';
                var country = $("input[name='country']").val() ? $("input[name='country']").val(): '';

                var website = $("input[name='website']").val()  ? $("input[name='website']").val() : '';
                var email = $("input[name='email']").val()  ? $("input[name='email']").val() : '';

                var phone  = $("input[name='phone']").val()   ? $("input[name='phone']").val()  : '';
                var mobile = $("input[name='mobile']").val()  ? $("input[name='mobile']").val() : '';
                var fax    = $("input[name='fax']").val()     ? $("input[name='fax']").val()    : '';

                var internalNotes = $("#internalNotes").val() ? $("#internalNotes").val() : '';

                var reference = $("input[id='reference']").val() ? $("input[id='reference']").val() : '';
                var date_loc      = $("input[id='text']").val()      ? $("input[id='text']").val()      : '';
                var language  = $("#language").val()             ? $("#language").val()             : '';

                var isCustomer = $('#isCustomer').is(":checked") ?  true : false;
                var isSupplier = $('#isSupplier').is(":checked") ?  true : false;
                var active     = $('#active').is(":checked")     ?  true : false;


                var idSalesPerson = this.$el.find("#salesPerson option:selected").val();
                var nameSalesPerson = this.$el.find("#salesPerson option:selected").text();

                var idSalesTeam = this.$el.find("#salesTeam option:selected").val();
                var nameSalesTeam = this.$el.find("#salesTeam option:selected").text();

                this.currentModel.save({
                    email: email,
                    name: companyName,
                    address: {
                        street: street,
                        city: city,
                        state: state,
                        zip: zip,
                        country: country
                    },
                    website: website,
                    //contacts: [],
                    phones: {
                        phone: phone,
                        mobile: mobile,
                        fax: fax
                    },
                    internalNotes: '',
                    salesPurchases: {
                        isCustomer: isCustomer,
                        isSupplier: isSupplier,
                        salesPerson: {
                            id: idSalesPerson,
                            name: nameSalesPerson
                        },
                        salesTeam: {
                            id: idSalesTeam,
                            name: nameSalesTeam
                        },
                        active: active,
                        reference: reference,
                        language: language,
                        date: date_loc
                    }
                   // history: []
                }, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            self.$el.dialog('close');
                           /* if (project.id == '0' || !project.id) {
                                Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                            } else {
                                Backbone.history.navigate("home/content-Tasks/kanban/" + project.id, { trigger: true });
                            }
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });

                //TODO add contacts, seve file, history

            }, */
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
            saveItem: function () {
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;
                    var name = $("#name").val();
                    var address = {};
                        address.street  = $("input[name='street']").val();
                        address.city    = $("input[name='city']").val();
                        address.state   = $("input[name='state']").val();
                        address.zip     = $("input[name='zip']").val();
                        address.country = $("input[name='country']").val();

                    var phones = {};
                        phones.phone = $("#phone").val();
                        phones.mobile = $("#mobile").val();
                        phones.fax = $("#fax").val();

                    var email = $("#email").val();
                    var website = $("#website").val();
                    var internalNotes = $.trim($("#internalNotes").val());
                    var salesPersonId = this.$("#salesPerson option:selected").val();
                    var _salesPerson = common.toObject(salesPersonId, this.employeesCollection);
                    var salesPerson = {};
                    if (_salesPerson) {
                        salesPerson.id = _salesPerson._id;
                        salesPerson.name = _salesPerson.name.first + ' ' + _salesPerson.name.last;
                    } else {
                        salesPerson = currentModel.defaults.salesPerson;
                    }

                    var salesTeamId = this.$("#salesTeam option:selected").val();
                    var _salesTeam = common.toObject(salesTeamId, this.departmentsCollection);
                    var salesTeam = {};
                    if (_salesTeam) {
                        salesTeam.id = _salesTeam._id;
                        salesTeam.name = _salesTeam.departmentName;
                    } else {
                        salesTeam = currentModel.defaults.salesTeam;
                    }

                    var reference = $("#reference").val();
                    var language = $("#language").val();
                    var dateSt = $.trim($("#date").val());

                    var date = (dateSt) ? new Date(Date.parse(dateSt)) : "";
                    var isCustomer = ($("#isCustomer").is(":checked")) ? true : false;
                    var isSupplier = ($("#isSupplier").is(":checked")) ? true : false;
                    var active = ($("#active").is(":checked")) ? true : false;

                    currentModel.set({
                        name: name,
                        imageSrc: this.imageSrc,
                        email: email,
                        phones: phones,
                        address: address,
                        website: website,
                        internalNotes: internalNotes,
                        salesPurchases: {
                            isCustomer: isCustomer,
                            isSupplier: isSupplier,
                            active: active,
                            salesPerson: salesPerson,
                            salesTeam: salesTeam,
                            reference: reference,
                            language: language,
                            date: date
                        }
                    });

                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            console.log(self.contentType);
                            debugger;
                            $(".edit-companies-dialog").remove();
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                }


            },
            template: _.template(EditTemplate),
            populateDropDown: function(type, selectId, url){
                var selectList = $(selectId);
                var self = this;
                dataService.getData(url, {mid:39}, function(response){
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
                return  this.currentModel.get("salesPurchases").salesPerson.id === item._id ?
                    $('<option/>').val(item._id).text(item.name.first +' '+item.name.last).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.name.first +' '+item.name.last);
            },
            salesTeamOption: function(item){
                return this.currentModel.get("salesPurchases").salesTeam.id === item._id ?
                    $('<option/>').val(item._id).text(item.departmentName).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.departmentName);
            },
            render: function () {

                var formString = this.template({
                    model: this.currentModel.toJSON()});

                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:false,
                    dialogClass: "edit-companies-dialog",
                    width:"50%",
                    height:513
                    //title: this.currentModel.toJSON().project.projectShortDesc
                });

                this.populateDropDown("salesPerson", App.ID.salesPerson, "/getSalesPerson");
                this.populateDropDown("salesTeam", App.ID.salesTeam, "/getSalesTeam");

                this.delegateEvents(this.events);
                /*
                var itemIndex = Custom.getCurrentII() - 1;
                var currentModel = this.companiesCollection.models[itemIndex];
                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection }));
                }

                common.canvasDraw({ model: currentModel.toJSON() }, this);
                 */
                $('#date').datepicker({ dateFormat: "d M, yy" });

                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });