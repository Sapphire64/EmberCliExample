import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'boxview',
    /* Box classes methods */
    colorClass: function () {
        var boxIndex = this.get('boxes').indexOf(this.get('box')) + 1;
        var colorClass;
        switch (boxIndex % 4) {
            case 0:
                colorClass = 'blue-box';
                break;
            case 2:
                colorClass = 'red-box';
                break;
            case 3:
                colorClass = 'green-box';
                break;
            default:
                colorClass = 'regular-box';
        }
        return colorClass;
    }.property('boxes', 'box'),
    sizeClass: function () {

    }.property('row'),
    /* Helper methods */
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
    }.property('box'),
});
