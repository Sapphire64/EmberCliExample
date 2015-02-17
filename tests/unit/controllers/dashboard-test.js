import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('controller:dashboard', {
  // Specify the other units that are required for this test.
  needs: []
});

test('getRowSize returns proper row size according to index', function (assert) {
    var controller = this.subject();

    assert.expect(6);

    assert.equal(controller.getRowSize(1), 3);
    assert.equal(controller.getRowSize(2), 2);
    assert.equal(controller.getRowSize(3), 1);

    assert.equal(controller.getRowSize(4), 3);
    assert.equal(controller.getRowSize(5), 2);
    assert.equal(controller.getRowSize(6), 1);
});

test('recreateRows puts boxes into proper row containers', function (assert) {
    var controller = this.subject();
    var boxes = [];
    var rows;

    for (var i=1; i<=12; i++) {
        boxes.push(Ember.Object.create({id: i}));
    }

    controller.set('boxes', boxes);

    rows = controller.get('rows');

    assert.equal(rows.length, 6,
        "Six rows should be created for 12 items according to representation logic"
    );

    /* Testing Rows and Boxes in rows */
    for (i=0; i<rows.length; i++) {
        var expectedLength = controller.getRowSize(i+1);
        var loopRow = rows[i];

        assert.equal(loopRow.boxes.length, expectedLength);

        for (var x=0; x<loopRow.boxes.length; x++) {
            var loopBox = loopRow.boxes[x];

            if (expectedLength === 3) {
                assert.ok(loopBox.get('id') % 6 <= 3,
                    "Items with ids % 6 <= 3 should be presented in this Row"
                );
            }
            else if (expectedLength === 2) {
                assert.ok(3 < loopBox.get('id') % 6 <= 5,
                    "Items with 3 < ids % 6 <= 5 should be presented in this Row"
                );
            }
            else if (expectedLength === 1) {
                assert.ok(loopBox.get('id') % 6 === 0,
                    "Items with ids % 6 === 0 should be presented in this Row"
                );
            }
        }
    }

});

test('getRowByBoxIndex returns valid row', function (assert) {
    var controller = this.subject();
    var boxes = [];
    var rows;

    for (var i=1; i<=12; i++) {
        boxes.push(Ember.Object.create({id: i}));
    }

    controller.set('boxes', boxes);

    // We expect here that recreateRows was ran by watcher on Boxes
    rows = controller.get('rows');

    // Structure of rows
    // 1 2 3
    // 4 5
    // 6
    // 7 8 9
    // 10 11
    // 12

    // Please note that ROW (not ROW ID) should be returned
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(1-1)), 0);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(2-1)), 0);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(3-1)), 0);

    assert.equal(rows.indexOf(controller.getRowByBoxIndex(4-1)), 1);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(5-1)), 1);

    assert.equal(rows.indexOf(controller.getRowByBoxIndex(6-1)), 2);

    assert.equal(rows.indexOf(controller.getRowByBoxIndex(7-1)), 3);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(8-1)), 3);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(9-1)), 3);

    assert.equal(rows.indexOf(controller.getRowByBoxIndex(10-1)), 4);
    assert.equal(rows.indexOf(controller.getRowByBoxIndex(11-1)), 4);

    assert.equal(rows.indexOf(controller.getRowByBoxIndex(12-1)), 5);
});

test('getBoxNeighbours returns previous box if it\'s in the same row',
 function (assert) {
    var controller = this.subject();
    var boxes = [];

    for (var i=1; i<=12; i++) {
        boxes.push({id: i});
    }

    controller.set('boxes', boxes);

    // Structure of rows
    // 1 2 3
    // 4 5
    // 6
    // 7 8 9
    // 10 11
    // 12

    assert.deepEqual(controller.getBoxNeighbours(boxes[1-1]), [undefined, boxes[2-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[2-1]), [boxes[1-1], boxes[3-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[3-1]), [boxes[2-1], undefined]);

    assert.deepEqual(controller.getBoxNeighbours(boxes[4-1]), [undefined, boxes[5-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[5-1]), [boxes[4-1], undefined]);

    assert.deepEqual(controller.getBoxNeighbours(boxes[6-1]), [undefined, undefined]);

    assert.deepEqual(controller.getBoxNeighbours(boxes[7-1]), [undefined, boxes[8-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[8-1]), [boxes[7-1], boxes[9-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[9-1]), [boxes[8-1], undefined]);

    assert.deepEqual(controller.getBoxNeighbours(boxes[10-1]), [undefined, boxes[11-1]]);
    assert.deepEqual(controller.getBoxNeighbours(boxes[11-1]), [boxes[10-1], undefined]);

    assert.deepEqual(controller.getBoxNeighbours(boxes[12-1]), [undefined, undefined]);
});
