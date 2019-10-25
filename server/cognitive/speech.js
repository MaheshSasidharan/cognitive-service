// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// pull in the required packages.
const sdk = require("microsoft-cognitiveservices-speech-sdk");

(function () {
  "use strict";

  const speechService = function (settings, pushStream, wsClient) {

    const processedSpeech = function (result) {
      wsClient.emit("processedSpeech", result);
    };

    const endOfSpeechRecognition = function (result) {
      wsClient.emit("endOfSpeechRecognition", result);
    };
    // now create the audio-config pointing to our stream and
    // the speech config specifying the language.
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const speechConfig = sdk.SpeechConfig.fromSubscription(settings.subscriptionKey, settings.serviceRegion);

    // setting the recognition language to English.
    speechConfig.speechRecognitionLanguage = settings.speechRecognitionLanguage;

    // create the speech recognizer.
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

    // The event recognizing signals that an intermediate recognition result is received.
    // You will receive one or more recognizing events as a speech phrase is recognized, with each containing
    // more recognized speech. The event will contain the text for the recognition since the last phrase was recognized.
    recognizer.recognizing = function (s, e) {
      const str = "(recognizing) Reason: " + sdk.ResultReason[e.result.reason] + " Text: " + e.result.text;
      console.log(str);
      processedSpeech(str);
    };

    // The event recognized signals that a final recognition result is received.
    // This is the final event that a phrase has been recognized.
    // For continuous recognition, you will get one recognized event for each phrase recognized.
    recognizer.recognized = function (s, e) {
      // Indicates that recognizable speech was not detected, and that recognition is done.
      if (e.result.reason === sdk.ResultReason.NoMatch) {
        const noMatchDetail = sdk.NoMatchDetails.fromResult(e.result);
        const str = "(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " NoMatchReason: " + sdk.NoMatchReason[noMatchDetail.reason];
        console.log("\r\n(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " NoMatchReason: " + sdk.NoMatchReason[noMatchDetail.reason]);
        processedSpeech(str);
      } else {
        const str = "(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " Text: " + e.result.text;
        processedSpeech(str);
        console.log("\r\n(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " Text: " + e.result.text);
      }
    };

    // The event signals that the service has stopped processing speech.
    // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
    // This can happen for two broad classes of reasons.
    // 1. An error is encountered.
    //    In this case the .errorDetails property will contain a textual representation of the error.
    // 2. Speech was detected to have ended.
    //    This can be caused by the end of the specified file being reached, or ~20 seconds of silence from a microphone input.
    recognizer.canceled = function (s, e) {
      const str = "(cancel) Reason: " + sdk.CancellationReason[e.reason];
      if (e.reason === sdk.CancellationReason.Error) {
        str += ": " + e.errorDetails;
      }
      console.log(str);
      processedSpeech(str);
    };

    // Signals that a new session has started with the speech service
    recognizer.sessionStarted = function (s, e) {
      const str = "(sessionStarted) SessionId: " + e.sessionId;
      console.log(str);
      processedSpeech(str);
    };

    // Signals the end of a session with the speech service.
    recognizer.sessionStopped = function (s, e) {
      const str = "(sessionStopped) SessionId: " + e.sessionId;
      console.log(str);
      processedSpeech(str);
    };

    // Signals that the speech service has started to detect speech.
    recognizer.speechStartDetected = function (s, e) {
      const str = "(speechStartDetected) SessionId: " + e.sessionId;
      console.log(str);
      processedSpeech(str);
    };

    // Signals that the speech service has detected that speech has stopped.
    recognizer.speechEndDetected = function (s, e) {
      const str = "(speechEndDetected) SessionId: " + e.sessionId;
      console.log(str);
      processedSpeech(str);
    };

    // start the recognizer and wait for a result.
    recognizer.recognizeOnceAsync(
      function (result) {
        endOfSpeechRecognition(result);
        closeRecognizer();
        
      },
      function (err) {
        closeRecognizer();
        processedSpeech("ERROR !!");
      });

    function closeRecognizer() {
      if (recognizer) {
        pushStream.close();
        recognizer.close();
        recognizer = undefined;
      }
    }

    return { closeRecognizer };
  }
  module.exports = speechService
}());
