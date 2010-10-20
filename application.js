/*global window, YUI */
"use strict";

// instantiation
YUI().use('node', function (Y) {
    var ms = 30,
    pong = window.PONG;

    Y.on('domready', function () {
        window.PONG.draw(window.PONG.sprites);
    });

    Y.on('mousemove', function (e) {
        var coords = [e.clientX, e.clientY];
        pong.clear();
        pong.move(coords);
        pong.draw(window.PONG.sprites);
    });

    // game loop
    window.setInterval(pong.update, ms);
});

