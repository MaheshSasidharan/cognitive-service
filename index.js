const express = require("express");
const app = express();
const config = require("./config");
const server = app.listen(config.appPort, function () {
  console.log(`server running on port ${config.appPort}`);
});

const io = require("socket.io")(server);
//const sdk = require("microsoft-cognitiveservices-speech-sdk");

// let pushStream;
// let recognizer; // Speech recognizer.

/*************** Web socket *****************/

const cognitiveServices = require("./server/cognitive/cognitiveService");

io.on("connection", function (wsClient) {
  console.log("Client Connected to server");
  cognitiveServices(wsClient);

  wsClient.on("join", function (data) {
    console.log("join", data);
    wsClient.emit("messages", "Socket Connected to Server");
  });

  wsClient.on("messages", function (data) {
    console.log("messages", data);
    wsClient.emit("broad", data);
  });

  /*
  client.on("startMicrosoftCognitiveService", function (data) {
    console.log("startMicrosoftCognitiveService", data);

    pushStream = sdk.AudioInputStream.createPushStream();
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const speechConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.serviceRegion);
    speechConfig.speechRecognitionLanguage = config.speechRecognitionLanguage;

    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    // start the recognizer and wait for a result.
    recognizer.recognizeOnceAsync(
      function (result) {
        console.log(result);

        client.emit("processedSpeech", result.privText);
        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        console.trace("err - " + err);

        recognizer.close();
        recognizer = undefined;
      });
  });

  client.on("endMicrosoftCognitiveService", function (data) {
    console.log("endMicrosoftCognitiveService", data);
    pushStream.close();
  });

  client.on("onBinaryData", function (arrayBuffer) {
    console.log("onBinaryData");
    pushStream.write(arrayBuffer.slice());
  });
  */
});
