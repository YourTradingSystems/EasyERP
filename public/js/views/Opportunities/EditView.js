define([
    "text!templates/Opportunities/EditTemplate.html",
    "text!templates/Opportunities/editSelectTemplate.html",
    "common",
    "custom"
],
    function (EditTemplate, editSelectTemplate, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = options.model;
                this.page=1;
                this.pageG=1;
                this.render();
            },

            events: {
                "click .breadcrumb a, #lost, #won": "changeWorkflow",
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers'
            },
            changeTab:function(e){
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },
            addUser:function(e){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                click: self.addUserToTable("#targetUsers")
                                $( this ).dialog( "close" );
                            }

                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                $( this ).dialog( "close" );
                            }
                        }
                    }

                });
                $("#targetUsers").unbind().on("click","li",this.removeUsers);
                $("#sourceUsers").unbind().on("click","li",this.addUsers);
                var self = this;
                $(document).on("click",".nextUserList",function(e){
                    self.page+=1
                    self.nextUserList(e,self.page)
                });
                $(document).on("click",".prevUserList",function(e){
                    self.page-=1
                    self.prevUserList(e,self.page)
                });

            },
            addGroup:function(e){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups")
                                $( this ).dialog( "close" );
                            }
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                $( this ).dialog( "close" );
                            }
                        }
                    }

                });
                $("#targetGroups").unbind().on("click","li",this.removeUsers);
                $("#sourceGroups").unbind().on("click","li",this.addUsers);
                var self = this;
                $(document).unbind().on("click",".nextGroupList",function(e){
                    self.pageG+=1
                    self.nextUserList(e,self.pageG)
                });
                $(document).unbind().on("click",".prevGroupList",function(e){
                    self.pageG-=1
                    self.prevUserList(e,self.pageG)
                });
            },
            addUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },
            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
            },
            unassign:function(e){
                var id=$(e.target).closest("tr").data("id");
                var type=$(e.target).closest("tr").data("type");
                var text=$(e.target).closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                $(e.target).closest("tr").remove();
                if ($(".groupsAndUser").find("tr").length==1){
                    $(".groupsAndUser").hide();
                }

            },
            chooseUser:function(e){
                $(e.target).toggleClass("choosen");
            },
            addUserToTable:function(id){
                $(".groupsAndUser").show();
                $(".groupsAndUser tr").each(function(){
                    if ($(this).data("type")==id.replace("#","")){
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function(){
                    $(".groupsAndUser").append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length<2){
                    $(".groupsAndUser").hide();
                }
            },
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

           
            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            selectCustomer: function (e) {
                e.preventDefault();
                var id = $(e.target).val();
                var customer = this.customersCollection.get(id).toJSON();
                if (customer.type == 'Person') {
                    this.$el.find('#company').val(customer.company.name);
                } else {
                    this.$el.find('#company').val(customer.name);
                }
                this.$el.find('#email').val(customer.email);
                this.$el.find('#phone').val(customer.phones.phone);
                this.$el.find('#mobile').val(customer.phones.mobile);
                this.$el.find('#street').val(customer.address.street);
                this.$el.find('#city').val(customer.address.city);
                this.$el.find('#state').val(customer.address.state);
                this.$el.find('#zip').val(customer.address.zip);
                this.$el.find('#country').val(customer.address.country);
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

            saveItem: function () {
                var self = this;

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    var expectedRevenueValue = $.trim($("#expectedRevenueValue").val());
                    var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                    if (expectedRevenueValue || expectedRevenueProgress) {
                        var expectedRevenue = {
                            value: expectedRevenueValue,
                            currency: '$',
                            progress: expectedRevenueProgress
                        };
                    }

                    var customerId = this.$("#customerDd option:selected").val();
                    customerId = customerId ? customerId : null;

                    var email = $.trim($("#email").val());

                    var salesPersonId = this.$("#salesPersonDd option:selected").val();
                    salesPersonId = salesPersonId ? salesPersonId : null;

                    var salesTeamId = this.$("#salesTeamDd option:selected").val();
                    salesTeamId = salesTeamId ? salesTeamId : null;

                    var nextActionDate = $.trim(this.$el.find("#nextActionDate").val());
                    var nextActionDescription = $.trim(this.$el.find("#nextActionDescription").val());
                    /*var nextActionDate = "";
                    if (nextActionSt) {
                        nextActionDate = $.trim($("#nextActionDate").val());
                    };*/
                    var nextAction = {
                        date: nextActionDate,
                        desc: nextActionDescription
                    };

                    var expectedClosing = $.trim(this.$el.find("#expectedClosing").val());
                    //var expectedClosing = "";
                    /*if (expectedClosingSt){
                        expectedClosing = $.trim($("#expectedClosing").val());
                    };*/

                    var priority = $(App.ID.priorityDd).val();

                    var internalNotes = $.trim($("#internalNotes").val());

                    var address = {};
                    $("dd").find(".address").each(function () {
                        var el = $(this);
                        address[el.attr("name")] = el.val();
                    });

                    var first = $.trim($("#first").val());
                    var last = $.trim($("#last").val());
                    var contactName = {
                        first: first,
                        last: last
                    };

                    var func = $.trim($("#func").val());

                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var fax = $.trim($("#fax").val());
                    var phones = {
                        phone: phone,
                        mobile: mobile,
                        fax: fax
                    };

                    var workflow = this.$("#workflowDd option:selected").val();
                    workflow = workflow ? workflow : null;

                    var active = ($("#active").is(":checked")) ? true : false;

                    var optout = ($("#optout").is(":checked")) ? true : false;

                    var reffered = $.trim($("#reffered").val());
                    var self = this;

                    var usersId=[];
                    var groupsId=[];
                    $(".groupsAndUser tr").each(function(){
                        if ($(this).data("type")=="targetUsers"){
                            usersId.push($(this).data("id"));
                        }
                        if ($(this).data("type")=="targetGroups"){
                            groupsId.push($(this).data("id"));
                        }

                    });
                    var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

                    this.currentModel.set({
                        name: name,
                        expectedRevenue: expectedRevenue,
                        customer: customerId,
                        email: email,
                        salesPerson: salesPersonId,
                        salesTeam: salesTeamId,
                        nextAction: nextAction,
                        expectedClosing: expectedClosing,
                        priority: priority,
                        internalNotes: internalNotes,
                        address: address,
                        contactName: contactName,
                        func: func,
                        phones: phones,
                        workflow: workflow,
                        active: active,
                        optout: optout,
                        reffered: reffered,
                        groups: {
                            owner: $("#allUsers").val(),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW: whoCanRW
                    });
                    this.currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Opportunities", { trigger: true });
                        },
                        error: function () {
                            self.hideDialog();
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
            },

            hideDialog: function () {
                $(".edit-opportunity-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            deleteItem: function(event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-opportunity-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-opportunity-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-opportunity-dialog",
                    width: 900,
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                $('#nextActionDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                var model = this.currentModel.toJSON();

                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);

                common.populateCustomers(App.ID.customerDd, App.URL.customers, model);
                common.populateEmployeesDd(App.ID.salesPersonDd, App.URL.salesPersons, model);
                common.populateDepartments(App.ID.salesTeamDd, App.URL.salesTeam, model);
                common.populatePriority(App.ID.priorityDd, App.URL.priorities, model);
                common.populateWorkflows('Opportunities', '#workflowDd', App.ID.workflowNamesDd, '/Workflows', model);

                if (model.groups)
                    if (model.groups.users.length>0||model.groups.group.length){
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='"+ item._id+"'><td>"+item.departmentName+"</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='"+item._id+"'>"+item.departmentName+"</li>");
                        });
                        model.groups.users.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='"+ item._id+"'><td>"+item.login+"</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='"+item._id+"'>"+item.login+"</li>");
                        })

                    }
               // this.delegateEvents(this.events);
                return this;
            }

        });
        return EditView;
    });
