/*global window, YUI */
"use strict";

YUI().use('test', function (Y) {
    var someCase = new Y.Test.Case({
        name: "someFunction",

        "should do something": function () {
        }
    });
        
    Y.Test.Runner.add(someCase);
    Y.Test.Runner.run();
});
