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
    // base object for each sprite
    var canvas = window.document.getElementById('pong'),
    
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

    getContext = function () {
        return canvas.getContext('2d');
    },

    // draw new positions of sprites
    draw = function (spritesToDraw, context) {
        var c = context ? context : getContext(),
            key,
            sprite;

        for (key in spritesToDraw) {
            if (spritesToDraw.hasOwnProperty(key)) {
                sprite = spritesToDraw[key];
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

        draw(sprites);
    },
    
    // set new positions given coords of cursor
    move = function (coords) {
        var paddle1 = sprites.paddle1,
        paddle2 = sprites.paddle2,
        y = coords[1];

        paddle1.setY(y - (paddle1.height / 2));
        paddle2.setY(canvas.height - y - (paddle2.height / 2));
    };

    // paddles
    paddle = Object.create(sprite);
    paddle.width = 32;
    paddle.height = 128;
    paddle.setY = function (y) {
        var lowest = canvas.height - this.height;

        this.y = y;

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > lowest) {
            this.y = lowest;
        }

        return this;
    };

    sprites.paddle1 = Object.create(paddle);
    sprites.paddle1.x = 10;
        
    sprites.paddle2 = Object.create(paddle);
    sprites.paddle2.x = 700;
    sprites.paddle2.y = canvas.height - sprites.paddle2.height;

    // ball
    sprites.ball = Object.create(sprite);
    sprites.ball.xPixelsPerTick = 10;
    sprites.ball.move = function () {
        this.x += this.xPixelsPerTick;
    };
    sprites.ball.reverse = function () {
        this.xPixelsPerTick = 0 - this.xPixelsPerTick;
    };
    sprites.ball.width = 32;
    sprites.ball.height = 32;
    sprites.ball.x = sprites.paddle1.x + sprites.paddle1.width;

    return {
        // objects used privately, also available publicly
        sprite: sprite,
        paddle: paddle,
        sprites: sprites,
        clear: clear,
        draw: draw,
        update: update,
        move: move
    };
}());

