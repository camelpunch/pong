/*global window, YUI, ARNIE, PONG */
"use strict";

YUI().use('node', 'event-custom', function (Y) {
    window.PONG = (function () {
        var canvas = window.document.getElementById('pong'),
        game = ARNIE.game(canvas, Y),

        player1 = {
            score: 0
        },

        player2 = {
            score: 0
        },

        ball = game.sprite('ball', {
            detectCollisions: true,

            move: function () {
                this.place(this.x + this.xPixelsPerTick, this.y + this.yPixelsPerTick);
            },
            reverseX: function () {
                this.xPixelsPerTick = 0 - this.xPixelsPerTick;
            },
            reverseY: function () {
                this.yPixelsPerTick = 0 - this.yPixelsPerTick;
            },
            width: 32,
            height: 32
        }),

        paddle1 = game.sprite('paddle1', {
            width: 32,
            height: 128,
            fillStyle: 'blue',
            setY: function (y) {
                var lowest = canvas.height - this.height;

                // simple object used to store next position
                this.next = {
                    place: this.place
                };

                if (y < 0) {
                    this.next.place(this.x, 0);
                } else if (y > lowest) {
                    this.next.place(this.x, lowest);
                } else {
                    this.next.place(this.x, y);
                }

                return this;
            },
            move: function () {
                if (this.next) {
                    this.place(this.next.x, this.next.y);
                }
                return this;
            }
        }),

        paddle2 = game.sprite('paddle2', paddle1),
        
        top = game.sprite('top', {
            width: canvas.width,
            height: 1
        }),
            
        bottom = game.sprite('bottom', {
            width: canvas.width,
            height: 1
        }),
        
        left = game.sprite('left', {
            width: 1,
            height: canvas.height
        }),

        right = game.sprite('right', {
            width: 1,
            height: canvas.height
        }),
            
        startRound = function () {
            if (ball.placed()) {
                ball.clear();
            }
            ball.place(paddle1.right + 1, 1);

            ball.xPixelsPerTick = 10;
            ball.yPixelsPerTick = 11;

            Y.one('#score_player1').setContent(player1.score);
            Y.one('#score_player2').setContent(player2.score);
        };

        paddle1.place(0, 0);
        paddle2.fillStyle = 'red';
        paddle2.place(
            canvas.width - paddle2.width, 
            canvas.height - paddle2.height
        );

        top.place(0, 0);
        bottom.place(0, canvas.height);
        left.place(0, 0);
        right.place(canvas.width, 0);

        // events
        Y.on('arnie:pre-intersect', function () {
            paddle1.clear().move();
            paddle2.clear().move();
            ball.clear().move();
        });

        ball.on('arnie:collision', function (other) {
            switch (other) {
            case paddle1:
                this.reverseX();
                this.place(other.right, this.y);
                break;
            case paddle2:
                this.reverseX();
                this.place(other.left - this.width, this.y);
                break;
            case left:
                player2.score += 1;
                startRound();
                break;
            case right:
                player1.score += 1;
                startRound();
                break;
            case top:
            case bottom:
                this.reverseY();
                break;
            }
        });

        Y.on('arnie:post-intersect', function () {
            paddle1.draw();
            paddle2.draw();
            ball.draw();
        });

        Y.on('arnie:reset', function () {
            startRound();
        });

        Y.on('mousemove', function (e) {
            paddle1.setY(e.clientY - (paddle1.height / 2));
            paddle2.setY(600 - e.clientY - (paddle2.height / 2));
        });

        return {
            // objects used privately, also available publicly
            Y: Y,
            game: game,
            startRound: startRound,
            ball: ball,
            paddle1: paddle1,
            paddle2: paddle2,
            bottom: bottom,
            top: top,
            left: left,
            right: right
        };
    }());

    Y.on('domready', function (e) {
        Y.one(window.document).on('click', function () {
            PONG.game.reset();
        });

        PONG.game.reset();
    });
});
