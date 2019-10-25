const configPromise = require("./config");

(async function () {
  const config = await configPromise();
  
  const express = require("express");
  const app = express();
  const server = app.listen(config.port, function () {
    console.log(`server running on port ${config.port}`);
  });

  /*************** Web socket *****************/

  const io = require("socket.io")(server);
  const cognitiveServices = require("./server/cognitive/cognitiveService");

  io.on("connection", function (wsClient) {
    console.log("Client Connected to server");
    cognitiveServices(wsClient, config);

    wsClient.on("join", function (data) {
      console.log("join", data);
      wsClient.emit("messages", "Socket Connected to Server");
    });

    wsClient.on("messages", function (data) {
      console.log("messages", data);
      wsClient.emit("broad", data);
    });
  });
})();