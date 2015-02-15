import Ember from 'ember';

export default Ember.Controller.extend({
    rows: [],
    getRowSize: function (i) {
        if (i % 3 === 1) {
            return 3;
        }
        else if (i % 3 === 2) {
            return 2;
        }
        else if (i % 3 === 0) {
            return 1;
        }
    },
    recreateRows: function () {
        var boxes = this.get('boxes');
        var rows = [];
        var createRow = Boolean(boxes.length);

        var targetRow;
        for (var i=0; i<boxes.length; i++) {
            var box = boxes[i];

            if (createRow) {
                rows.push(Ember.Object.create(
                    {
                        size: this.getRowSize(rows.length + 1),
                        boxes: Ember.A([])
                    }
                ));
            }
            targetRow = rows[rows.length-1];
            targetRow.boxes.pushObject(box);

            createRow = targetRow.get('boxes').length === targetRow.get('size');
        }
        this.set('rows', rows);
    }.observes('boxes')

});
