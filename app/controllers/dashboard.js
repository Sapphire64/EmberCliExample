import Ember from 'ember';

export default Ember.Controller.extend({
    /* Expecte for next structure of rows:
         1 2 3
         4 5
         6
         7 8 9
         10 11
         12
     */
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
    },
    getBoxNeighbours: function (box) {
        var indexOfBox = this.get('boxes').indexOf(box);
        var currentRow;
        var boxes;
        var indexOfBoxInRow;

        if (indexOfBox === -1) {
            throw new Error("Box is not inserted into controller scope");
        }

        currentRow = this.getRowByBoxIndex(indexOfBox);
        boxes = currentRow.get('boxes');

        indexOfBoxInRow = boxes.indexOf(box);

        return [boxes[indexOfBoxInRow-1], boxes[indexOfBoxInRow+1]];
    }

});
