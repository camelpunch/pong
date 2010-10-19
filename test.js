/*global window, YUI */
"use strict";

YUI().use('test', function (Y) {
    var sprite = new Y.Test.Case({
        name: 'sprite',

        setUp: function () {
            this.sprite = Object.create(window.PAINTER.sprite);
            this.sprite.x = 40;
            this.sprite.y = 70;
            this.sprite.width = 10;
            this.sprite.height = 30;

            this.bat = Object.create(this.sprite);
            this.bat.name = 'Bat';
            this.bat.width = 10;
            this.bat.height = 30;

            this.ball = Object.create(this.sprite);
            this.ball.name = 'Ball';
            this.ball.width = 5;
            this.ball.height = 5;
        },

        "left should be x position minus half the width": function () {
            Y.Assert.areSame(35, this.sprite.left());
        },

        "right should be x position plus half the width": function () {
            Y.Assert.areSame(45, this.sprite.right());
        },

        "top should be y position minus half the height": function () {
            Y.Assert.areSame(55, this.sprite.top());
        },

        "bottom should be y position plus half the height": function () {
            Y.Assert.areSame(85, this.sprite.bottom());
        },

        "hits should be true when ball LHS over bat RHS": function () {
            this.bat.y = 50;
            this.ball.y = 50;

            this.bat.x = 5;
            Y.Assert.areSame(10, this.bat.right());

            this.ball.x = 12.4;
            Y.Assert.areSame(9.9, this.ball.left());

            Y.assert(this.bat.hits(this.ball));
        },

        "hits should be false when ball RHS not over bat LHS": function () {
            this.bat.y = 50;
            this.ball.y = 50;

            this.bat.x = 5;
            Y.Assert.areSame(10, this.bat.right());

            this.ball.x = 12.51;
            Y.Assert.areSame(10.01, this.ball.left());

            Y.Assert.isFalse(this.bat.hits(this.ball));
        }
    });

    Y.Test.Runner.add(sprite);
    Y.Test.Runner.run();
});
