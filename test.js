/*global window, YUI */
"use strict";

YUI().use('test', function (Y) {
    var sprite = new Y.Test.Case({
        name: 'sprite',

        setUp: function () {
            this.sprite = Object.create(window.PONG.sprite);
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

        "left should be x position": function () {
            Y.Assert.areSame(40, this.sprite.left());
        },

        "right should be x position plus width": function () {
            Y.Assert.areSame(50, this.sprite.right());
        },

        "top should be y position": function () {
            Y.Assert.areSame(70, this.sprite.top());
        },

        "bottom should be y position plus height": function () {
            Y.Assert.areSame(100, this.sprite.bottom());
        },

        "hits should be true when ball LHS over bat RHS": function () {
            this.bat.y = 50;
            this.ball.y = 50;

            this.bat.x = 0;
            this.ball.x = 9;

            Y.assert(this.bat.hits(this.ball));
        },

        "hits should be false when ball RHS not over bat LHS": function () {
            this.bat.y = 50;
            this.ball.y = 50;

            this.bat.x = 0;
            this.ball.x = 11;

            Y.Assert.isFalse(this.bat.hits(this.ball));
        }
    }),

    draw = new Y.Test.Case({
        name: 'draw',

        setUp: function () {
            var mario = Object.create(window.PONG.sprite),
            luigi = Object.create(window.PONG.sprite);

            mario.width = 30;
            mario.height = 30;
            mario.x = 30;
            mario.y = 400;

            luigi.width = 30;
            luigi.height = 40;
            luigi.x = 70;
            luigi.y = 400;

            this.sprites.mario = mario;
            this.sprites.luigi = luigi;

            this.context = {
            };
        }
    }),

    move = new Y.Test.Case({
        name: 'move',

        setUp: function () {
            window.getCanvas = function () {
                return {
                    getContext: function () {
                    }
                };
            };
        },

        "should set paddle1 y central to cursor": function () {
            var coords = [20, 400];

            paddle1 = window.PONG.sprites.paddle1;

            Y.Assert.areSame(128, paddle1.height);

            window.PONG.move(coords);

            Y.Assert.areSame(336, paddle1.y);
        },

        "should set paddle2 y opposite": function () {
            var coords = [20, 400];

            paddle2 = window.PONG.sprites.paddle2;

            Y.Assert.areSame(128, paddle2.height);

            window.PONG.move(coords);

            Y.Assert.areSame(136, paddle2.y);
        },

        "should stop paddle1 from leaving top of canvas": function () {
            var coords = [20, -10];
            window.PONG.move(coords);
            Y.Assert.areSame(0, paddle1.y);
        },

        "should stop paddle2 from leaving top of canvas": function () {
            var coords = [20, 900];
            window.PONG.move(coords);
            Y.Assert.areSame(0, paddle2.y);
        },

        "should stop paddle1 from leaving bottom of canvas": function () {
            var coords = [20, 700];
            window.PONG.move(coords);
            Y.Assert.areSame(472, paddle1.y);
        },

        "should stop paddle2 from leaving bottom of canvas": function () {
            var coords = [20, -200];
            window.PONG.move(coords);
            Y.Assert.areSame(472, paddle2.y);
        }
    });

    Y.Test.Runner.add(sprite);
    Y.Test.Runner.add(move);
    Y.Test.Runner.run();
});
