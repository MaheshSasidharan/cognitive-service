const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speech = require("./speech");
const intent = require("./intent");

let calledTimes = 0;
function openPushStream(wsClient) {
    const pushStream = sdk.AudioInputStream.createPushStream();
    wsClient.on("onSpeechReceving", function (arrayBuffer) {
        //console.log(++calledTimes)
        if (!pushStream.privStream.isClosed) {
            pushStream.write(arrayBuffer.slice());
        }
    });
    return pushStream;
}

const initCongnitiveService = function (wsClient, settings) {
    wsClient.on("startMicrosoftCognitiveService", function (data) {
        calledTimes = 0;
        const audioStream = openPushStream(wsClient);
        const speechProcessor = speech(settings, audioStream, wsClient);
        const intentProcessor = intent(settings, audioStream, wsClient);

        wsClient.on("endMicrosoftCognitiveService", function (data) {
            speechProcessor.closeRecognizer();
            intentProcessor.closeRecognizer();
        });
    });
}

module.exports = initCongnitiveService;