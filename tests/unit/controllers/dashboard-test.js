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

test('removeBox should remove specified box from boxes container', function (assert){
    var controller = this.subject();
    var boxes = [];
    var box;
    var currentBoxesLen;

    var recreateRowsCalled = false;
    var recreateRowsMock = function () {
        recreateRowsCalled = true;
    };

    for (var i=1; i<=12; i++) {
        boxes.push(Ember.Object.create({id: i}));
    }

    controller.set('boxes', boxes);
    controller.set('recreateRows', recreateRowsMock);

    box = boxes[5];
    currentBoxesLen = boxes.length;

    controller.send('removeBox', box);
    boxes = controller.get('boxes');

    assert.equal(boxes.length, currentBoxesLen-1);
    for (i=0; i<boxes.length; i++) {
        assert.notEqual(boxes[i], box);
    }

    assert.ok(recreateRowsCalled, "recreateRows method should be called");
});

test('addNewBox adds a new box', function (assert) {
    var controller = this.subject();
    var boxes = [];
    var boxIndex = 10000;
    var oldBoxesLen;
    var old5ElemId;

    var recreateRowsCalled = false;
    var recreateRowsMock = function () {
        recreateRowsCalled = true;
    };

    for (var i=1; i<=12; i++) {
        boxes.push(Ember.Object.create({id: i}));
    }
    oldBoxesLen = boxes.length;
    old5ElemId = boxes[5].get('id');

    controller.set('boxes', boxes);
    controller.set('boxIndex', boxIndex);
    controller.set('recreateRows', recreateRowsMock);

    controller.send('addNewBox', boxes[5]);

    assert.equal(controller.get('boxes').length, oldBoxesLen + 1);
    assert.equal(controller.get('boxes')[6].get('id'), boxIndex + 1,
        "New item should be added right after old item"
    );
    assert.equal(controller.get('boxes')[5].get('id'), old5ElemId,
        "Older item should stay at the same position"
    );

    assert.equal(controller.get('boxIndex'), boxIndex + 1,
        "Box Index should be incremented after operation"
    );

    assert.ok(recreateRowsCalled, "recreateRows method should be called");

});
