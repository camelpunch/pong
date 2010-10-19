/*global window, YUI */
"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

window.PONG = (function () {
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
                return this.x;
            },

            right: function () {
                return this.x + this.width;
            },

            top: function () {
                return this.y;
            },

            bottom: function () {
                return this.y + this.height;
            }
        },

        // base for each paddle
        paddle,

        // container for sprites
        sprites = {},

        getCanvas = function () {
            return window.document.getElementById('pong');
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
        
        // set new positions given coords of cursor
        move = function (coords) {
            var 
            paddle1 = sprites.paddle1,
            paddle2 = sprites.paddle2,
            x = coords[0],
            y = coords[1],
            canvas = getCanvas(),
            lowest = canvas.height - (paddle1.height / 2);

            paddle1.y = y - (paddle1.height / 2);
            if (paddle1.y < 0) {
                paddle1.y = 0;
            }

            if (paddle1.y > lowest) {
                paddle1.y = lowest;
            }

            paddle2.y = 600 - y - (paddle2.height / 2);
            if (paddle2.y < 0) {
                paddle2.y = 0;
            }

            if (paddle2.y > lowest) {
                paddle2.y = lowest;
            }
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
        clear: clear,
        draw: draw,
        update: update,
        move: move
    };
}());

