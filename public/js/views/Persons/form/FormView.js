define([
    'text!templates/Persons/form/FormTemplate.html',
    'views/Persons/EditView',
    'views/Opportunities/compactContent',
    'views/Notes/NoteView',
    'text!templates/Notes/AddNote.html',
    'text!templates/Notes/AddAttachments.html',
    'views/Opportunities/CreateView',
    'common'
],

    function (personFormTemplate, editView, opportunitiesCompactContentView, noteView, addNoteTemplate, addAttachTemplate, createViewOpportunities, common) {
        var personTasksView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
                this.formModel = options.model;
                this.formModel.on("change", this.render, this);
                this.pageMini = 1;
                this.pageCount = 4;
                this.allMiniOpp = 0;
                this.allPages = 2;
                var self = this;
                var formModel = this.formModel.toJSON();
                common.populateOpportunitiesForMiniView("/OpportunitiesForMiniView", formModel._id, formModel.company ? formModel.company._id : null, this.pageMini, this.pageCount, true, function (opps) {
                    self.allMiniOpp = opps.listLength;
                    self.allPages = Math.ceil(self.allMiniOpp / self.pageCount);
                    if (self.allPages == self.pageMini) {
                        $(".miniPagination .next").addClass("not-active");
                        $(".miniPagination .last").addClass("not-active");
                    }
                    if (self.allPages === 1) {
                        $(".miniPagination").hide();
                    }
                });

            },

            events: {
                "click .checkbox": "checked",
                "click .person-checkbox:not(.disabled)": "personsSalesChecked",
                "click .details": "toggle",
                "mouseover .social a": "socialActive",
                "mouseout .social a": "socialNotActive",
                "click .company": "gotoCompanyForm",
                "change #inputAttach": "addAttach",
                "click #addNote": "addNote",
                "click .editDelNote": "editDelNote",
                "click #cancelNote": "cancelNote",
                "click .deleteAttach": "deleteAttach",
                "mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)": "quickEdit",
                "mouseleave .editable": "removeEdit",
                "click #editSpan": "editClick",
                "click #cancelSpan": "cancelClick",
                "click #saveSpan": "saveClick",
                "click .btnHolder .add.opportunities": "addOpportunities",
                "change .sale-purchase input": "saveCheckboxChange",
                "click .miniPagination .next:not(.not-active)": "nextMiniPage",
                "click .miniPagination .prev:not(.not-active)": "prevMiniPage",
                "click .miniPagination .first:not(.not-active)": "firstMiniPage",
                "click .miniPagination .last:not(.not-active)": "lastMiniPage"
            },
            nextMiniPage: function () {
                this.pageMini += 1;
                this.renderMiniOpp();
            },
            prevMiniPage: function () {
                this.pageMini -= 1;
                this.renderMiniOpp();
            },

            firstMiniPage: function () {
                this.pageMini = 1;
                this.renderMiniOpp();
            },

            lastMiniPage: function () {
                this.pageMini = this.allPages;
                this.renderMiniOpp();
            },

            renderMiniOpp: function () {
                var self = this;
                var formModel = this.formModel.toJSON();
                common.populateOpportunitiesForMiniView("/OpportunitiesForMiniView", formModel._id, formModel.company ? formModel.company._id : null, this.pageMini, this.pageCount, false, function (collection) {
                    var oppElem = self.$el.find('#opportunities');
                    oppElem.empty();
                    var isLast = self.pageMini == self.allPages ? true : false;
                    oppElem.append(
                        new opportunitiesCompactContentView({
                            collection: collection.data
                        }).render({ first: self.pageMini == 1 ? true : false, last: isLast, all: self.allPages }).el
                    );

                });

            },

            addOpportunities: function (e) {
                e.preventDefault();
                var model = this.formModel.toJSON();
                new createViewOpportunities({ model: model });
            },

            quickEdit: function (e) {
                var trId = $(e.target).closest("dd");
                if ($("#" + trId.attr("id")).find("#editSpan").length === 0) {
                    $("#" + trId.attr("id")).append('<span id="editSpan" class=""><a href="#">e</a></span>');
                    if ($("#" + trId.attr("id")).width() - 30 < $("#" + trId.attr("id")).find(".no-long").width()) {
                        $("#" + trId.attr("id")).find(".no-long").width($("#" + trId.attr("id")).width() - 30);
                    }
                }
            },

            removeEdit: function (e) {
                $('#editSpan').remove();
                $("dd .no-long").css({ width: "auto" });
            },

            cancelClick: function (e) {
                e.preventDefault();

                Backbone.history.fragment = "";
                Backbone.history.navigate("#easyErp/Persons/form/" + this.formModel.id, { trigger: true });
                /*       e.preventDefault();

                 var parent = $(e.target).parent().parent();

                 if ($("#" + parent[0].id).hasClass('with-checkbox')) {
                 $("#" + parent[0].id + " input").prop('disabled', true);
                 } else if (parent[0].id == 'email') {
                 $("#" + parent[0].id).append('<a href="mailto:' + this.text + '" class="no-long">' + this.text + '</a>');
                 } else {
                 $("#" + parent[0].id).prepend("<span class='no-long'>"+this.text+"</span>");
                 }
                 $("#" + parent[0].id).find(".no-long").css({width:"auto"});
                 $("#" + parent[0].id).removeClass('quickEdit');
                 $('#editInput').remove();
                 $('#cancelSpan').remove();
                 $('#saveSpan').remove();*/
            },

            editClick: function (e) {
                e.preventDefault();
                $('.quickEdit #editInput').remove();
                $('.quickEdit #cancelSpan').remove();
                $('.quickEdit #saveSpan').remove();
                if (this.prevQuickEdit) {
                    if ($('#' + this.prevQuickEdit.id).hasClass('quickEdit')) {
                        if ($('#' + this.prevQuickEdit.id).hasClass('with-checkbox')) {
                            $('#' + this.prevQuickEdit.id + ' input').prop('disabled', true).prop('checked', ($('#' + this.prevQuickEdit.id + ' input').prop('checked') ? 'checked' : ''));
                            $('.quickEdit').removeClass('quickEdit');
                        } else if (this.prevQuickEdit.id == 'email') {
                            $("#" + this.prevQuickEdit.id).append('<a href="mailto:' + this.text + '">' + this.text + '</a>');
                            $('.quickEdit').removeClass('quickEdit');
                        } else {
                            $('.quickEdit').text(this.text ? this.text : "").removeClass('quickEdit');
                        }
                    }
                }
                var parent = $(e.target).parent().parent();
                $("#" + parent[0].id).addClass('quickEdit');
                $('#editSpan').remove();
                var objIndex = parent[0].id.split('_');
                // this.text =  $('#' + parent[0].id).text();
                //console.log(this.formModel.get("phones").phone);

                if (objIndex.length > 1) {
                    this.text = this.formModel.get(objIndex[0])[objIndex[1]];
                    console.log(this.text);
                } else {
                    this.text = this.formModel.get(objIndex[0]);
                }

                if (parent[0].id == 'dateBirth') {
                    $("#" + parent[0].id).text('');
                    $("#" + parent[0].id).append('<input id="editInput" maxlength="48" type="text" readonly class="left has-datepicker"/>');
                    $('.has-datepicker').datepicker({
                        dateFormat: "d M, yy",
                        changeMonth: true,
                        changeYear: true,
                        yearRange: '-100y:c+nn',
                        maxDate: '-18y'
                    });
                } else if ($("#" + parent[0].id).hasClass('with-checkbox')) {
                    $("#" + parent[0].id + " input").removeAttr('disabled');
                } else {
                    $("#" + parent[0].id).text('');
                    $("#" + parent[0].id).append('<input id="editInput" maxlength="48" type="text" class="left"/>');
                }
                $('#editInput').val(this.text);
                this.prevQuickEdit = parent[0];
                $("#" + parent[0].id).append('<span id="saveSpan"><a href="#">c</a></span>');
                $("#" + parent[0].id).append('<span id="cancelSpan"><a href="#">x</a></span>');
                $("#" + parent[0].id).find("#editInput").width($("#" + parent[0].id).find("#editInput").width() - 40);
            },
            saveCheckboxChange: function (e) {
                var parent = $(e.target).parent();
                var objIndex = parent[0].id.replace('_', '.');
                currentModel = this.model;
                currentModel[objIndex] = ($("#" + parent[0].id + " input").prop("checked"));
                this.formModel.save(currentModel, {
                    headers: {
                        mid: 39
                    },
                    patch: true
                });
            },
            saveClick: function (e) {
                e.preventDefault();
                var parent = $(e.target).parent().parent();
                var objIndex = parent[0].id.split('_'); //replace change to split;
                var currentModel = this.model;
                var newModel = {};

                if (objIndex.length > 1) {
                    var param = currentModel.get(objIndex[0]) || {};
                    param[objIndex[1]] = $.trim($('#editInput').val());
                    newModel = currentModel.set(objIndex[0], param);

                } else {
                    newModel = currentModel.set(objIndex[0], $.trim($('#editInput').val()));

                }
                this.formModel.urlRoot = '/Persons/';
                this.formModel.save(newModel, {
                    headers: {
                        mid: 39
                    },
                    wait: true,

                    success: function (model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Persons/form/" + model.id, { trigger: true });
                    }

                });
                Backbone.history.fragment = "";
                Backbone.history.navigate("#easyErp/Persons/form/" + this.formModel.id, { trigger: true });
                /*  if ($("#" + parent[0].id).hasClass('with-checkbox')) {
                 $("#" + parent[0].id + " input").prop('disabled', true);
                 } else if (parent[0].id == 'email') {
                 $("#" + parent[0].id).append('<a href="mailto:' + this.text + '" class="no-long">' + this.text + '</a>');
                 } else {
                 $("#" + parent[0].id).prepend("<span class='no-long'>"+this.text+"</span>");
                 }*/

            },


            cancelNote: function () {
                $('#noteArea').val('');
                $('#noteTitleArea').val('');
                $('#getNoteKey').attr("value", '');
            },

            editDelNote: function (e) {
                var id = e.target.id;
                var k = id.indexOf('_');
                var type = id.substr(0, k);
                var id_int = id.substr(k + 1);
                var currentModel = this.formModel;
                var notes = currentModel.get('notes');

                switch (type) {
                    case "edit":
                        {
                            $('#noteArea').val($('#' + id_int).find('.noteText').text());
                            $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                            $('#getNoteKey').attr("value", id_int);
                            break;
                        }
                    case "del":
                        {

                            var newNotes = _.filter(notes, function (note) {
                                if (note._id != id_int) {
                                    return note;
                                }
                            });
                            if (confirm("You realy want to remove note? ")) {
                                currentModel.save({ 'notes': newNotes },
                                    {
                                        headers: {
                                            mid: 39
                                        },
                                        patch: true,
                                        success: function () {
                                            $('#' + id_int).remove();
                                        }
                                    });
                            }
                            break;
                        }
                }
            },

            addNote: function (e) {
                e.preventDefault();
                var val = $('#noteArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                var title = $('#noteTitleArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                if (val || title) {
                    var formModel = this.formModel;
                    var notes = formModel.get('notes');
                    var arrKeyStr = $('#getNoteKey').attr("value");
                    var noteObj = {
                        note: '',
                        title: ''
                    };
                    if (arrKeyStr) {
                        var editNotes = _.map(notes, function (note) {
                            if (note._id == arrKeyStr) {
                                note.note = val;
                                note.title = title;
                            }
                            return note;
                        });
                        formModel.save({ 'notes': editNotes },
                            {
                                headers: {
                                    mid: 39
                                },
                                patch: true,
                                success: function () {
                                    $('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                    $('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                    $('#getNoteKey').attr("value", '');
                                }
                            });
                    } else {
                        noteObj.note = val;
                        noteObj.title = title;
                        notes.push(noteObj);
                        formModel.save({ 'notes': notes },
                            {
                                headers: {
                                    mid: 39
                                },
                                patch: true,
                                wait: true,
                                success: function (models, data) {
                                    $('#noteBody').empty();
                                    data.notes.forEach(function (item) {
                                        /*                                    	   var key = notes.length - 1;
                                         var notes_data = response.notes;
                                         var date = common.utcDateToLocaleDate(response.notes[key].date);
                                         var author = currentModel.get('name').first;
                                         var id = response.notes[key]._id;
                                         $('#noteBody').prepend(_.template(addNoteTemplate, { val: val, title: title, author: author, data: notes_data, date: date, id: id }));*/
                                        var date = common.utcDateToLocaleDate(item.date);
                                        //notes.push(item);
                                        $('#noteBody').prepend(_.template(addNoteTemplate, { id: item._id, title: item.title, val: item.note, author: item.author, date: date }));
                                    });
                                }
                            });
                    }
                    $('#noteArea').val('');
                    $('#noteTitleArea').val('');
                }
            },

            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.formModel;
                var currentModelId = currentModel["id"];
                var addFrmAttach = $("#addAttachments");
                var addInptAttach = $("#inputAttach")[0].files[0];

                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');

                    var formURL = "http://" + window.location.host + "/uploadFiles";
                    e.preventDefault();
                    addFrmAttach.ajaxSubmit({
                        url: formURL,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: [addInptAttach],

                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("id", currentModelId);
                            status.show();
                            var statusVal = '0%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },

                        uploadProgress: function (event, position, total, statusComplete) {
                            var statusVal = statusComplete + '%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },

                        success: function (data) {
                            var attachments = currentModel.get('attachments');
                            attachments.length = 0;
                            $('.attachContainer').empty();
                            data.data.attachments.forEach(function (item) {
                                var date = common.utcDateToLocaleDate(item.uploadDate);
                                attachments.push(item);
                                $('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
                            });
                            addFrmAttach[0].reset();
                            status.hide();
                        },

                        error: function () {
                            console.log("Attach file error");
                        }
                    });
                });
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },

            fileSizeIsAcceptable: function (file) {
                if (!file) {
                    return false;
                }
                return file.size < App.File.MAXSIZE;
            },

            deleteAttach: function (e) {
                var target = $(e.target);
                if (target.closest("li").hasClass("attachFile")) {
                    target.closest(".attachFile").remove();
                } else {
                    var id = e.target.id;
                    var currentModel = this.formModel;
                    var attachments = currentModel.get('attachments');
                    var newAttachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    var fileName = $('.attachFile_' + id + ' a')[0].innerHTML;
                    currentModel.save({ 'attachments': newAttachments, fileName: fileName },
                        {
                            headers: {
                                mid: 39
                            },
                            patch: true,//Send only changed attr(add Roma)
                            success: function () {
                                $('.attachFile_' + id).remove();
                            }
                        });
                }
            },

            editItem: function () {
                //create editView in dialog here
                new editView({ collection: this.collection });
            },

            personsSalesChecked: function (e) {
                if ($(e.target).get(0).tagName.toLowerCase() == "span") {
                    $(e.target).parent().toggleClass("active");
                } else {
                    $(e.target).toggleClass("active");
                }
            },

            gotoCompanyForm: function (e) {
                e.preventDefault();
                var id = $(e.target).closest("a").attr("data-id");
                window.location.hash = "#easyErp/Companies/form/" + id;
            },

            toggle: function () {
                this.$('#details').animate({
                    height: "toggle"
                }, 250, function () {

                });
            },

            socialActive: function (e) {
                e.preventDefault();
                $(e.target).stop().animate({
                    'background-position-y': '-38px'

                }, 300, function () {
                });
            },
            socialNotActive: function (e) {
                e.preventDefault();
                $(e.target).stop().animate({
                    'background-position-y': '0px'
                }, 300, function () {
                });
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                var el = this.$el;
                el.html(_.template(personFormTemplate, formModel));
                this.renderMiniOpp();
                el.find('.formLeftColumn').append(
                    new noteView({
                        model: this.formModel
                    }).render().el
                );
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new editView({ model: this.formModel });
            },

            deleteItems: function () {
                var mid = 39;
                this.formModel.urlRoot = "/Persons";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Persons/thumbnails", { trigger: true });
                    },
                    error: function (model, err) {
                        if (err.status === 403) {
                            alert("You do not have permission to perform this action");
                        }
                    }
                });

            }
        });

        return personTasksView;
    });
