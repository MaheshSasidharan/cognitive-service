

// pull in the required packages.
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const settings = require("./settings");
const speech = require("./speech");
const intent = require("./intent");
const translate = require("./translation");

function openPushStream(filename) {
    // create the push stream we need for the speech sdk.
    const pushStream = sdk.AudioInputStream.createPushStream();

    // open the file and push it to the push stream.
    fs.createReadStream(filename).on('data', function (arrayBuffer) {
        pushStream.write(arrayBuffer.slice());
    }).on('end', function () {
        pushStream.close();
    });

    return pushStream;
}

if (process.argv.length > 3) {
    settings.filename = process.argv[3];
}

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case "intent":
            console.log("Now recognizing intent from: " + settings.filename);
            intent.main(settings, openPushStream(settings.filename));
            break;

        case "translate":
            console.log("Now translating from: " + settings.filename);
            translate.main(settings, openPushStream(settings.filename));
            break;

        case "speech":
        default:
            console.log("Now recognizing speech from: " + settings.filename);
            speech.main(settings, openPushStream(settings.filename));
            break;
    }
}
else {
    console.log("usage: index.js [speech|intent|translate] {filename}");
}
