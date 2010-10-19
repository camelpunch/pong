/*global window, YUI */
"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

window.PAINTER = (function () {
    var Y,

        // base object for each sprite
        sprite = {
            y: 0,
            fillStyle: 'black',

            hits: function (other) {
                if (this.bottom() < other.top() ||
                    this.top() > other.bottom() ||
                    this.right() < other.left() ||
                    this.left() > other.right()) {
                    return false;
                }
                return true;
            },

            left: function () {
                this.leftPos = this.x - (this.width / 2);
                return this.leftPos;
            },

            right: function () {
                this.rightPos = this.x + (this.width / 2);
                return this.rightPos;
            },

            top: function () {
                this.topPos = this.y - (this.height / 2);
                return this.topPos;
            },

            bottom: function () {
                this.bottomPos = this.y + (this.height / 2);
                return this.bottomPos;
            }
        },

        // base for each paddle
        paddle,

        // container for sprites
        sprites = {},

        getCanvas = function () {
            return window.document.getElementById('painter');
        },

        getContext = function () {
            return getCanvas().getContext('2d');
        },

        // draw new positions of sprites
        draw = function () {
            var c = getContext(),
                key,
                sprite;

            for (key in sprites) {
                if (sprites.hasOwnProperty(key)) {
                    sprite = sprites[key];
                    c.fillStyle = sprite.fillStyle;
                    c.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
                }
            }
        },

        // clear old positions of sprites
        clear = function () {
            var c = getContext(),
                key,
                sprite;

            for (key in sprites) {
                if (sprites.hasOwnProperty(key)) {
                    sprite = sprites[key];
                    c.clearRect(sprite.x, sprite.y, sprite.width, sprite.height);
                }
            }
        },

        // update the game without user interaction
        update = function () {
            var ball = sprites.ball,
                paddle1 = sprites.paddle1,
                paddle2 = sprites.paddle2;

            clear();

            ball.move();

            if (ball.hits(paddle2)) {
                ball.reverse();
            }

            if (ball.hits(paddle1)) {
                ball.reverse();
            }

            draw();
        },
        
        // set new positions given mouse movement
        move = function (e) {
            var paddle1 = sprites.paddle1,
                paddle2 = sprites.paddle2;

            clear();

            paddle1.y = e.clientY - (paddle1.height / 2);
            if (paddle1.y < 0) {
                paddle1.y = 0;
            }

            paddle2.y = 600 - e.clientY - (paddle2.height / 2);
            if (paddle2.y < 0) {
                paddle2.y = 0;
            }

            draw();
        };

    // paddles
    paddle = Object.create(sprite);
    paddle.width = 32;
    paddle.height = 128;

    sprites.paddle1 = Object.create(paddle);
    sprites.paddle1.x = 10;
        
    sprites.paddle2 = Object.create(paddle);
    sprites.paddle2.x = 700;
    sprites.paddle2.y = 600 - (sprites.paddle2.height / 2);

    // ball
    sprites.ball = Object.create(sprite);
    sprites.ball.pixelsPerTick = 10;
    sprites.ball.move = function () {
        this.x += this.pixelsPerTick;
    };
    sprites.ball.reverse = function () {
        this.pixelsPerTick = 0 - this.pixelsPerTick;
    };
    sprites.ball.width = 32;
    sprites.ball.height = 32;
    sprites.ball.x = sprites.paddle1.x + sprites.paddle1.width;

    return {
        // objects used privately, also available publicly
        sprite: sprite,
        sprites: sprites,
        draw: draw,
        update: update,
        move: move
    };
}());

