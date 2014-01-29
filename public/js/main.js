var App = App ||
{
    File: {
        MAXSIZE: 3145728,  //size in kilobytes  = 3 MB
        MaxFileSizeDisplay: "3 MB"
    },
    requestedURL: null,
    Calendar: {
        currentCalendarId: ""
    }
};

require.config({
    paths: {
        jQuery: './libs/jquery-2.0.3.min.map',
        ajaxForm: './libs/jquery.form',
        imageCrop: './libs/jquery.Jcrop.min',
        jqueryui: './libs/jquery-ui.min',
        Underscore: './libs/underscore-min.map',
        Backbone: './libs/backbone-min.map',
        less: './libs/less.min',
        templates: '../templates',
        text: './libs/text',
        common: 'common',
        dateFormat: './libs/date.format',
        d3: './libs/d3.v3.min'
    },
    shim: {
        'jqueryui': ['jQuery'],
        'ajaxForm': ['jQuery'],
        'imageCrop': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'less', 'jqueryui', 'ajaxForm', 'imageCrop'],
        'd3': {
            exports: 'd3'
        },
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
    Backbone.Collection.prototype.prev = function () {
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

    Backbone.View.prototype.pageElementRender = function (totalCount, itemsNumber) {
        //var itemsNumber = this.defaultItemsNumber;
        $("#itemsNumber").text(itemsNumber);

        if (totalCount == 0 || totalCount == undefined) {
            $("#grid-start").text(0);
            $("#grid-end").text(0);
            $("#grid-count").text(0);
            $("#previousPage").prop("disabled", true);
            $("#nextPage").prop("disabled", true);
            $("#pageList").empty();
            $("#currentShowPage").val(0);
            $("#lastPage").text(0);
        } else {
            $("#grid-start").text(1);
            if (totalCount <= itemsNumber) {
                $("#grid-end").text(totalCount);
            } else {
                $("#grid-end").text(itemsNumber);
            }
            $("#grid-count").text(totalCount);
            $("#pageList").empty();
            var pageNumber = Math.ceil(totalCount / itemsNumber);
            for (var i = 1; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>')
            }
            $("#lastPage").text(pageNumber);
            $("#currentShowPage").val(1);
            $("#previousPage").prop("disabled", true);
            if (pageNumber <= 1) {
                $("#nextPage").prop("disabled", true);
            } else {
                $("#nextPage").prop("disabled", false);
            }
        }
    };
    
    Backbone.View.prototype.prevP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
        var currentShowPage = $("#currentShowPage");
        var page = parseInt(currentShowPage.val()) - 1;

        this.startTime = new Date();

        currentShowPage.val(page);
        if (page === 1) {
            $("#previousPage").prop("disabled", true);
        }
        $("#grid-start").text((page - 1) * itemsNumber + 1);
        if (this.listLength <= page * itemsNumber) {
            $("#grid-end").text(this.listLength);
        } else {
            $("#grid-end").text(page * itemsNumber);
        }
        $("#nextPage").prop("disabled", false);
        var serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) serchObject = _.extend(dataObject);
        this.collection.showMore(serchObject);
    };

    Backbone.View.prototype.nextP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
        var page = parseInt($("#currentShowPage").val()) + 1;

        this.startTime = new Date();

        $("#currentShowPage").val(page);
        $("#grid-start").text((page - 1) * itemsNumber + 1);
        if (this.listLength <= page * itemsNumber) {
            $("#grid-end").text(this.listLength);
            $("#nextPage").prop("disabled", true);
        } else {
            $("#grid-end").text(page * itemsNumber);
        }
        $("#previousPage").prop("disabled", false);
        var serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) serchObject = _.extend(dataObject);
        this.collection.showMore(serchObject);
    };

    Backbone.View.prototype.showP = function (event, dataObject) {
        this.startTime = new Date();
        if (this.listLength == 0) {
            $("#currentShowPage").val(0);
        } else {
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt(event.target.textContent);
            if (!page) {
                page = $(event.target).val();
            }
            var adr = /^\d+$/;
            var lastPage = parseInt($('#lastPage').text());

            if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                page = 1;
            }
            $("#currentShowPage").val(page);
            $("#grid-start").text((page - 1) * itemsNumber + 1);
            if (this.listLength <= page * itemsNumber) {
                $("#grid-end").text(this.listLength);
            } else {
                $("#grid-end").text(page * itemsNumber);
            }
            if (page <= 1) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", false);
            }
            if (page >= lastPage) {
                $("#nextPage").prop("disabled", true);
                $("#previousPage").prop("disabled", false);
            }
            if ((1 < page) && (page < lastPage)) {
                $("#nextPage").prop("disabled", false);
                $("#previousPage").prop("disabled", false);
            }
            if ((page == lastPage) && (lastPage == 1)) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
            }
            var serchObject = {
                count: itemsNumber,
                page: page,
                letter: this.selectedLetter
            };
            if (dataObject) serchObject = _.extend(dataObject);
            this.collection.showMore(serchObject);
        }
    };

    Backbone.View.prototype.deleteRender = function (deleteCounter, deletePage, dataObject) {
        this.startTime = new Date();
        $("#top-bar-deleteBtn").hide();
        var itemsNumber = parseInt($("#itemsNumber").text());

        if (deleteCounter == this.collectionLength) {
            var pageNumber = Math.ceil(this.listLength / itemsNumber);
            if (deletePage > 1) {
                deletePage = deletePage - 1;
            }
            if ((deletePage == 1) && (pageNumber > 1)) {
                deletePage = 1;
            }
            if (((deletePage == 1) && (pageNumber == 0)) || (deletePage == 0)) {
                deletePage = 0;
            }

            if (deletePage == 0) {
                $("#grid-start").text(0);
                $("#grid-end").text(0);
                $("#grid-count").text(0);
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
                $("#currentShowPage").val(0);
                $("#lastPage").text(0);
                $("#pageList").empty();
                $("#listTable").empty();
                $("#startLetter .current").removeClass("current").addClass("empty");
            } else {
                $("#grid-start").text((deletePage - 1) * itemsNumber + 1);
                $("#grid-end").text(deletePage * itemsNumber);
                $("#grid-count").text(this.listLength);
                $("#currentShowPage").val(deletePage);
                $("#pageList").empty();

                for (var i = 1; i <= pageNumber; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>')
                }
                $("#lastPage").text(pageNumber);

                if (deletePage <= 1) {
                    $("#previousPage").prop("disabled", true);
                    $("#nextPage").prop("disabled", false);
                }
                if (deletePage >= pageNumber) {
                    $("#nextPage").prop("disabled", true);
                    $("#previousPage").prop("disabled", false);
                }
                if ((1 < deletePage) && (deletePage < pageNumber)) {
                    $("#nextPage").prop("disabled", false);
                    $("#previousPage").prop("disabled", false);
                }
                if ((deletePage == pageNumber) && (pageNumber == 1)) {
                    $("#previousPage").prop("disabled", true);
                    $("#nextPage").prop("disabled", true);
                }
                var serchObject = {
                    count: itemsNumber,
                    page: deletePage
                };
                if (dataObject) serchObject = _.extend(dataObject);
                this.collection.showMore(serchObject);
            }
            $('#check_all').prop('checked', false);
        } else {
            $("#listTable").empty();
            $("#grid-start").text((deletePage - 1) * itemsNumber + 1);
            $("#grid-end").text((deletePage - 1) * itemsNumber + this.collectionLength - deleteCounter);
            $("#grid-count").text(this.listLength);
            $("#currentShowPage").val(deletePage);

            $("#pageList").empty();
            var pageNumber = Math.ceil(this.listLength / itemsNumber);
            for (var i = 1; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>')
            }
            $("#lastPage").text(pageNumber);

            if (deletePage <= 1) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", false);
            }
            if (deletePage >= pageNumber) {
                $("#nextPage").prop("disabled", true);
                $("#previousPage").prop("disabled", false);
            }
            if ((1 < deletePage) && (deletePage < pageNumber)) {
                $("#nextPage").prop("disabled", false);
                $("#previousPage").prop("disabled", false);
            }
            if ((deletePage == pageNumber) && (pageNumber == 1)) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
            }
            $('#timeRecivingDataFromServer').remove();
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        }
    };

    app.initialize();
    app.applyDefaults();
});
