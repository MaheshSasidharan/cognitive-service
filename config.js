const { DotenvAzure } = require("dotenv-azure");

const getConfigPromise = async () => {
    const dotenvAzure = new DotenvAzure();
    const { parsed } = await dotenvAzure.config();

    const config = {
        port: parsed.PORT || 3001,
        subscriptionKey: parsed.SUBSCRIPTION_KEY,
        serviceRegion: parsed.SERVICE_REGION,
        speechRecognitionLanguage: parsed.SPEECH_RECOGNITION_LANGUAGE,
        luSubscriptionKey: parsed.LUIS_SUBSCRIPTION_KEY,
        luServiceRegion: parsed.LUIS_SERVICE_REGION,
        luAppId: parsed.LUIS_APP_ID
    };

    return config;
};

module.exports = getConfigPromise;

/*
dotenz azure is only required if deploying on azure platform. You can also use dotazure, or none at all
To get private config values, add a .env file with sample values (First two are required for dotenv-azure to work)
AZURE_APP_CONFIG_URL="https://your-app-config.azconfig.io"
AZURE_APP_CONFIG_CONNECTION_STRING="generated-app-config-conneciton-string"
PORT=3000
SUBSCRIPTION_KEY="dummy"
SERVICE_REGION=westus2
SPEECH_RECOGNITION_LANGUAGE=en-US
LUIS_SUBSCRIPTION_KEY="Key"
LUIS_SERVICE_REGION="westus"
LUIS_APP_ID="AppID"
*/
