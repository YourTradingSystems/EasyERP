define([
    "custom",
    "models/ProjectModel",
    "models/TaskModel",
    "collections/Projects/ProjectsCollection",
    "collections/Tasks/TasksCollection"

], function (Custom, ProjectModel, TaskModel, ProjectsCollection, TasksCollection) {

    var tasksCollection, projectsCollection, updateEventId, deleteEventId, changeEventId;

    var create = function (chartContainerId) {
        loadDefaultOptions();
        gantt.init(chartContainerId);
        gantt.clearAll();
        /*tasksCollection = new TasksCollection();
        projectsCollection = new ProjectsCollection();

        if (!gantt.checkEvent("onAfterTaskUpdate")) {
            updateEventId = gantt.attachEvent("onAfterTaskUpdate", onTaskUpdateHandler);
        }
        if (!gantt.checkEvent("onAfterTaskDelete")) {
            deleteEventId = gantt.attachEvent("onAfterTaskDelete", onTaskDeleteHandler);
        }
        if (!gantt.checkEvent("onBeforeTaskChanged")) {
            changeEventId = gantt.attachEvent("onBeforeTaskChanged", onTaskChangeHandler);
        }*/
    };

    var onTaskChangeHandler = function (id, mode, task) {
        if (task.parent) {

        }
    }

    var onTaskDeleteHandler = function (id, item) {
        if (item.parent) {
            if (item.parent == 1) {
                return;
            }
            var taskToDelete = tasksCollection.get(id);
            if (taskToDelete)
                deleteTask(taskToDelete);
        } else {
            var projectToDelete = projectsCollection.get(id);
            if (projectToDelete) {
                deleteProject(projectToDelete);
            }
        }
    }

    var deleteTask = function (task) {
        var mid = 39;
        task.destroy({
            headers: {
                mid: mid
            }
        });
    }

    var deleteProject = function (project) {
        var mid = 39;
        project.destroy({
            headers: {
                mid: mid
            }
        });
    }

    var onTaskUpdateHandler = function (id, item) {
        var updatedTask = gantt.getTask(id);
        var mid = 39;

        if (updatedTask.parent) {
            var task = tasksCollection.get(id);
            var parentProjectId = gantt.getTask(id).parent;
            var totalduration = 0;
            gantt.eachTask(function (task) {
                totalduration += task.duration;
            }, parentProjectId);
            gantt.getTask(parentProjectId).duration = totalduration;
            gantt.detachEvent(eventId);
            gantt.updateTask(parentProjectId);
            gantt.attachEvent("onAfterTaskUpdate");
            task.save({
                summary: item.text,
                extrainfo: {
                    StartDate: item.start_date,
                    EndDate: item.end_date
                },
                estimated: item.duration
            }, {
                headers: {
                    mid: mid
                }
            });
        } else {
            var project = projectsCollection.get(id);
            project.save({
                summary: item.text,
                info: {
                    StartDate: item.start_date,
                    EndDate: item.end_date
                }
            }, {
                headers: {
                    mid: mid
                }
            });
        }
    };

    var parseProjects = function (jsonCollection) {
        var array = Custom.convertProjectsCollectionForGantt(jsonCollection);
        if (array.data.length > 0) gantt.parse(array);
    };

    var parseTasks = function (jsonCollection) {
            var array = Custom.convertTasksCollectionForGantt(jsonCollection);
        if (array.data.length > 0) gantt.parse(array);
    }

    var loadDefaultOptions = function () {
        gantt.config.scale_unit = "month";
        gantt.config.step = 1;
        gantt.config.readonly = true;
        gantt.config.date_scale = "%F";
        gantt.config.scale_height = 50;
        gantt.config.row_height = 20;
        gantt.config.drag_resize = false;
        gantt.config.min_column_width = 30;
        gantt.config.grid_width = 200;
        gantt.config.columns = [
            { name: "assignedTo", label: "Name / AssignedTo", tree: true }
        ];
        gantt.config.task_scroll_offset = 140;
        gantt.config.subscales = [
            {unit:"day", step:1, date: "%d", css: scaleStyle}
        ];
        var scaleStyle = function(date){
            return "";
        };

        //gantt.templates.

        gantt.templates.scale_cell_class = function (date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
                return "weekend";
            }
            //return "ordinaryDay";
        };
        gantt.templates.task_cell_class = function (item, date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
                return "weekend";
            }
            //return "ordinaryDay";
        }


        /*gantt.templates.tooltip_text = function(start, end, task){
            return "<b>Start date: </b>" + task.start_date + "<br/>" +
                "<b>End date: </b>" + task.end_date;
        };*/
        /*gantt.templates.leftside_text = function(start, end, task){
            return "<b>Progress: </b>" + task.progress * 100 + "%";
        };*/



    };
    return {
        create: create,
        parseProjects: parseProjects,
        parseTasks: parseTasks
    }
});