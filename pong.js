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
            return !(
                this.bottom < other.top ||
                this.top > other.bottom ||
                this.right < other.left ||
                this.left > other.right
            );
        },

        place: function (x, y) {
            this.x = x;
            this.y = y;
            this.left = x;
            this.right = this.width + x;
            this.top = y;
            this.bottom = this.height + y;
            return this;
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

            // no need to define left and right, as they should never be
            // evaluated
            bottom = {
                top: canvas.height,
                bottom: canvas.height
            },

            paddle1 = sprites.paddle1,
            paddle2 = sprites.paddle2;

        clear();

        ball.move();

        if (ball.hits(paddle1) || ball.hits(paddle2)) {
            ball.reverseX();
        }

        if (ball.hits(bottom)) {
            ball.reverseY();
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

        if (y < 0) {
            this.place(this.x, 0);
        } else if (y > lowest) {
            this.place(this.x, lowest);
        } else {
            this.place(this.x, y);
        }

        return this;
    };

    sprites.paddle1 = Object.create(paddle);
    sprites.paddle1.place(10, 0);
        
    sprites.paddle2 = Object.create(paddle);
    sprites.paddle2.place(700, canvas.height - sprites.paddle2.height);

    // ball
    sprites.ball = Object.create(sprite);
    sprites.ball.xPixelsPerTick = 10;
    sprites.ball.yPixelsPerTick = 11;
    sprites.ball.move = function () {
        this.place(this.x + this.xPixelsPerTick, this.y + this.yPixelsPerTick);
    };
    sprites.ball.reverseX = function () {
        this.xPixelsPerTick = 0 - this.xPixelsPerTick;
    };
    sprites.ball.reverseY = function () {
        this.yPixelsPerTick = 0 - this.yPixelsPerTick;
    };
    sprites.ball.width = 32;
    sprites.ball.height = 32;
    sprites.ball.place(sprites.paddle1.right, 0);

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

