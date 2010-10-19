/*global window, YUI */
"use strict";

// instantiation
YUI().use('node', function (Y) {
    var ms = 30,
    pong = window.PONG;

    Y.on('domready', window.PONG.draw);

    Y.on('mousemove', function (e) {
        var coords = [e.clientX, e.clientY];
        pong.clear();
        pong.move(coords);
        pong.draw();
    });

    // game loop
    window.setInterval(pong.update, ms);
});

