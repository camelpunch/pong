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

    prePostIntersect = new Y.Test.Case({
        name: "pre- and post-intersect",

        setUp: function () {
            Y.each(['clear', 'move', 'draw'], function (verb) {
                var func = function () {
                    this[verb + 'Called'] = true;
                    return this;
                };

                PONG.ball[verb] = func;
                PONG.paddle1[verb] = func;
                PONG.paddle2[verb] = func;

                PONG.ball[verb + 'Called'] = false;
                PONG.paddle1[verb + 'Called'] = false;
                PONG.paddle2[verb + 'Called'] = false;
            });
        },

        "should clear the ball on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.ball.clearCalled);
        },

        "should move the ball on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.ball.moveCalled);
        },

        "should clear paddle1 on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle1.clearCalled);
        },

        "should clear paddle2 on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle2.clearCalled);
        },

        "should move paddle1 on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle1.moveCalled);
        },

        "should move paddle2 on pre": function () {
            PONG.Y.fire('arnie:pre-intersect');
            Y.Assert.isTrue(PONG.paddle2.moveCalled);
        },

        "should draw the ball on post": function () {
            PONG.Y.fire('arnie:post-intersect');
            Y.Assert.isTrue(PONG.ball.drawCalled);
        },

        "should draw paddle1 on post": function () {
            PONG.Y.fire('arnie:post-intersect');
            Y.Assert.isTrue(PONG.paddle1.drawCalled);
        },

        "should draw paddle2 on post": function () {
            PONG.Y.fire('arnie:post-intersect');
            Y.Assert.isTrue(PONG.paddle2.drawCalled);
        }
    }),

    collision = new Y.Test.Case({
        name: "collision",

        setUp: function () {
            var next1,
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

            PONG.startRound();
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
            PONG.ball.place(10, 595);
            PONG.ball.fire('arnie:collision', PONG.bottom);
            Y.Assert.areSame(-5, PONG.ball.yPixelsPerTick);
        },

        "should reverse ball vertically when it intersects top": function () {
            PONG.ball.yPixelsPerTick = -5;
            PONG.ball.place(20, 0);
            PONG.ball.fire('arnie:collision', PONG.top);
            Y.Assert.areSame(5, PONG.ball.yPixelsPerTick);
        },

        "should increase player 1 score when when ball intersects right": function () {
            PONG.ball.fire('arnie:collision', PONG.right);
            Y.Assert.areSame('1', window.document.getElementById('score_player1').innerHTML);
        },

        "should increase player 2 score when when ball intersects left": function () {
            PONG.ball.fire('arnie:collision', PONG.left);
            Y.Assert.areSame('1', window.document.getElementById('score_player2').innerHTML);
        }
    }),
        
    reset = new Y.Test.Case({
        name: "reset",

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

        "should reset scores": function () {
            PONG.Y.fire('arnie:reset');
            Y.Assert.areSame('0', window.document.getElementById('score_player1').innerHTML);
            Y.Assert.areSame('0', window.document.getElementById('score_player2').innerHTML);
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

    // dirty cases that override functions in lieu of finding a different
    // mocking framework / refactoring
    Y.Test.Runner.add(reset);
    Y.Test.Runner.add(prePostIntersect);
    Y.Test.Runner.add(collision);

    Y.Test.Runner.run();
});
