/*global window, ARNIE */
"use strict";

window.ARNIE = (function () {
    var game = function (canvas, Y) {
        var context = canvas.getContext('2d'),
        intervalId,
        sprites = [],
        collisionDetectors = [],

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

            publicSprite = Y.merge(publicSprite, base);

            // add event handling
            if (publicSprite.detectCollisions) {
                Y.augment(publicSprite, Y.EventTarget);
                publicSprite.publish('arnie:collision');
                collisionDetectors[collisionDetectors.length] = publicSprite;
            }

            sprites[sprites.length] = publicSprite;

            return publicSprite;
        },

        // update the game without user interaction
        update = function () {
            var collisionDetector, sprite;

            Y.fire('arnie:pre-intersect');

            Y.each(collisionDetectors, function (collisionDetector) {
                Y.each(sprites, function (sprite) {
                    if (collisionDetector !== sprite && collisionDetector.intersects(sprite)) {
                        collisionDetector.fire('arnie:collision', sprite);
                    }
                });
            });

            Y.fire('arnie:post-intersect');
        },

        // reset the game
        reset = function () {
            window.clearInterval(intervalId);

            Y.fire('arnie:reset');

            intervalId = window.setInterval(update, 20);
        };

        return {
            collisionDetectors: collisionDetectors,
            sprite: sprite,
            sprites: sprites,
            reset: reset,
            update: update
        };
    };

    return {
        game: game
    };
}());

