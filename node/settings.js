// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

(function () {
  "use strict";

  var filename = "33seconds";
  var fileType = ".wav";
  var filepath = `../sampleAudio/${filename}${fileType}`; // 16000 Hz, Mono

  module.exports = {

    // Replace with your own subscription key, service region (e.g., "westus"),
    // and recognition language.
    subscriptionKey: "91add66ed08944f9869cb610d0335082",
    serviceRegion: "westus2", // e.g., "westus"
    language: "en-US",
    translateToLanguage: "hi",

    // Replace with the full path to a wav file you want to recognize.
    filename: filepath, // 16000 Hz, Mono

    // Replace with your own Language Understanding subscription key (endpoint
    // key), region, and app ID in case you want to run the intent sample.
    luSubscriptionKey: "YourLanguageUnderstandingSubscriptionKey",
    luServiceRegion: "YourLanguageUnderstandingServiceRegion",
    luAppId: "YourLanguageUnderstandingAppId",
  };
}());
