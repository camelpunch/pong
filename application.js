/*global window, YUI, PONG */
"use strict";

YUI().use('node', function (Y) {
    Y.on('domready', function (e) {
        Y.on('mousemove', function (e) {
            var paddle1 = PONG.sprites.paddle1,
            paddle2 = PONG.sprites.paddle2,
            y = e.clientY;

            paddle1.setY(y - (paddle1.height / 2));
            paddle2.setY(600 - y - (paddle2.height / 2));
        });

        Y.one(window.document).on('click', PONG.reset);

        PONG.reset();
    });
});

