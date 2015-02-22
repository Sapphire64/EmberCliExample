import Ember from 'ember';

export default Ember.Controller.extend({
    /* Expected for next structure of rows:
         1 2 3
         4 5
         6
         7 8 9
         10 11
         12
     */
    actions: {
        addNewBox: function (parentBox){
            var boxes = this.get('boxes');
            var indexOfBox = boxes.indexOf(parentBox);
            var currentBoxCnt = this.get('boxIndex') + 1;
            var newBox = Ember.Object.create({id: currentBoxCnt});

            boxes.splice(indexOfBox + 1, 0, newBox);

            this.set('boxes', boxes);
            this.set('boxIndex', currentBoxCnt);
            this.recreateRows();
        },
        removeBox: function (box) {
            var boxes = this.get('boxes');
            var indexOfBox = boxes.indexOf(box);

            boxes.splice(indexOfBox, 1);

            this.set('boxes', boxes);
            this.recreateRows();
        }
    },
    /* Hardwiring box index for current dummy data,
       see routes to find why this number */
    boxIndex: 19,

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
                        boxes: Ember.A([]),
                    }
                ));
            }
            targetRow = rows[rows.length-1];
            targetRow.boxes.pushObject(box);

            createRow = targetRow.get('boxes').length === targetRow.get('size');
        }
        this.set('rows', rows);
    }.observes('boxes'),
    getRowByBoxIndex: function (boxIndex) {
        var rowShiftIndex = Math.floor(boxIndex / 6) * 3;
        var rowInnerIndex = boxIndex % 6;
        var rowIndex;

        if ([0,1,2].indexOf(rowInnerIndex) !== -1) {
            rowIndex = 0;
        }
        else if ([3,4].indexOf(rowInnerIndex) !== -1) {
            rowIndex = 1;
        }
        else if ([5].indexOf(rowInnerIndex) !== -1) {
            rowIndex = 2;
        }

        return this.get('rows')[rowShiftIndex + rowIndex];
    }

});
