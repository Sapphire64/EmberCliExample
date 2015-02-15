import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return [
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
            Ember.Object.create({}),
        ];
    },
    setupController: function(controller, model) {
        this.controllerFor('dashboard').set('boxes', model);
    }
});
