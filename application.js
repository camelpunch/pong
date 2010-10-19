/*global window, YUI */
"use strict";

// instantiation
YUI().use('node', 'io', 'json', function (Y) {
    var ms = 30;

    Y.on('domready', window.PAINTER.draw);
    Y.on('mousemove', window.PAINTER.move);

    // start the game
    window.setInterval(window.PAINTER.update, ms);
});

