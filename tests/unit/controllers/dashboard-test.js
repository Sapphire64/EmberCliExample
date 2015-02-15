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
