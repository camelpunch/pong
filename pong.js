/*global window, YUI */
"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

YUI().use('event-custom', function (Y) {
    window.PONG = (function () {
        var canvas = window.document.getElementById('pong'),
        context = canvas.getContext('2d'),
        intervalId,
        sprites = [],
        collisionDetectors = [],

        // base object for each sprite
        sprite = function (name, base) {
            var publicSprite = {
                context: context,
                name: name,
                fillStyle: 'black',

                intersects: function (other) {
                    return !(
                        this.bottom < other.top ||
                        this.top > other.bottom ||
                        this.right < other.left ||
                        this.left > other.right
                    );
                },

                // set x, y coords and bounding box
                place: function (x, y) {
                    this.x = x;
                    this.y = y;
                    this.left = x;
                    this.right = this.width + x;
                    this.top = y;
                    this.bottom = this.height + y;
                    return this;
                },

                // true if sprite has been placed, false if missing values
                placed: function () {
                    var properties = ['x', 'y', 'left', 'right', 'top', 'bottom'],
                    i;

                    for (i = 0; i < properties.length; i += 1) {
                        if (typeof this[properties[i]] !== 'number') {
                            return false;
                        }
                    }

                    return true;
                },

                clear: function () {
                    this.context.clearRect(this.x, this.y, this.width, this.height);
                    return this;
                },

                draw: function () {
                    this.context.fillStyle = this.fillStyle;
                    this.context.fillRect(this.x, this.y, this.width, this.height);
                    return this;
                }
            };

            Y.mix(publicSprite, base);

            // add event handling
            if (publicSprite.detectCollisions) {
                Y.augment(publicSprite, Y.EventTarget);
                publicSprite.publish('pong:collision');
                collisionDetectors[collisionDetectors.length] = publicSprite;
            }

            sprites[sprites.length] = publicSprite;

            return publicSprite;
        },

        // update the game without user interaction
        update = function () {
            var collisionDetector, sprite, i, n;

            Y.fire('pong:pre-intersect');

            for (n = 0; n < collisionDetectors.length; n += 1) {
                collisionDetector = collisionDetectors[n];
                for (i = 0; i < sprites.length; i += 1) {
                    sprite = sprites[i];
                    if (collisionDetector !== sprite && collisionDetector.intersects(sprite)) {
                        collisionDetector.fire('pong:collision', sprite);
                    }
                }
            }

            Y.fire('pong:post-intersect');
        },

        // reset the game
        reset = function () {
            window.clearInterval(intervalId);

            Y.fire('pong:reset');

            intervalId = window.setInterval(update, 20);
        },

        // Top of game. No need to define left or right, as they should
        // never be evaluated
        top = {
            name: 'top',
            top: 0,
            bottom: 0
        },

        // Bottom of game. No need to define left, right or bottom, as they
        // should never be evaluated.
        bottom = {
            name: 'bottom',
            top: canvas.height
        },

        ball = sprite('ball', {
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

        paddle1 = sprite('paddle1', {
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

        paddle2 = sprite('paddle2', paddle1);

        paddle1.place(0, 0);
        paddle2.fillStyle = 'red';
        paddle2.place(
            canvas.width - paddle2.width, 
            canvas.height - paddle2.height
        );

        // add bottom and top to sprites
        sprites[sprites.length] = bottom;
        sprites[sprites.length] = top;

        // events
        Y.on('pong:reset', function () {
            if (ball.placed()) {
                ball.clear();
            }
            ball.place(paddle1.right + 1, 1);

            ball.xPixelsPerTick = 10;
            ball.yPixelsPerTick = 11;
        });

        Y.on('pong:pre-intersect', function () {
            paddle1.clear().move();
            paddle2.clear().move();
            ball.clear().move();
        });

        ball.on('pong:collision', function (other) {
            if (other === paddle1) {
                this.reverseX();
                this.place(other.right, this.y);
            } else if (other === paddle2) {
                this.reverseX();
                this.place(other.left - this.width, this.y);
            } else if (other === top || other === bottom) {
                this.reverseY();
            }
        });

        Y.on('pong:post-intersect', function () {
            paddle1.draw();
            paddle2.draw();
            ball.draw();
        });

        return {
            // objects used privately, also available publicly
            sprite: sprite,
            collisionDetectors: collisionDetectors,
            ball: ball,
            paddle1: paddle1,
            paddle2: paddle2,
            sprites: sprites,
            update: update,
            reset: reset
        };
    }());
});

