define([
    'text!templates/Attachments/AttachmentsTemplate.html',
    'custom'

], function (AttachmentsTemplate, Custom) {
    var AttachmenstView = Backbone.View.extend({
        initialize: function() {
        },

        template: _.template(AttachmentsTemplate),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return AttachmenstView;
});
