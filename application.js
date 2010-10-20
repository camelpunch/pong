/*global window, YUI, PONG */
"use strict";

YUI().use('node', function (Y) {
    var ms = 30;

    Y.on('domready', function () {
        PONG.draw(PONG.sprites);
    });

    Y.on('mousemove', function (e) {
        var coords = [e.clientX, e.clientY];
        PONG.clear();
        PONG.move(coords);
        PONG.draw(PONG.sprites);
    });

    // game loop
    window.setInterval(PONG.update, ms);
});

