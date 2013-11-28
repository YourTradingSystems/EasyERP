var App = App ||
{
    ID: {
        topMenu: "topmenu-holder",
        leftMenu: "leftmenu-holder",
        pageHolder: "body",
        wrapper: "#wrapper",
        content: "content",
        loginForm: "loginForm",
        contentHolder: "#content-holder",
        viewPanel: "top-bar",
        leftBtn: "leftBtn",
        rightBtn: "rightBtn",
        listBtn: "listBtn",
        thumbBtn: "thumbBtn",
        ganttBtn: "ganttBtn",
        ganttViewHolder: "GanttViewHolder",
        formBtn: "formBtn",
        userPanel: "loginPanel",
        changeCVClass: "changeContentView",
        changeCIClass: "changeContentIndex",
        createBtn: "#top-bar-createBtn",
        discardBtn: "#top-bar-discardBtn",
        saveBtn: "#top-bar-saveBtn",
        saveDiscardHolder: "#saveDiscardHolder",
        createBtnHolder: "#createBtnHolder",
        projectForm: "#createProjectForm",
        privacyDD: "#privacyDD",
        managerSelect: "#projectManagerDD",
        assignedToDd:"#assignedToDd",
        projectDd:"#projectDd",
        priorityDd: "#priorityDd",
        workflowDd: "#workflowsDd",
        workflowNamesDd: "#workflowNamesDd",
        managerDd: "#managerDd",
        customerDd: "#customerDd",
        userEditDd: "#userEditDd",
        companiesDd: "#companiesDd",
        salesPerson: '#salesPerson',
        salesTeam: '#salesTeam',
        workflowValue: '#workflowValue',
        relatedUsersDd: "#relatedUsersDd",
        departmentsDd: '#departmentsDd',
        jobPositionDd: '#jobPositionDd',
        coachDd: '#coachDd',
        salesPersonDd: "#salesPersonDd",
        salesTeamDd: "#salesTeamDd",
        priorityDd: "#priorityDd"

    },
    URL: {
        customers: "/Customer",
        salesPersons: "/Employees",
        salesTeam: "/Departments",
        priorities: "/Priority",
        workflows: "/Workflows?id=Lead"
    },

    requestedURL: null,
    Calendar:{
        currentCalendarId:""
    }
};

require.config({
    paths: {
        jQuery: './libs/jquery',
        ajaxForm: './libs/jquery.form',
        jqueryui: './libs/jquery-ui-1.10.3.custom.min',
        Underscore: './libs/underscore_1.5.2',
        Backbone: './libs/backbone v_1_1',
        less: './libs/less-1.4.1.min',
        templates: '../templates',
        text: './libs/text',
        common: 'common',
        dateFormat: './libs/date.format'
    },
    shim: {
        'jqueryui': ['jQuery'],
        'ajaxForm': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'less', 'jqueryui', 'ajaxForm'],
        'dateFormat': {
            exports: 'dateFormat'
        }
    }
});

require(['app'], function (app) {
    Backbone.Collection.prototype.next = function () {
        this.setElement(this.at(this.indexOf(this.getElement()) + 1));
        return this;
    };
    Backbone.Collection.prototype.prev = function() {
        this.setElement(this.at(this.indexOf(this.getElement()) - 1));
        return this;
    };
    Backbone.Collection.prototype.getElement = function (id) {
        return (id) ? this.get(id) : ((this.currentElement) ? this.currentElement : this.at(0));
    };
    Backbone.Collection.prototype.setElement = function (id, model) {
        if (arguments.length === 0) {
            this.currentElement = this.at(0);
        } else if (arguments.length === 2) {
            if (model) {
                this.currentElement = model;
            } else if (id) {
                this.currentElement = this.get(id);
            }
        } else {
            if ((typeof (id) == 'string') && id.length == 24) {
                this.currentElement = this.get(id);
            } else if (typeof (id) == 'object') {
                this.currentElement = id;
            }
        }

    };
    app.initialize();
    app.applyDefaults();
});
















