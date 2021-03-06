/*
Copyright 2013 OCAD University
Copyright 2013 CERTH/HIT

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global demo:true, fluid, gpii, jQuery, window*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

// GPII store is for connecting the preference tools with the GPII server.
// The preference tools uses the cookie store by default, rather than the
// GPII store.
// To activate the GPII store in the preference tools, refer to comments in
// http://issues.gpii.net/browse/GPII-185

(function ($, fluid) {

    fluid.registerNamespace("gpii.prefs");

    gpii.prefs.commonTermsTransformationRules = {
        "http://registry\\.gpii\\.org/common/announceCapitals": [{
            value: "gpii_primarySchema_announceCapitals"
        }],
        "http://registry\\.gpii\\.org/common/keyEcho": [{
            value: "gpii_primarySchema_keyEcho"
        }],
        "http://registry\\.gpii\\.org/common/punctuationVerbosity": [{
            value: "gpii_primarySchema_punctuationVerbosity"
        }],
        "http://registry\\.gpii\\.org/common/screenReaderBrailleOutput": [{
            value: "gpii_primarySchema_screenReaderBrailleOutput"
        }],
        "http://registry\\.gpii\\.org/common/auditoryOutLanguage": [{
            value: "gpii_primarySchema_screenReaderLanguage"
        }],
        "http://registry\\.gpii\\.org/common/screenReaderTTSEnabled": [{
            value: "gpii_primarySchema_speakText"
        }],
        "http://registry\\.gpii\\.org/common/speakTutorialMessages": [{
            value: "gpii_primarySchema_speakTutorialMessages"
        }],
        "http://registry\\.gpii\\.org/common/readingUnit": [{
            value: "gpii_primarySchema_textHighlighting"
        }],
        "http://registry\\.gpii\\.org/common/language": [{
            value: "gpii_primarySchema_universalLanguage"
        }],
        "http://registry\\.gpii\\.org/common/volume": [{
            transform: {
                type: "fluid.transforms.linearScale",
                valuePath: "gpii_primarySchema_universalVolume",
                factor: 0.01,
                outputPath: "value"
            }
        }],
        "http://registry\\.gpii\\.org/common/pitch": [{
            transform: {
                type: "fluid.transforms.linearScale",
                valuePath: "gpii_primarySchema_voicePitch",
                factor: 0.01,
                outputPath: "value"
            }
        }],
        "http://registry\\.gpii\\.org/common/volumeTTS": [{
            transform: {
                type: "fluid.transforms.linearScale",
                valuePath: "gpii_primarySchema_volume",
                factor: 0.01,
                outputPath: "value"
            }
        }],
        "http://registry\\.gpii\\.org/common/wordEcho": [{
            value: "gpii_primarySchema_wordEcho"
        }],
        "http://registry\\.gpii\\.org/common/speechRate": [{
            value: "gpii_primarySchema_wordsSpokenPerMinute"
        }],
        "http://registry\\.gpii\\.org/common/magnification": [{
            transform: {
                type: "fluid.transforms.linearScale",
                valuePath: "gpii_primarySchema_magnification",
                factor: 0.01,
                outputPath: "value"
            }
        }],
        "http://registry\\.gpii\\.org/common/fontSize": [{
            value: "gpii_primarySchema_fontSize"
        }],
        "http://registry\\.gpii\\.org/common/highContrastEnabled": [{
            value: "gpii_primarySchema_contrastEnabled"
        }],
        "http://registry\\.gpii\\.org/common/highContrastTheme": [{
            value: "gpii_primarySchema_contrast_theme"
        }],
        "http://registry\\.gpii\\.org/common/cursorSize": [{
            transform: {
                type: "fluid.transforms.linearScale",
                valuePath: "gpii_primarySchema_cursorSize",
                factor: 0.2,
                outputPath: "value"
            }
        }],
        "http://registry\\.gpii\\.org/common/magnifierEnabled": [{
            value: "gpii_primarySchema_magnifierEnabled"
        }],
        "http://registry\\.gpii\\.org/common/tracking": [{
            value: "gpii_primarySchema_tracking"
        }],
        "http://registry\\.gpii\\.org/common/trackingTTS": [{
            value: "gpii_primarySchema_screenReaderTracking"
        }],
        "http://registry\\.gpii\\.org/common/magnifierPosition": [{
            value: "gpii_primarySchema_magnificationPosition"
        }],
        "http://registry\\.gpii\\.org/common/showCrosshairs": [{
            value: "gpii_primarySchema_showCrosshairs"
        }]
    };

    gpii.prefs.commonTermsInverseTransformationRules = fluid.model.transform.invertConfiguration(gpii.prefs.commonTermsTransformationRules);

    fluid.registerNamespace("gpii.prefs.gpiiStore");

    gpii.prefs.gpiiStore.onSuccessfulSet = function (session, data) {
        /*
         * TODO: Do we still need this check now that we can query the system for the logged in user?
         * Will we query GPII every time a component needs to know about the currently logged user or
         * will we have GPIISession caching it and getting it from there? Relevant JIRA:
         *      http://issues.gpii.net/browse/GPII-623
         */
        if (session.options.loggedUser != data.token) {
            // new user, trigger accountCreated event
            session.events.accountCreated.fire(data.token);
        } else {
            // already logged in, refresh AT applications
            // log user out
            session.logout();
            // and log user in again
            session.login(data.token);
            /* TODO: The above procedure should normally be happening on the GPII side.
             * Preference management tools should not have session management responsibilities.
             * This is a work-around for the pilot2 tests.
             * */
        }
        fluid.log("POST: Saved to GPII server");
    };

    /**
     * gpiiStore Subcomponent that uses GPII server for persistence.
     * It sends request to the GPII server to save and retrieve model information
     * @param {Object} options
     */
    fluid.defaults("gpii.prefs.gpiiStore", {
        gradeNames: ["fluid.prefs.dataSource", "fluid.eventedComponent", "autoInit"],
        url: "http://localhost:8081/",
        // instantiate the gpiiSession component
        components: {
            gpiiSession: {
                type: "gpii.prefs.gpiiSession"
            }
        },
        events: {
            onSetSuccess: null
        },
        listeners: {
            "onSetSuccess.loginUser": "gpii.prefs.gpiiStore.onSuccessfulSet"
        },
        gpiiEntry: "http://registry.gpii.org/applications/gpii.prefs",
        invokers: {
            get: {
                funcName: "gpii.prefs.gpiiStore.get",
                args: ["{that}.options", "{gpiiSession}.options", "{that}.inverseModelTransform"],
                dynamic: true
            },
            set: {
                funcName: "gpii.prefs.gpiiStore.set",
                args: ["{arguments}.0", "{that}.options", "{gpiiSession}", "{that}.modelTransform", "{that}.events.onSetSuccess.fire"],
                dynamic: true
            },
            modelTransform: {
                funcName: "fluid.model.transform",
                args: ["{arguments}.0", gpii.prefs.commonTermsTransformationRules]
            },
            inverseModelTransform: {
                funcName: "fluid.model.transform",
                args: ["{arguments}.0", gpii.prefs.commonTermsInverseTransformationRules]
            }
        }
    });

    gpii.prefs.gpiiStore.get = function (settings, sessionSettings, modelTransformFunc) {
        var gpiiModel;

        if (sessionSettings.loggedUser !== null) {

            var urlToPost = sessionSettings.loggedUser ? (settings.url + "user/" + sessionSettings.loggedUser) : (settings.url + "user/");

            $.ajax({
                url: urlToPost,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    gpiiModel = modelTransformFunc(fluid.get(data, ["preferences"]));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    fluid.log("GET: Error at retrieving from GPII! Test status: " + textStatus);
                    fluid.log(errorThrown);
                }
            });
        }

        return gpiiModel;
    };

    gpii.prefs.gpiiStore.set = function (model, settings, session, modelTransformFunc, onSuccessfulSetFunction) {
        var transformedModel = modelTransformFunc(model);

        var urlToPost = session.options.loggedUser ? (settings.url + "user/" + session.options.loggedUser) : (settings.url + "user/");
        $.ajax({
            url: urlToPost,
            type: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(transformedModel),
            success: function (data) {
                onSuccessfulSetFunction(session, data);
            },
            error: function () {
                fluid.log("POST: Error at saving to GPII server");
            }
        });
    };

    fluid.defaults("gpii.prefs.gpiiSettingsStore", {
        gradeNames: ["fluid.globalSettingsStore", "autoInit"],
        settingsStoreType: "gpii.prefs.gpiiStore",
        distributeOptions: [{
            source: "{that}.options.settingsStoreType",
            removeSource: true,
            target: "{that > settingsStore}.type"
        }]
    });

})(jQuery, fluid);
