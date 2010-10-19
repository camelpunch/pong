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

        sprite = {
            y: 0,
            fillStyle: 'black'
        },

        paddle,
        sprites = {},

        getCanvas = function () {
            return window.document.getElementById('painter');
        },

        getContext = function () {
            return getCanvas().getContext('2d');
        },

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
        
        move = function (e) {
            clear();
            sprites.paddle1.y = e.clientY - (sprites.paddle1.height / 2);
            draw();
        };

    paddle = Object.create(sprite);
    paddle.width = 32;
    paddle.height = 128;

    sprites.paddle1 = Object.create(paddle);
    sprites.paddle1.x = 10;
        
    sprites.paddle2 = Object.create(paddle);
    sprites.paddle2.x = 700;

    YUI().use('node', 'io', 'json', function (yui) {
        Y = yui;
        Y.on('domready', draw);
        Y.on('mousemove', move);
    });

    return {
        // objects used privately, also available publicly
        sprites: sprites
    };
}());

