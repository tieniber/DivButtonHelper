define([
    "dojo/_base/declare", "ClickableContainer/widget/ClickableContainer"
], function(declare, _divButtonWidget) {
    return declare("ClickableContainer.widget.ClickableContainerOffline", [_divButtonWidget], {
    })
});
require(["ClickableContainer/widget/ClickableContainerOffline"], function() {
    "use strict";
});
