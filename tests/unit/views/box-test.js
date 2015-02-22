import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleFor('view:box');

test('getNeighbourElements assigns neighbours from row method', function (assert) {
    var view = this.subject();
    var boxes = [];
    var rows = [];
    var createRow = true;
    var targetRow;

    var getRowSize = function (i) {
        if (i % 3 === 1) {
            return 3;
        }
        else if (i % 3 === 2) {
            return 2;
        }
        else if (i % 3 === 0) {
            return 1;
        }
    };

    for (var i=1; i<=12; i++) {
        boxes.push({id: i});
    }

    // Creating rows and boxes (duplication of logic of Controller)
    for (i=0; i<boxes.length; i++) {
        var box = boxes[i];

        if (createRow) {
            rows.push(Ember.Object.create(
                {
                    size: getRowSize(rows.length + 1),
                    boxes: Ember.A([]),
                }
            ));
        }
        targetRow = rows[rows.length-1];
        targetRow.boxes.pushObject(box);

        createRow = targetRow.get('boxes').length === targetRow.get('size');
    }

    // Structure of rows
    // 1 2 3
    // 4 5
    // 6
    // 7 8 9
    // 10 11
    // 12

    view.set('row', rows[0]);
    view.set('box', boxes[1-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, boxes[2-1]]);
    view.set('box', boxes[2-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[1-1], boxes[3-1]]);
    view.set('box', boxes[3-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[2-1], null]);

    view.set('row', rows[1]);
    view.set('box', boxes[4-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, boxes[5-1]]);
    view.set('box', boxes[5-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[4-1], null]);

    view.set('row', rows[2]);
    view.set('box', boxes[6-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, null]);

    view.set('row', rows[3]);
    view.set('box', boxes[7-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, boxes[8-1]]);
    view.set('box', boxes[8-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[7-1], boxes[9-1]]);
    view.set('box', boxes[9-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[8-1], null]);

    view.set('row', rows[4]);
    view.set('box', boxes[10-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, boxes[11-1]]);
    view.set('box', boxes[11-1]);
    assert.deepEqual(view.getBoxNeighbours(), [boxes[10-1], null]);

    view.set('row', rows[5]);
    view.set('box', boxes[12-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, null]);

    /* Validting that method logic is not ran if result already calculated */
    view.set('previousEl', '123456');
    view.set('nextEl', '7891011');
    view.set('row', rows[5]);
    view.set('box', boxes[12-1]);
    assert.deepEqual(view.getBoxNeighbours(), ['123456', '7891011'],
        "Method must use cached values"
    );

    view.set('previousEl', null);
    view.set('nextEl', null);
    view.set('row', rows[4]);
    view.set('box', boxes[11-1]);
    assert.deepEqual(view.getBoxNeighbours(), [null, null],
        "Null values should be recognized as cached"
    );
});

test('previousElIndex property returns correct value', function (assert) {
    var view = this.subject();
    view.set('getBoxNeighbours', function () {
        return [
            Ember.Object.create({id: 'testIdPrev'}),
            Ember.Object.create({id: 'testIdNext'})
        ];
    });

    assert.equal(
        view.get('previousElIndex'), 'testIdPrev',
        "id of prev. element cached by getBoxNeighbours should be returned"
    );
});

test('previousElIndex should properly handle null values', function (assert) {
    var view = this.subject();
    /* Null values */
    view.set('getBoxNeighbours', function () {
        return [null, null];
    });

    assert.equal(
        view.get('previousElIndex'), null,
        "Null value should be returned"
    );

});

test('nextElIndex property returns correct value', function (assert) {
    var view = this.subject();
    view.set('getBoxNeighbours', function () {
        return [
            Ember.Object.create({id: 'testIdPrev'}),
            Ember.Object.create({id: 'testIdNext'})
        ];
    });

    assert.equal(
        view.get('nextElIndex'), 'testIdNext',
        "id of next element cached by getBoxNeighbours should be returned"
    );
});

test('nextElIndex should properly handle null values', function (assert) {
    var view = this.subject();
    /* Null values */
    view.set('getBoxNeighbours', function () {
        return [null, null];
    });

    assert.equal(
        view.get('nextElIndex'), null,
        "Null value should be returned"
    );
});

test('boxId property should return current box id', function (assert) {
    var view = this.subject();

    view.set('box', Ember.Object.create({id: 'currentBoxId'}));

    assert.equal(view.get('boxId'), 'currentBoxId');
});
