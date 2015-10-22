GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new multiaction widget.
     * @class
     */
    function MultiAction(level, nodesInLine) {
        this.shape = null;
        this.nodesInLine = nodesInLine;
        this.x1 = nodesInLine[0].x;
        this.x2 = nodesInLine[nodesInLine.length - 1].x;
        this.level = level;
        this.y = this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS +
            GTE.CONSTANTS.CIRCLE_SIZE / 2;
    }

    MultiAction.prototype.draw = function() {
        var width = (this.x2 + GTE.CONSTANTS.CIRCLE_SIZE) - this.x1;

        this.shape = GTE.canvas.rect(width, GTE.CONSTANTS.CIRCLE_SIZE)
            .radius(GTE.CONSTANTS.CIRCLE_SIZE / 2)
            .fill({
                color: '#9d9d9d'
            })
            .addClass('multiaction-rect');
        this.shape.translate(this.x1,
            this.y - GTE.CONSTANTS.CIRCLE_SIZE / 2);
        var thisMultiAction = this;
        this.shape.mouseover(function() {
            thisMultiAction.interaction();
        });
        this.shape.mouseout(function() {
            thisMultiAction.interaction();
        });
        this.shape.click(function() {
            thisMultiAction.onClick();
        });
    };

    MultiAction.prototype.interaction = function() {
        this.shape.toggleClass("display");
    };

    MultiAction.prototype.onClick = function() {
        console.log("click");
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                // Find the smallest number S and largest number L of children
                // for the nodes in the line
                var smallestAndLargest = this.findSmallestAndLargest();
                // If S < L, add children to those nodes so that ALL nodes have L children now.
                if (smallestAndLargest.smallest < smallestAndLargest.largest) {
                    for (var i = 0; i < this.nodesInLine.length; i++) {
                        while (this.nodesInLine[i].children.length < smallestAndLargest.largest) {
                            this.nodesInLine[i].onClick();
                        }
                    }
                }
                // If L = 0, add two children to each node on the multiaction line, else
                // If S = L, add one child to each node on the multiaction line.
                else if (smallestAndLargest.largest === 0 || smallestAndLargest.smallest === smallestAndLargest.largest) {
                    for (var j = 0; j < this.nodesInLine.length; j++) {
                        this.nodesInLine[j].onClick();
                    }
                }
                break;
            case GTE.MODES.DELETE:
                // if ANY of the nodes in the multiaction line have children,
                // delete all their children but keep the node itself as part
                // of the tree (i.e. even if some nodes are leaves already,
                // do not delete them). otherwise (that is, ALL nodes in the
                // multiaction line are leaves), delete all these leaves.
                var allLeaves = true;
                for (var k = 0; k < this.nodesInLine.length; k++) {
                    if (this.nodesInLine[k].children.length > 0) {
                        allLeaves = false;
                        this.nodesInLine[k].onClick();
                    }
                }
                if (allLeaves) {
                    for (k = 0; k < this.nodesInLine.length; k++) {
                        this.nodesInLine[k].onClick();
                    }
                }
                break;
        }
    };

    MultiAction.prototype.findSmallestAndLargest = function() {
        var smallest = 100000;
        var largest = -1;
        for (var i = 0; i < this.nodesInLine.length; i++) {
            if (this.nodesInLine[i].children.length > largest) {
                largest = this.nodesInLine[i].children.length;
            }
            if (this.nodesInLine[i].children.length < smallest) {
                smallest = this.nodesInLine[i].children.length;
            }
        }
        return {
            smallest: smallest,
            largest: largest
        };
    };

    // Add class to parent module
    parentModule.MultiAction = MultiAction;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
