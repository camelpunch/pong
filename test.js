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

        "placed should be false when ball hasn't been placed": function () {
            Y.Assert.isFalse(this.ball.placed());
        },

        "placed should be true when ball has been placed": function () {
            this.ball.place(0, 0);
            Y.Assert.isTrue(this.ball.placed());
        },

        "intersects should be true when ball LHS over bat RHS": function () {
            this.bat.place(0, 50);
            this.ball.place(9, 50);

            Y.assert(this.bat.intersects(this.ball));
        },

        "intersects should be false when ball RHS not over bat LHS": function () {
            this.bat.place(0, 50);
            this.ball.place(11, 50);

            Y.Assert.isFalse(this.bat.intersects(this.ball));
        },

        "clear should clear within the current dimensions": function () {
            this.bat.context = Y.Mock();

            Y.Mock.expect(this.bat.context, {
                method: 'clearRect',
                args: [this.bat.x, this.bat.y, this.bat.width, this.bat.height]
            });

            this.bat.clear();

            Y.Mock.verify(this.bat.context);
        },

        "draw should set the fill style": function () {
            this.bat.fillStyle = 'green';

            this.bat.context = {
                fillStyle: undefined,
                fillRect: function () {
                }
            };

            this.bat.draw();

            Y.Assert.areSame('green', this.bat.context.fillStyle);
        },

        "draw should draw using the current dimensions": function () {
            this.bat.context = Y.Mock();

            Y.Mock.expect(this.bat.context, {
                method: 'fillRect',
                args: [this.bat.x, this.bat.y, this.bat.width, this.bat.height]
            });

            this.bat.draw();

            Y.Mock.verify(this.bat.context);
        }
    }),

    paddle = new Y.Test.Case({
        name: 'paddle',

        setUp: function () {
            this.paddle = Object.create(PONG.paddle);
            this.paddle.height = 100;
        },

        "move should place paddle according to its next position": function () {
            this.paddle.next = Object.create(this.paddle);
            this.paddle.next.y = 55;
            this.paddle.next.top = 55;
            this.paddle.move();
            Y.Assert.areSame(55, this.paddle.y);
            Y.Assert.areSame(55, this.paddle.top);
        },

        "move should not break if no next position": function () {
            this.paddle.move();
        },

        "setY should store new coords": function () {
            this.paddle.x = 5;
            this.paddle.setY(10);
            Y.Assert.areSame(5, this.paddle.next.x);
            Y.Assert.areSame(10, this.paddle.next.y);
        },

        "setY should stop paddle from leaving top of canvas": function () {
            this.paddle.setY(-10);
            Y.Assert.areSame(0, this.paddle.next.y);
        },

        "setY should stop paddle from leaving bottom of canvas": function () {
            this.paddle.setY(601);
            Y.Assert.areSame(500, this.paddle.next.y);
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

    update = new Y.Test.Case({
        setUp: function () {
            var clear = function () {
                this.clearCalled = true;
                return this;
            },
            move = function () {
                this.moveCalled = true;
                return this;
            },
            next1,
            next2;

            this.ball = PONG.sprites.ball;

            this.paddle1 = PONG.sprites.paddle1;

            next1 = Object.create(this.paddle1);
            next1.y = 10;
            this.paddle1.next = next1;

            this.paddle1.place(0, 0);

            this.paddle2 = PONG.sprites.paddle2;
            next2 = Object.create(this.paddle2);
            next2.y = 20;
            this.paddle2.next = next2;

            this.paddle2.place(568, 0);

            this.ball.clear = clear;
            this.paddle1.clear = clear;
            this.paddle2.clear = clear;

            this.ball.move = move;
            this.paddle1.move = move;
            this.paddle2.move = move;

            PONG.sprite.draw = function () {
                this.drawCalled = true;
                return this;
            };
        },

        "should clear the ball": function () {
            PONG.update();
            Y.Assert.isTrue(this.ball.clearCalled);
        },

        "should move the ball": function () {
            PONG.update();
            Y.Assert.isTrue(this.ball.moveCalled);
        },

        "should clear paddle1": function () {
            PONG.update();
            Y.Assert.isTrue(this.paddle1.clearCalled);
        },

        "should clear paddle2": function () {
            PONG.update();
            Y.Assert.isTrue(this.paddle2.clearCalled);
        },

        "should move paddle1": function () {
            PONG.update();
            Y.Assert.isTrue(this.paddle1.moveCalled);
        },

        "should move paddle2": function () {
            PONG.update();
            Y.Assert.isTrue(this.paddle2.moveCalled);
        },

        "should reverse ball horizontally when it intersects paddle1": function () {
            this.ball.xPixelsPerTick = -5;
            this.ball.place(5, 0);
            PONG.update();
            Y.Assert.areSame(5, this.ball.xPixelsPerTick);
        },

        "should correct ball when it intersects paddle1": function () {
            this.ball.xPixelsPerTick = -5;
            this.ball.place(5, 0);
            PONG.update();
            Y.Assert.areSame(32, this.ball.x);
        },

        "should reverse ball horizontally when it intersects paddle2": function () {
            this.ball.xPixelsPerTick = 5;
            this.ball.place(595, 0);
            PONG.update();
            Y.Assert.areSame(-5, this.ball.xPixelsPerTick);
        },

        "should correct ball when it intersects paddle2": function () {
            this.ball.xPixelsPerTick = -5;
            this.ball.place(595, 0);
            PONG.update();
            Y.Assert.areSame(536, this.ball.x);
        },

        "should reverse ball vertically when it intersects bottom": function () {
            this.ball.yPixelsPerTick = 5;
            this.ball.place(0, 595);
            PONG.update();
            Y.Assert.areSame(-5, this.ball.yPixelsPerTick);
        },

        "should reverse ball vertically when it intersects top": function () {
            this.ball.yPixelsPerTick = -5;
            this.ball.place(0, 0);
            PONG.update();
            Y.Assert.areSame(5, this.ball.yPixelsPerTick);
        },

        "should draw both paddles and the ball": function () {
            PONG.update();
            Y.Assert.isTrue(this.paddle1.drawCalled);
            Y.Assert.isTrue(this.paddle2.drawCalled);
            Y.Assert.isTrue(this.ball.drawCalled);
        }
    }),
        
    reset = new Y.Test.Case({
        setUp: function () {
            this.paddle1 = PONG.sprites.paddle1;
            this.paddle1.place(0, 50);

            this.paddle2 = PONG.sprites.paddle2;
            this.paddle2.place(768, 20);

            this.ball = PONG.sprites.ball;
            this.ball.place(100, 100);

            PONG.sprite.clear = function () {
                this.clearCalled = true;
                return this;
            };

            this.unplace = function (sprite) {
                delete sprite.x;
                delete sprite.y;
                delete sprite.left;
                delete sprite.right;
                delete sprite.top;
                delete sprite.bottom;
            };
        },

        "should set ball xPixelsPerTick": function () {
            PONG.reset();
            Y.Assert.areSame(10, this.ball.xPixelsPerTick);
        },

        "should set ball yPixelsPerTick": function () {
            PONG.reset();
            Y.Assert.areSame(11, this.ball.yPixelsPerTick);
        },

        "should place the ball": function () {
            PONG.reset();
            Y.Assert.areSame(33, this.ball.x);
            Y.Assert.areSame(1, this.ball.y);
        },
        
        "should clear ball": function () {
            this.ball.clearCalled = false;

            PONG.reset();

            Y.Assert.isTrue(this.ball.clearCalled);
        },

        "should not clear paddle1 if it hasn't been placed": function () {
            this.paddle1.clearCalled = false;
            this.unplace(this.paddle1);

            PONG.reset();
            Y.Assert.isFalse(this.paddle1.clearCalled);
        },

        "should not clear paddle2 if it hasn't been placed": function () {
            this.paddle2.clearCalled = false;
            this.unplace(this.paddle2);

            PONG.reset();
            Y.Assert.isFalse(this.paddle2.clearCalled);
        },

        "should not clear ball if it hasn't been placed": function () {
            this.ball.clearCalled = false;
            this.unplace(this.ball);

            PONG.reset();
            Y.Assert.isFalse(this.ball.clearCalled);
        }
    });

    Y.Test.Runner.add(ball);
    Y.Test.Runner.add(paddle);
    Y.Test.Runner.add(sprite);

    // dirty cases that override functions in lieu of finding a different
    // mocking framework / refactoring
    Y.Test.Runner.add(reset);
    Y.Test.Runner.add(update);

    Y.Test.Runner.run();
});
