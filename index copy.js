"use strict";

// pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "91add66ed08944f9869cb610d0335082"; //"90d3e1606cf54d7782515aab7bc4635c";//"7dcb6e82ff7d4af2b6829932441af0d0"; //key 2bd95b8b437e24e02979e352b8345b110 
var serviceRegion = "westus2"; // e.g., "westus"
//var filename = "./sampleAudio/maybe-next-time.wav"; // 16000 Hz, Mono
var filename = "33seconds";
var fileType = ".wav";
var filepath = `./sampleAudio/${filename}${fileType}`; // 16000 Hz, Mono

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();

// open the file and push it to the push stream.
fs.createReadStream(filepath).on('data', function(arrayBuffer) {
  pushStream.write(arrayBuffer.slice());
}).on('end', function() {
  pushStream.close();
});

// we are done with the setup
console.log("Now recognizing from: " + filepath);

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// setting the recognition language to English.
speechConfig.speechRecognitionLanguage = "en-US";

// create the speech recognizer.
var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// start the recognizer and wait for a result.
recognizer.recognizeOnceAsync(
  function (result) {
    console.log(result);

    recognizer.close();
    recognizer = undefined;
  },
  function (err) {
    console.trace("err - " + err);

    recognizer.close();
    recognizer = undefined;
  });