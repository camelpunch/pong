/*global window, YUI, PONG */
"use strict";

YUI().use('test', function (Y) {
    var sprite = new Y.Test.Case({
        name: 'sprite',

        setUp: function () {
            this.sprite = Object.create(PONG.sprite);
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
            var mario = Object.create(PONG.sprite),
            luigi = Object.create(PONG.sprite),
            context;

            this.sprites = {};

            mario.width = 30;
            mario.height = 30;
            mario.x = 30;
            mario.y = 400;
            mario.fillStyle = 'red';

            luigi.width = 30;
            luigi.height = 40;
            luigi.x = 70;
            luigi.y = 400;
            luigi.fillStyle = 'green';

            this.sprites.mario = mario;
            this.sprites.luigi = luigi;

            context = {
                argsReceived: [],
                fillRect: function () {
                    var slice = Array.prototype.slice,
                    args = slice.apply(arguments);
                    context.argsReceived.push(args);
                }
            };

            this.context = context;
        },

        "should set the fillStyle from the sprite property": function () {
            PONG.draw(this.sprites, this.context);
            // can expect the last set fillStyle to be green
            Y.Assert.areSame('green', this.context.fillStyle);
        },

        "should draw a rectangle with each sprite's dimensions": function () {
            var first = {}, 
            second = {},
            arg;

            PONG.draw(this.sprites, this.context);

            Y.Assert.areSame(this.sprites.mario.x, this.context.argsReceived[0][0]);
            Y.Assert.areSame(this.sprites.mario.y,  this.context.argsReceived[0][1]);
            Y.Assert.areSame(this.sprites.mario.width, this.context.argsReceived[0][2]);
            Y.Assert.areSame(this.sprites.mario.height, this.context.argsReceived[0][3]);

            Y.Assert.areSame(this.sprites.luigi.x, this.context.argsReceived[1][0]);
            Y.Assert.areSame(this.sprites.luigi.y, this.context.argsReceived[1][1]);
            Y.Assert.areSame(this.sprites.luigi.width, this.context.argsReceived[1][2]);
            Y.Assert.areSame(this.sprites.luigi.height, this.context.argsReceived[1][3]);
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

            this.paddle1 = PONG.sprites.paddle1;
            this.paddle2 = PONG.sprites.paddle2;
        },

        "should set paddle1 y central to cursor": function () {
            var coords = [20, 400];

            Y.Assert.areSame(128, this.paddle1.height);

            PONG.move(coords);

            Y.Assert.areSame(336, this.paddle1.y);
        },

        "should set paddle2 y opposite": function () {
            var coords = [20, 400];

            Y.Assert.areSame(128, this.paddle2.height);

            PONG.move(coords);

            Y.Assert.areSame(136, this.paddle2.y);
        },

        "should stop paddle1 from leaving top of canvas": function () {
            var coords = [20, -10];
            PONG.move(coords);
            Y.Assert.areSame(0, this.paddle1.y);
        },

        "should stop paddle2 from leaving top of canvas": function () {
            var coords = [20, 900];
            PONG.move(coords);
            Y.Assert.areSame(0, this.paddle2.y);
        },

        "should stop paddle1 from leaving bottom of canvas": function () {
            var coords = [20, 700];
            PONG.move(coords);
            Y.Assert.areSame(472, this.paddle1.y);
        },

        "should stop paddle2 from leaving bottom of canvas": function () {
            var coords = [20, -200];
            PONG.move(coords);
            Y.Assert.areSame(472, this.paddle2.y);
        }
    });

    Y.Test.Runner.add(sprite);
    Y.Test.Runner.add(move);
    Y.Test.Runner.add(draw);
    Y.Test.Runner.run();
});
