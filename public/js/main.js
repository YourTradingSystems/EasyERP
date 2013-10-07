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
        managerSelect: "#projectManagerDD"
    },
    requestedURL: null
};

require.config({
    paths: {
        jQuery: './libs/jquery',
        jqueryui: './libs/jquery-ui-1.10.3.custom.min',
        Underscore: './libs/underscore',
        Backbone: './libs/backbone',
        less: './libs/less-1.4.1.min',
        templates: '../templates',
        text: './libs/text'
    },
    shim: {
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'less']
    }
});

require(['app'], function (app) {
    app.initialize();
});
















