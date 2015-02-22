import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        var values = [];

        for (var i=0; i<20; i++) {
            values.push(
                Ember.Object.create({id: i})
            );
        }
        return values;
    },
    // model: function(params) {
    //     return this.store.find('box');
    // },
    setupController: function(controller, model) {
        this.controllerFor('dashboard').set('boxes', model);
    }
});
