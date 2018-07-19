/*global logger*/
/*
    ClickableContainer
    ========================

    @file      : ClickableContainer.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Thu, 07 Jan 2016 22:19:25 GMT
    @copyright :
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/dom-class",
    "dojo/_base/lang",
    "dojo/_base/event"
], function(declare, _WidgetBase, dojoClass, dojoLang, dojoEvent) {
    "use strict";

    // Declare widget's prototype.
    return declare("ClickableContainer.widget.ClickableContainer", [_WidgetBase], {

        // Parameters configured in the Modeler.
        clickType: "mf",
        mfToExecute: "",
        nfToExecute: "",
        progressType: "",
        progressMsg: "",
        urlToAccess: "",
        urlToAccessAttr: "",
        newPage: false,
        newPageAttr: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,
        _alertDiv: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function() {
            logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function() {
            logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function(e) {
            logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function() {
            logger.debug(this.id + "._setupEventsContext");

            dojoClass.add(this.domNode.parentNode, "ClickableContainer");

            if (this.clickType === "mf") {
                this._setupMfClick();
            } else if (this.clickType === "url") {
                this._setupLinkClick();
            } else if (this.clickType === "page") {
                this._setupPageClick();
            } else if (this.clickType === "nf") {
                this._setupNfClick();
            }
        },
        _setupMfClick: function() {
            this.connect(this.domNode.parentNode, "click", function(e) {
                // Only on mobile stop event bubbling!
                this._stopBubblingEventOnMobile(e);

                // If a microflow has been set execute the microflow on a click.
                var params;
                if (this._contextObj) {
                    params = {
                        applyto: "selection",
                        guids: [this._contextObj.getGuid()],
                    }
                } else {
                    params = {
                        applyto: "none"
                    }
                }
                var args = {
                    params: params,
                    origin: this.mxform,
                    callback: function(obj) {
                        //Nothing to do...
                    },
                    error: dojoLang.hitch(this, function(error) {
                        logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
                    })
                };

                if (this.progressType !== "none") {
                    args.progress = this.progressType;
                    args.progressMsg = this.progressMsg;
                }

                mx.ui.action(this.mfToExecute, args, this);
            });
        },
        _setupNfClick: function() {
            this.connect(this.domNode.parentNode, "click", function(e) {
                // Only on mobile stop event bubbling!
                this._stopBubblingEventOnMobile(e);

                // If a microflow has been set execute the microflow on a click.
                mx.data.callNanoflow({
                    nanoflow: this.nfToExecute,
                    origin: this.mxform,
                    context: this.mxcontext,
                    callback: function(result) {
                    },
                    error: function(error) {
                        alert(error.message);
                    }
                });
            });
        },        
        _setupLinkClick: function() {
            this.connect(this.domNode.parentNode, "click", function(e) {
                if (this.newPageAttr) {
                    this.newPage = this._contextObj.get(this.newPageAttr);
                }

                if (this.urlToAccessAttr) {
                    this.urlToAccess = this._contextObj.get(this.urlToAccessAttr);
                }

                if (this.newPage) {
                    window.open(this.urlToAccess);
                } else {
                    window.location = this.urlToAccess;
                }
            });
        },
        _setupPageClick: function() {
            this.connect(this.domNode.parentNode, "click", function(e) {
                mx.ui.openForm(this.pageToOpen, {
                    location: this.openTarget,
                    callback: function(form) {}
                });
            });
        },
    });
});

require(["ClickableContainer/widget/ClickableContainer"], function() {
    "use strict";
});
