/*global window, YUI, ARNIE */
"use strict";

YUI().use('test', 'event-custom', function (Y) {
    var canvas = window.document.getElementById('pong'),

    sprite = new Y.Test.Case({
        name: 'sprite',

        setUp: function () {
            this.game = ARNIE.game(canvas, Y);

            this.sprite = this.game.sprite('somesprite', {
                x: 40,
                y: 70,
                width: 10,
                height: 30,
                fillStyle: 'blue'
            });

            this.bat = this.game.sprite('Bat', {
                width: 10,
                height: 30
            });

            this.ball = this.game.sprite('Ball', {
                width: 5,
                height: 5
            });
        },

        "should set name": function () {
            Y.Assert.areSame('somesprite', this.sprite.name);
        },

        "should be added to sprites": function () {
            Y.ArrayAssert.contains(this.sprite, this.game.sprites);
        },

        "should set fillStyle": function () {
            Y.Assert.areSame('blue', this.sprite.fillStyle);
        },

        "should be added to collisionDetectors if detectCollisions true": function () {
            var sprite = this.game.sprite('mario', {
                detectCollisions: true
            });

            Y.ArrayAssert.contains(sprite, this.game.collisionDetectors);
        },

        "place should set left to be x position": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(50, this.sprite.left);
        },

        "place should set right to be x position plus width": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(60, this.sprite.right);
        },

        "place should set top to be y position": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(50, this.sprite.top);
        },

        "bottom should be y position plus height": function () {
            this.sprite.place(50, 50);
            Y.Assert.areSame(80, this.sprite.bottom);
        },

        "placed should be false when ball hasn't been placed": function () {
            Y.Assert.isFalse(this.ball.placed());
        },

        "placed should be true when ball has been placed": function () {
            this.ball.place(0, 0);
            Y.Assert.isTrue(this.ball.placed());
        },

        "intersects should be true when ball LHS over bat RHS": function () {
            this.bat.place(0, 50);
            this.ball.place(9, 50);

            Y.assert(this.bat.intersects(this.ball));
        },

        "intersects should be false when ball RHS not over bat LHS": function () {
            this.bat.place(0, 50);
            this.ball.place(11, 50);

            Y.Assert.isFalse(this.bat.intersects(this.ball));
        },

        "clear should clear within the current dimensions": function () {
            this.bat.context = Y.Mock();

            Y.Mock.expect(this.bat.context, {
                method: 'clearRect',
                args: [this.bat.x, this.bat.y, this.bat.width, this.bat.height]
            });

            this.bat.clear();

            Y.Mock.verify(this.bat.context);
        },

        "draw should set the fill style": function () {
            this.bat.fillStyle = 'green';

            this.bat.context = {
                fillStyle: undefined,
                fillRect: function () {
                }
            };

            this.bat.draw();

            Y.Assert.areSame('green', this.bat.context.fillStyle);
        },

        "draw should draw using the current dimensions": function () {
            this.bat.context = Y.Mock();

            Y.Mock.expect(this.bat.context, {
                method: 'fillRect',
                args: [this.bat.x, this.bat.y, this.bat.width, this.bat.height]
            });

            this.bat.draw();

            Y.Mock.verify(this.bat.context);
        }
    }),
        
    update = new Y.Test.Case({
        name: "update",

        setUp: function () {
            var that = this;

            this.game = ARNIE.game(canvas, Y);
            this.preCalled = false;
            this.postCalled = false;
            this.collisions = {
                mario: [],
                luigi: []
            };

            this.mario = this.game.sprite('mario', {
                detectCollisions: true,
                width: 15,
                height: 24
            });

            this.luigi = this.game.sprite('luigi', {
                detectCollisions: true,
                width: 15,
                height: 32
            });

            this.shell = this.game.sprite('shell', {
                width: 15,
                height: 32
            });

            this.mario.place(0, 100);
            this.shell.place(15, 100);
            this.luigi.place(30, 100);

            this.mario.on('arnie:collision', function (other) {
                that.collisions.mario.push(other.name);
            });

            this.luigi.on('arnie:collision', function (other) {
                that.collisions.luigi.push(other.name);
            });

            Y.on('arnie:pre-intersect', function () {
                that.preCalled = true;
            });
            
            Y.on('arnie:post-intersect', function () {
                that.postCalled = true;
            });

            this.game.update();
        },

        "should fire arnie:pre-intersect": function () {
            Y.Assert.isTrue(this.preCalled);
        },

        "should fire arnie:post-intersect": function () {
            Y.Assert.isTrue(this.postCalled);
        },

        "should fire collision for each collisionDetector colliding": function () {
            Y.ArrayAssert.itemsAreSame(['shell'], this.collisions.mario);
            Y.ArrayAssert.itemsAreSame(['shell'], this.collisions.luigi);
        }
    }),
    
    reset = new Y.Test.Case({
        setUp: function () {
            var that = this;

            this.game = ARNIE.game(canvas, Y);

            this.game.update = function () {
                // set public version of update to do nothing
            };

            this.resetCalled = false;
            this.updateCalled = false;

            Y.on('arnie:reset', function () {
                that.resetCalled = true;
            });

            Y.on('arnie:pre-intersect', function () {
                // we assume pre-intersect means private update called
                that.updateCalled = true;
            });

            this.game.reset();
        },

        "should fire arnie:reset": function () {
            Y.Assert.isTrue(this.resetCalled);
        },

        "should call private update": function () {
            this.wait(function () {
                Y.Assert.isTrue(this.updateCalled);
            }, 50);
        }
    });

    Y.Test.Runner.add(sprite);
    Y.Test.Runner.add(update);
    Y.Test.Runner.add(reset);
    Y.Test.Runner.run();
});
