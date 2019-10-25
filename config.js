const { DotenvAzure } = require("dotenv-azure");

const getConfigPromise = async () => {
    const dotenvAzure = new DotenvAzure();
    const { parsed } = await dotenvAzure.config();

    const config = {
        port: parsed.PORT || 3001,
        subscriptionKey: parsed.SUBSCRIPTION_KEY || null,
        serviceRegion: parsed.SERVICE_REGION || null,
        speechRecognitionLanguage: parsed.SPEECH_RECOGNITION_LANGUAGE || null
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
*/

/*
For LUIS use following:
// luSubscriptionKey: "YourLanguageUnderstandingSubscriptionKey",
// luServiceRegion: "YourLanguageUnderstandingServiceRegion",
// luAppId: "YourLanguageUnderstandingAppId"
*/