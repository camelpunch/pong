/*global window, YUI, PONG, ARNIE */
"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

YUI().use('test', 'event-custom', function (Y) {
    var canvas = window.document.getElementById('pong'),

    sprite = new Y.Test.Case({
        name: 'sprite',

        setUp: function () {
            this.game = ARNIE.game(canvas, Y);

            this.sprite = this.game.sprite('somesprite', {
                x: 40,
                y: 70,
                width: 10,
                height: 30,
                fillStyle: 'blue'
            });

            this.bat = this.game.sprite('Bat', {
                width: 10,
                height: 30
            });

            this.ball = this.game.sprite('Ball', {
                width: 5,
                height: 5
            });
        },

        "should set name": function () {
            Y.Assert.areSame('somesprite', this.sprite.name);
        },

        "should be added to sprites": function () {
            Y.ArrayAssert.contains(this.sprite, this.game.sprites);
        },

        "should set fillStyle": function () {
            Y.Assert.areSame('blue', this.sprite.fillStyle);
        },

        "should be added to collisionDetectors if detectCollisions true": function () {
            var sprite = this.game.sprite('mario', {
                detectCollisions: true
            });

            Y.ArrayAssert.contains(sprite, this.game.collisionDetectors);
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
            this.paddle = Object.create(PONG.paddle1);
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
            this.ball = PONG.ball;
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
            draw = function () {
                this.drawCalled = true;
                return this;
            },
            next1,
            next2;

            next1 = {
                place: PONG.paddle1.place
            };
            next1.place(0, 10);
            PONG.paddle1.next = next1;

            PONG.paddle1.place(0, 0);

            next2 = {
                place: PONG.paddle2.place
            };
            next2.place(0, 20);
            PONG.paddle2.next = next2;

            PONG.paddle2.place(568, 0);

            PONG.ball.clear = clear;
            PONG.paddle1.clear = clear;
            PONG.paddle2.clear = clear;

            PONG.ball.move = move;
            PONG.paddle1.move = move;
            PONG.paddle2.move = move;

            PONG.ball.draw = draw;
            PONG.paddle1.draw = draw;
            PONG.paddle2.draw = draw;

            PONG.ball.clearCalled = false;
            PONG.paddle1.clearCalled = false;
            PONG.paddle2.clearCalled = false;

            PONG.ball.moveCalled = false;
            PONG.paddle1.moveCalled = false;
            PONG.paddle2.moveCalled = false;

            PONG.ball.drawCalled = false;
            PONG.paddle1.drawCalled = false;
            PONG.paddle2.drawCalled = false;
        },

        "should clear the ball": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.ball.clearCalled);
        },

        "should move the ball": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.ball.moveCalled);
        },

        "should clear paddle1": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle1.clearCalled);
        },

        "should clear paddle2": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle2.clearCalled);
        },

        "should move paddle1": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle1.moveCalled);
        },

        "should move paddle2": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle2.moveCalled);
        },

        "should reverse ball horizontally when it intersects paddle1": function () {
            PONG.ball.xPixelsPerTick = -5;
            PONG.ball.place(5, 0);
            PONG.ball.fire('arnie:collision', PONG.paddle1);
            Y.Assert.areSame(5, PONG.ball.xPixelsPerTick);
        },

        "should correct ball when it intersects paddle1": function () {
            PONG.ball.xPixelsPerTick = -5;
            PONG.ball.place(5, 0);
            PONG.ball.fire('arnie:collision', PONG.paddle1);
            Y.Assert.areSame(32, PONG.ball.x);
        },

        "should reverse ball horizontally when it intersects paddle2": function () {
            PONG.ball.xPixelsPerTick = 5;
            PONG.ball.place(595, 0);
            PONG.ball.fire('arnie:collision', PONG.paddle2);
            Y.Assert.areSame(-5, PONG.ball.xPixelsPerTick);
        },

        "should correct ball when it intersects paddle2": function () {
            PONG.ball.xPixelsPerTick = -5;
            PONG.ball.place(595, 0);
            PONG.ball.fire('arnie:collision', PONG.paddle2);
            Y.Assert.areSame(536, PONG.ball.x);
        },

        "should reverse ball vertically when it intersects bottom": function () {
            PONG.ball.yPixelsPerTick = 5;
            PONG.ball.place(0, 595);
            PONG.ball.fire('arnie:collision', PONG.bottom);
            Y.Assert.areSame(-5, PONG.ball.yPixelsPerTick);
        },

        "should reverse ball vertically when it intersects top": function () {
            PONG.ball.yPixelsPerTick = -5;
            PONG.ball.place(0, 0);
            PONG.ball.fire('arnie:collision', PONG.top);
            Y.Assert.areSame(5, PONG.ball.yPixelsPerTick);
        },

        "should draw both paddles and the ball": function () {
            PONG.Y.fire('arnie:post-intersect');
            Y.Assert.isTrue(PONG.paddle1.drawCalled);
            Y.Assert.isTrue(PONG.paddle2.drawCalled);
            Y.Assert.isTrue(PONG.ball.drawCalled);
        }
    }),
        
    reset = new Y.Test.Case({
        setUp: function () {
            this.paddle1 = PONG.paddle1;
            this.paddle1.place(0, 50);

            this.paddle2 = PONG.paddle2;
            this.paddle2.place(768, 20);

            this.ball = PONG.ball;
            this.ball.place(100, 100);

            PONG.ball.clear = function () {
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
            PONG.Y.fire('arnie:reset');
            Y.Assert.areSame(10, this.ball.xPixelsPerTick);
        },

        "should set ball yPixelsPerTick": function () {
            PONG.Y.fire('arnie:reset');
            Y.Assert.areSame(11, this.ball.yPixelsPerTick);
        },

        "should place the ball": function () {
            PONG.Y.fire('arnie:reset');
            Y.Assert.areSame(33, this.ball.x);
            Y.Assert.areSame(1, this.ball.y);
        },
        
        "should clear ball": function () {
            this.ball.clearCalled = false;

            PONG.Y.fire('arnie:reset');

            Y.Assert.isTrue(this.ball.clearCalled);
        },

        "should not clear paddle1 if it hasn't been placed": function () {
            this.paddle1.clearCalled = false;
            this.unplace(this.paddle1);

            PONG.Y.fire('arnie:reset');

            Y.Assert.isFalse(this.paddle1.clearCalled);
        },

        "should not clear paddle2 if it hasn't been placed": function () {
            this.paddle2.clearCalled = false;
            this.unplace(this.paddle2);

            PONG.Y.fire('arnie:reset');

            Y.Assert.isFalse(this.paddle2.clearCalled);
        },

        "should not clear ball if it hasn't been placed": function () {
            this.ball.clearCalled = false;
            this.unplace(this.ball);

            PONG.Y.fire('arnie:reset');

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
