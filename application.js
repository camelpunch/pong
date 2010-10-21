/*global window, YUI, PONG */
"use strict";

YUI().use('node', function (Y) {
    Y.on('mousemove', function (e) {
        var coords = [e.clientX, e.clientY];
        PONG.sprites.paddle1.clear();
        PONG.sprites.paddle2.clear();
        PONG.move(coords);
        PONG.sprites.paddle1.draw();
        PONG.sprites.paddle2.draw();
        PONG.sprites.ball.draw();
    });

    Y.one(window.document).on('click', function () {
        PONG.reset();
    });
});

