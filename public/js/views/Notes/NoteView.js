/**
 * Created with JetBrains PhpStorm.
 * User: Ivan
 * Date: 13.11.13
 * Time: 11:28
 * To change this template use File | Settings | File Templates.
 */
define([
    'text!templates/Notes/NoteTemplate.html',
    'custom'

], function (NoteTemplate, Custom) {
    var NoteView = Backbone.View.extend({
        initialize: function() {
        },

        template: _.template(NoteTemplate),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return NoteView;
});
