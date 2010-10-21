/*global window, YUI, PONG */
"use strict";

YUI().use('node', function (Y) {
    var ms = 20;

    Y.on('mousemove', function (e) {
        var coords = [e.clientX, e.clientY];
        PONG.sprites.paddle1.clear();
        PONG.sprites.paddle2.clear();
        PONG.move(coords);
        PONG.sprites.paddle1.draw();
        PONG.sprites.paddle2.draw();
        PONG.sprites.ball.draw();
    });

    // game loop
    window.setInterval(PONG.update, ms);
});

