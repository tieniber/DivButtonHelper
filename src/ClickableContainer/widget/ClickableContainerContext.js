define([
    "dojo/_base/declare", "ClickableContainer/widget/ClickableContainer"
], function(declare, _divButtonWidget) {
    return declare("ClickableContainer.widget.ClickableContainerContext", [_divButtonWidget], {
    })
});
require(["ClickableContainer/widget/ClickableContainerContext"], function() {
    "use strict";
});
