import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'boxview',    
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
        var prevNextElems = this.getBoxNeighbours();
        var elem = prevNextElems[0];
        if (!elem) {
            return;
        }
        return elem.get('id');
    }.property('getBoxNeighbours'),
    nextElIndex: function () {
        var prevNextElems = this.getBoxNeighbours();
        var elem = prevNextElems[1];
        if (!elem) {
            return;
        }

        return elem.get('id');
    }.property('getBoxNeighbours'),
    boxId: function () {
        return this.get('box').get('id');
    }.property('box')
});
