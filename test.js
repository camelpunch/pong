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

        "place should set left to be x position": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(50, this.sprite.left);
        },

        "place should set right to be x position plus width": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(60, this.sprite.right);
        },

        "place should set top to be y position": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(50, this.sprite.top);
        },

        "bottom should be y position plus height": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(80, this.sprite.bottom);
        },

        "hits should be true when ball LHS over bat RHS": function () {
            this.bat.place(0, 50);
            this.ball.place(9, 50);

            Y.assert(this.bat.hits(this.ball));
        },

        "hits should be false when ball RHS not over bat LHS": function () {
            this.bat.place(0, 50);
            this.ball.place(11, 50);

            Y.Assert.isFalse(this.bat.hits(this.ball));
        },

        "clear should clear within the current dimensions": function () {
            this.bat.context = Y.Mock();

            Y.Mock.expect(this.bat.context, {
                method: 'clearRect',
                args: [this.bat.x, this.bat.y, this.bat.width, this.bat.height]
            });

            this.bat.clear();

            Y.Mock.verify(this.bat.context);
        }
    }),

    paddle = new Y.Test.Case({
        name: 'paddle',

        setUp: function () {
            this.paddle = Object.create(PONG.paddle);
            this.paddle.height = 100;
        },

        "setY should stop paddle from leaving top of canvas": function () {
            this.paddle.setY(-10);
            Y.Assert.areSame(0, this.paddle.y);
        },

        "setY should stop paddle from leaving bottom of canvas": function () {
            this.paddle.setY(601);
            Y.Assert.areSame(500, this.paddle.y);
        }
    }),

    ball = new Y.Test.Case({
        name: 'ball',

        setUp: function () {
            this.ball = PONG.sprites.ball;
            this.ball.x = 53;
            this.ball.left = 53;
            this.ball.y = 30;
            this.ball.top = 30;
            this.ball.xPixelsPerTick = 5;
            this.ball.yPixelsPerTick = 6;
        },

        "move should increase left by xPixelsPerTick": function () {
            this.ball.move();
            Y.Assert.areSame(58, this.ball.left);
        },

        "move should increase top by yPixelsPerTick": function () {
            this.ball.move();
            Y.Assert.areSame(36, this.ball.top);
        },

        "reverseX should switch polarity of xPixelsPerTick": function () {
            this.ball.reverseX();
            Y.Assert.areSame(-5, this.ball.xPixelsPerTick);
        },

        "reverseY should switch polarity of yPixelsPerTick": function () {
            this.ball.reverseY();
            Y.Assert.areSame(-6, this.ball.yPixelsPerTick);
        }
    }),

    draw = new Y.Test.Case({
        name: 'draw and clear',

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
                fillRectArgsReceived: [],
                fillRect: function () {
                    context.fillRectArgsReceived.push(arguments);
                }
            };

            this.context = context;
        },

        "draw should set the fillStyle from the sprite property": function () {
            PONG.draw(this.sprites, this.context);
            // can expect the last set fillStyle to be green
            Y.Assert.areSame('green', this.context.fillStyle);
        },

        "draw should draw a rectangle with each sprite's dimensions": function () {
            PONG.draw(this.sprites, this.context);

            Y.Assert.areSame(this.sprites.mario.x, this.context.fillRectArgsReceived[0][0]);
            Y.Assert.areSame(this.sprites.mario.y,  this.context.fillRectArgsReceived[0][1]);
            Y.Assert.areSame(this.sprites.mario.width, this.context.fillRectArgsReceived[0][2]);
            Y.Assert.areSame(this.sprites.mario.height, this.context.fillRectArgsReceived[0][3]);

            Y.Assert.areSame(this.sprites.luigi.x, this.context.fillRectArgsReceived[1][0]);
            Y.Assert.areSame(this.sprites.luigi.y, this.context.fillRectArgsReceived[1][1]);
            Y.Assert.areSame(this.sprites.luigi.width, this.context.fillRectArgsReceived[1][2]);
            Y.Assert.areSame(this.sprites.luigi.height, this.context.fillRectArgsReceived[1][3]);
        }
    }),

    move = new Y.Test.Case({
        name: 'move',

        setUp: function () {
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
        }
    }),
        
    update = new Y.Test.Case({
        setUp: function () {
            this.ball = PONG.sprites.ball;

            this.paddle1 = PONG.sprites.paddle1;
            this.paddle1.place(0, 0);

            this.paddle2 = PONG.sprites.paddle2;
            this.paddle2.place(568, 0);
        },

        "should clear the ball": function () {
            var called = false;

            this.ball.clear = function () {
                called = true;
                return this;
            };

            PONG.update();

            Y.assert(called);
        },

        "should move the ball": function () {
            var called = false;

            this.ball.move = function () {
                called = true;
                return this;
            };

            PONG.update();

            Y.assert(called);
        },

        "should reverse ball horizontally when it hits paddle1": function () {
            this.ball.xPixelsPerTick = -5;
            this.ball.place(5, 0);
            PONG.update();
            Y.Assert.areSame(5, this.ball.xPixelsPerTick);
        },

        "should reverse ball horizontally when it hits paddle2": function () {
            this.ball.xPixelsPerTick = 5;
            this.ball.place(595, 0);
            PONG.update();
            Y.Assert.areSame(-5, this.ball.xPixelsPerTick);
        },

        "should reverse ball vertically when it hits bottom": function () {
            this.ball.yPixelsPerTick = 5;
            this.ball.place(0, 595);
            PONG.update();
            Y.Assert.areSame(-5, this.ball.yPixelsPerTick);
        },

        "should reverse ball vertically when it hits top": function () {
            this.ball.yPixelsPerTick = -5;
            this.ball.place(0, 0);
            PONG.update();
            Y.Assert.areSame(5, this.ball.yPixelsPerTick);
        }
    });

    Y.Test.Runner.add(ball);
    Y.Test.Runner.add(draw);
    Y.Test.Runner.add(move);
    Y.Test.Runner.add(paddle);
    Y.Test.Runner.add(sprite);
    Y.Test.Runner.add(update);
    Y.Test.Runner.run();
});
