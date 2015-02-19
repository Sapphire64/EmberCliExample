import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'boxview',
    click: function(event) {
        // Implement adding of Box logic
        console.log("Clicked on item " + event);
    },
    getBoxNeighbours: function () {
        var previousEl = this.get('previousEl');
        var nextEl = this.get('nextEl');
        if (typeof(previousEl) !== 'undefined' && typeof(nextEl) !== 'undefined') {
            return [previousEl, nextEl];
        }
        var boxes = this.get('row').get('boxes');
        var boxIndex = boxes.indexOf(this.box);
        return [boxes[boxIndex-1] || null, boxes[boxIndex+1] || null];
    },
    previousElIndex: function () {
        this.getBoxNeighbours();
        return this.get('previousEl').get('id');
    }.property(),
    nextElIndex: function () {
        this.getBoxNeighbours();
        return this.get('nextEl').get('id');
    }.property()
});
