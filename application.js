/*global window, YUI */
"use strict";

// instantiation
YUI().use('node', function (Y) {
    var ms = 30;

    Y.on('domready', window.PONG.draw);
    Y.on('mousemove', window.PONG.move);

    // start the game
    window.setInterval(window.PONG.update, ms);
});

