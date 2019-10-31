<template>
  <div class="card mt-3">
    <div class="card-footer">
      <form>
        <div class="wrapper">
          <button
            id="startRecButton"
            type="button"
            :disabled="startButtonDisabled"
            @click="startRecording()"
          >Start</button>
          <button
            id="stopRecButton"
            type="button"
            :disabled="endButtonDisabled"
            @click="stopRecording()"
          >Stop recording</button>
          <button @click.prevent="clear()">Clear</button>
        </div>
      </form>

      <div class="splitInnerTwo">
        <div class="messages">
          <div v-for="(msg, index) in messages" :key="index">
            <p>{{ msg }}</p>
          </div>
        </div>
        <div class="messages">
          <div v-for="(msg, index) in intentMessages" :key="index">
            <p>{{ msg }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { downsampleBuffer, mediaConstraints, bufferSize } from "./common";
export default {
  data() {
    return {
      user: "",
      message: "",
      messages: [],
      intentMessages: [],
      AudioContext: null,
      context: null,
      processor: null,
      input: null,
      globalStream: null,
      socket: io("localhost:3000"),
      streamStreaming: false,
      startButtonDisabled: false,
      endButtonDisabled: true
    };
  },
  methods: {
    startRecording() {
      this.startButtonDisabled = true;
      this.endButtonDisabled = false;
      this.initRecording();
    },
    initRecording() {
      this.socket.emit("startMicrosoftCognitiveService", "");
      this.streamStreaming = true;
      this.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext({
        // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
        latencyHint: "interactive"
      });
      this.processor = this.context.createScriptProcessor(bufferSize, 1, 1);
      this.processor.connect(this.context.destination);
      this.context.resume();

      const handleSuccess = stream => {
        this.globalStream = stream;
        this.input = this.context.createMediaStreamSource(stream);
        this.input.connect(this.processor);

        this.processor.onaudioprocess = event => {
          this.microphoneProcess(event);
        };
      };

      navigator.mediaDevices.getUserMedia(mediaConstraints).then(handleSuccess);
    },
    microphoneProcess(event) {
      var left = event.inputBuffer.getChannelData(0);
      var left16 = downsampleBuffer(left, 44100, 16000);
      this.socket.emit("onSpeechReceving", left16);
    },
    stopRecording() {
      this.startButtonDisabled = false;
      this.endButtonDisabled = true;
      this.streamStreaming = false;
      this.socket.emit("endMicrosoftCognitiveService", "");

      let track = this.globalStream.getTracks()[0];
      track.stop();

      this.input.disconnect(this.processor);
      this.processor.disconnect(this.context.destination);
      this.context.close().then(() => {
        this.input = null;
        this.processor = null;
        this.context = null;
        this.AudioContext = null;
        this.startButtonDisabled = false;
      });
    },
    clear() {
      this.messages = [];
      this.intentMessages = [];
    }
  },
  mounted() {
    this.socket.on("connect", data => {
      this.socket.emit("join", "Server Connected to Client");
    });

    this.socket.on("messages", data => {
      console.log("message", data);
    });

    this.socket.on("processedSpeech", data => {
      this.messages = [...this.messages, data];
    });

    this.socket.on("endOfSpeechRecognition", data => {
      console.log(data);
      this.messages = [...this.messages, data.privJson];
      this.stopRecording();
    });

    this.socket.on("processedIntent", data => {
      this.intentMessages = [...this.intentMessages, data];
    });

    this.socket.on("endOfIntentRecognition", data => {
      console.log(data);
      this.intentMessages = [...this.intentMessages, data.privJson];
      this.stopRecording();
    });
  },
  beforeDestroy() {
    if (this.streamStreaming) {
      this.socket.emit("endMicrosoftCognitiveService", "");
    }
  }
};
</script>
<style>
@import "./app.css";
</style>