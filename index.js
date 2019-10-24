const express = require("express");
const app = express();

const server = app.listen(3000, function () {
  console.log('server running on port 3000');
});


const io = require('socket.io')(server);

/*
io.on('connection', function(socket) {
  console.log(socket.id)
  socket.on('SEND_MESSAGE', function(data) {
      io.emit('MESSAGE', data)
  });
});
*/


var sdk = require("microsoft-cognitiveservices-speech-sdk");
var pushStream;

var subscriptionKey = "91add66ed08944f9869cb610d0335082"; //"90d3e1606cf54d7782515aab7bc4635c";//"7dcb6e82ff7d4af2b6829932441af0d0"; //key 2bd95b8b437e24e02979e352b8345b110 
var serviceRegion = "westus2";

// create the speech recognizer.
var recognizer;

/********************************/

io.on('connection', function (client) {
  console.log('Client Connected to server');

  client.on('join', function (data) {
    console.log("join", data);
    client.emit('messages', 'Socket Connected to Server');
  });

  client.on('messages', function (data) {
    console.log("messages", data);
    client.emit('broad', data);
  });

  client.on('startGoogleCloudStream', function (data) {
    console.log("startGoogleCloudStream", data);

    pushStream = sdk.AudioInputStream.createPushStream();
    var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = "en-US";
    
    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    // start the recognizer and wait for a result.
    recognizer.recognizeOnceAsync(
      function (result) {
        console.log(result);

        client.emit('processedSpeech', result.privText);
        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        console.trace("err - " + err);

        recognizer.close();
        recognizer = undefined;
      });
  });

  client.on('endGoogleCloudStream', function (data) {
    console.log("endGoogleCloudStream", data);
    pushStream.close();
  });

  client.on('onBinaryData', function (arrayBuffer) {
    console.log("onBinaryData");
    pushStream.write(arrayBuffer.slice());
  });

});
