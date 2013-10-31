/*!
Cloud4all Preferences Management Tools

Copyright 2013 Astea

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/prefsEditors/LICENSE.txt
*/

(function ($, fluid) {
    fluid.defaults("gpii.speakText", {
        gradeNames: ["fluid.prefs.fullNoPreview", "autoInit"],
        prefsEditor: {
            selectors: {
                saveAndApply: ".flc-uiOptions-save",
                resetAndApply: ".flc-uiOptions-reset",
                cancel: ".flc-uiOptions-cancel"
            },
            listeners: {
                "onReady.setSaveAndApplyText": {
                    "this": "{that}.dom.saveAndApply",
                    "method": "prop",
                    "args": ["value", "{that}.options.strings.saveAndApply"]
                },
                "onReady.setResetAndApplyText": {
                    "this": "{that}.dom.resetAndApply",
                    "method": "prop",
                    "args": ["value", "{that}.options.strings.resetAndApply"]
                },
                "onReady.setCancelText": {
                    "this": "{that}.dom.cancel",
                    "method": "prop",
                    "args": ["value", "{that}.options.strings.cancel"]
                },
                "onReady.onSaveVisibilityActualisation": {
                    "this": "{that}.dom.saveAndApply",
                    "method": "click",
                    "args": ["{that}.updateModelAllHidden"]
                },
                "onReady.onResetVisibilityActualisation": {
                    "this": "{that}.dom.resetAndApply",
                    "method": "click",
                    "args": ["{that}.updateModelAllHidden"]
                },
                "onReady.onCancelVisibilityActualisation": {
                    "this": "{that}.dom.cancel",
                    "method": "click",
                    "args": ["{that}.updateModelAllHidden"]
                }
            },
            invokers: {
                updateModelAllHidden: {
                    "funcName": "gpii.speakText.updateModelAllHidden",
                    "args": ["{speakText.panel.CollectivePanel}"]
                }
            },
            strings: {
                saveAndApply: {
                    expander: {
                        func: "gpii.speakText.lookupMsg",
                        args: ["{prefsEditorLoader}.msgBundle", "saveAndApply"]
                    }
                },
                resetAndApply: {
                    expander: {
                        func: "gpii.speakText.lookupMsg",
                        args: ["{prefsEditorLoader}.msgBundle", "resetAndApply"]
                    }
                },
                cancel: {
                    expander: {
                        func: "gpii.speakText.lookupMsg",
                        args: ["{prefsEditorLoader}.msgBundle", "cancel"]
                    }
                }
            }
        }
    });

    gpii.speakText.updateModelHeaderClicked = function (that, partialVisibleNOTNEEDED) {
        // if (extraVisible) {
        //     that.applier.requestChange("partialAdjustersVisibility", false);
        //     that.applier.requestChange("extraAdjustersVisibility", false);
        // } else 
        var partialVisible = that.model.partialAdjustersVisibility;
        // alert("vleze se v updateModelHeaderClicked i partialVisible e " + partialVisible);
        // alert("v modela:" + that.model.partialAdjustersVisibility)
        if (partialVisible) {
            // alert("v modela:" + that.model.partialAdjustersVisibility)
            that.applier.requestChange("partialAdjustersVisibility", false);
            // alert("v modela:" + that.model.partialAdjustersVisibility)
        } else {
            // alert("v modela:" + that.model.partialAdjustersVisibility)
            that.applier.requestChange("partialAdjustersVisibility", true);
            // alert("v modela:" + that.model.partialAdjustersVisibility)
        }

        hook = that;
    };

    // gpii.speakText.updateModelMoreLessClicked = function (that, extraVisible) {
    //     that.applier.requestChange("extraAdjustersVisibility", !extraVisible);
    // };

    gpii.speakText.updateModelAllHidden = function (panel) {
        // alert("tuka se vlese nekak si")
        panel.applier.requestChange("partialAdjustersVisibility", false);
        // panel.applier.requestChange("extraAdjustersVisibility", false);
    };

    gpii.speakText.showOrHideDependingOnState = function (that, showEvent, hideEvent) {
        var state = that.model.partialAdjustersVisibility;
        state ? showEvent() : hideEvent();
    };

    gpii.speakText.lookupMsg = function (messageResolver, value) {
        var looked = messageResolver.lookup([value]);
        return looked ? looked.template : looked;
    };

})(jQuery, fluid);
