const VTC_SERVICE = "LIVE_ASR";
const VTC_LANGUAGE = "ro_RO";
const VTC_LOG = true;
const VTC_MICROPHONE_TIMESLICE = 250;
const VTC_FRAME_LENGTH = 0.3;
const VTC_FRAME_OVERLAP = 0.3;
const VTC_BUFFER_OFFSET = 0.3;
const FEATURE_LIVE_TRANSCRIPT = "FEATURE_LIVE_TRANSCRIPT";
const NO_INSTANCES_AVAILABLE_ERROR_CODE = 429;
const NO_INSTANCES_AVAILABLE_ERROR_MESSAGE = "No instance available";

const API_KEY = "YOUR_API_KEY_HERE";

const playButton = document.getElementById("play-button");
const playButtonIcon = document.getElementById("play-button-icon");
const transcriptContainer = document.getElementById("transcript-container");
const vtcRef = {};

const state = {
  play: false,
  vtcInitialized: false,
  timeStamps: [],
  transcriptFrames: [],
  error: false,
};

function onPlayButtonClick() {
  if (state.isDestroying) {
    generateToast({
      message: "Please wait a few seconds for the transcript to finalize.",
      type: "warning",
    });
    return;
  }
  if (!vtcRef.current) {
    generateToast({
      message:
        "We're starting the live transcription. Please wait a few seconds. If the waiting time is too long, please contact us at support@vatis.tech.",
      type: "info",
    });
    state.play = true;
    state.needNewTimeStamp = true;
    disablePlayeButton();
    vtcRef.current = new VatisTechClient.default({
      service: VTC_SERVICE,
      language: VTC_LANGUAGE,
      apiKey: API_KEY,
      onData: onData,
      log: VTC_LOG,
      onDestroyCallback: onDestroyCallback,
      host: "https://vatis.tech/api/v1",
      microphoneTimeslice: VTC_MICROPHONE_TIMESLICE,
      frameLength: VTC_FRAME_LENGTH,
      frameOverlap: VTC_FRAME_OVERLAP,
      bufferOffset: VTC_BUFFER_OFFSET,
      errorHandler: errorHandler,
      logger: (info) => {
        if (
          info.currentState ===
          '@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.'
        ) {
          state.vtcInitialized = true;
          enablePlayButton();
          waitingForStopPlayButton();
          generateToast({
            message:
              "Live transcription has started. We're waiting to retrieve the data. If you see this message for a long period of time, please contact us at support@vatis.tech.",
            type: "success",
          });
        } else if (
          info.currentState ===
            '@vatis-tech/asr-client-js: Destroy the "SocketIOClientGenerator" plugin.' &&
          state.vtcInitialized &&
          state.play
        ) {
          state.play = false;
          state.vtcInitialized = false;
          state.error = true;
          vtcRef.current = null;
          enablePlayButton();
          waitingForStartPlayButton();
          generateToast({
            message:
              "The Vatis Tech ASR SERVICE has interrupted the connection. Please try again in a few minutes, and if this issue persists, please contact us at support@vatis.tech.",
            type: "error",
          });
        }
      },
    });
  } else if (vtcRef.current !== undefined && state.play) {
    state.play = false;
    state.isDestroying = false;
    vtcRef.current.destroy();
    disablePlayeButton();
  }
}

// in this function, we append to the HTML transcriptContainer
// the data that comes from the ASR Service
function onData(data) {
  if (state.needNewTimeStamp && data.transcript !== "") {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, "0");
    const mm = String(today.getMinutes()).padStart(2, "0");
    const ss = String(today.getSeconds()).padStart(2, "0");

    state.needNewTimeStamp = false;
    state.timeStamps = [`${hh}:${mm}:${ss}`, ...state.timeStamps];
  }
  if (data.transcript === "") {
  } else if (
    state.transcriptFrames.length &&
    state.transcriptFrames[0].headers.FrameStartTime ===
      data.headers.FrameStartTime &&
    state.transcriptFrames[0].headers.Sid === data.headers.Sid
  ) {
    const newTranscriptFrames = [...state.transcriptFrames];
    newTranscriptFrames[0] = data;
    state.transcriptFrames = newTranscriptFrames;
    displayTranscript({ data, replace: true });
  } else {
    state.transcriptFrames = [data, ...state.transcriptFrames];
    displayTranscript({ data, replace: false });
  }
}

// if there is an error, here we will catch it
function errorHandler(e) {
  state.play = false;
  state.vtcInitialized = false;
  state.error = true;
  vtcRef.current = null;
  if (
    e &&
    (e.status === NO_INSTANCES_AVAILABLE_ERROR_CODE ||
      e.message === NO_INSTANCES_AVAILABLE_ERROR_MESSAGE)
  ) {
    generateToast({
      message:
        "We're sorry, but there are no instances of the Vatis Tech ASR SERVICE free. Please try again later. If you should have one, please contact us at support@vatis.tech.",
      type: "error",
    });
  } else {
    generateToast({
      message:
        "There was a server error. Please try again later, and if this issue persists, please contact us at support@vatis.tech.",
      type: "error",
    });
  }
}

// sometimes, due to Networking issues, the internet connection is weak etc.,
// the @vatis-tech/asr-client-js plugin will not be destroyed immediately
// this function is to catch the successful destruction of
// the @vatis-tech/asr-client-js plugin
function onDestroyCallback() {
  if (!state.error) {
    state.vtcInitialized = false;
    state.isDestroying = false;
    vtcRef.current = null;
    enablePlayButton();
    waitingForStartPlayButton();
    generateToast({
      message:
        "The transcript has been finalized. You can resume live transcription.",
      type: "success",
    });
  }
}

// this will generate the transcript in the HTML page
// data - is the object recieved from the ASR Service
// replace - specifies if the new data should replace some old one, or not
function displayTranscript({ data, replace }) {
  const timeStampWrapper = document.querySelector(
    `[data-timestamp="${state.timeStamps[0]}"]`
  );

  if (timeStampWrapper === null) {
    transcriptContainer.insertAdjacentHTML(
      "afterbegin",
      `<div class="relative" data-timestamp="${state.timeStamps[0]}">
    <div
      class="absolute inset-0 flex items-center"
      aria-hidden="true"
    >
      <div class="w-full border-t border-blueGray-300"></div>
    </div>
    <div class="relative flex justify-center">
      <span class="px-2 bg-white text-sm text-blueGray-500">
        ${state.timeStamps[0]}
      </span>
    </div>
  </div>`
    );
  }

  if (replace) {
    let replacedElement = document.querySelector(
      `[data-start="${data.headers.FrameStartTime}"]`
    );
    replacedElement.innerHTML = data.transcript;
  } else {
    transcriptContainer.insertAdjacentHTML(
      "afterbegin",
      `<div class="flex items-start mb-3">
    <div class="mr-2 mt-1">
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blueGray-100 text-blueGray-800">
        ${humanizeDuration(data.headers.FrameStartTime)}
      </span>
    </div>
    <div class="flex-1">
      <p class="text-blueGray-500 text-lead leading-6 text-left" data-start="${
        data.headers.FrameStartTime
      }">
        ${data.transcript}
      </p>
    </div>
  </div>`
    );
  }
}

// functions for toggling classes for better UI/UX
function disablePlayeButton() {
  playButton.classList.add("opacity-50");
  playButton.classList.add("pointer-events-none");
}
function enablePlayButton() {
  playButton.classList.remove("opacity-50");
  playButton.classList.remove("pointer-events-none");
}
function waitingForStartPlayButton() {
  playButton.classList.remove("text-white");
  playButton.classList.remove("bg-green-500");
  playButton.classList.remove("hover:text-green-500");
  playButton.classList.remove("hover:bg-white");

  playButton.classList.add("text-green-500");
  playButton.classList.add("bg-white");
  playButton.classList.add("hover:text-white");
  playButton.classList.add("hover:bg-green-500");

  playButtonIcon.classList.add("fa-microphone");
  playButtonIcon.classList.remove("fa-stop");
  playButtonIcon.classList.remove("animate-pulse");
}
function waitingForStopPlayButton() {
  playButton.classList.add("text-white");
  playButton.classList.add("bg-green-500");
  playButton.classList.add("hover:text-green-500");
  playButton.classList.add("hover:bg-white");

  playButton.classList.remove("text-green-500");
  playButton.classList.remove("bg-white");
  playButton.classList.remove("hover:text-white");
  playButton.classList.remove("hover:bg-green-500");

  playButtonIcon.classList.remove("fa-microphone");
  playButtonIcon.classList.add("fa-stop");
  playButtonIcon.classList.add("animate-pulse");
}

// this is to download the transcript
function onDownloadClick() {
  if (state.transcriptFrames.length === 0) {
    return;
  }
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  const filename = `vatis-tech-live-transcript-[${dd}.${mm}.${yyyy}].text`;
  const newTranscriptFrames = [...state.transcriptFrames];
  const newTimeStamps = [...state.timeStamps];
  let timeIndex = 0;
  const text = newTranscriptFrames
    .map(
      (prop, key) =>
        `${
          (key !== newTranscriptFrames.length - 1 &&
            prop.headers.Sid !== newTranscriptFrames[key + 1].headers.Sid) ||
          key === newTranscriptFrames.length - 1
            ? `\n-------------------[${
                newTimeStamps[timeIndex++]
              }]-------------------\n\n`
            : ""
        }[${humanizeDuration(prop.headers.FrameStartTime)}]: ${prop.transcript}`
    )
    .reverse()
    .join("\n\n");

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// simple function to generate timestamp, based on seconds
function humanizeDuration(seconds) {
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600);
  var mins = ~~((seconds % 3600) / 60);
  var secs = ~~seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  ret += "" + (hrs < 10 ? "0" : "") + hrs + ":";
  ret += "" + (mins < 10 ? "0" : "") + mins + ":";
  ret += "" + (secs < 10 ? "0" : "") + secs + "";
  return ret;
}

// this is to generate some nice in-line alerts, rather than using window.alert
function generateToast({ message, type }) {
  switch (type) {
    case "warning":
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "warning",
      }).showToast();
      break;
    case "error":
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "error",
      }).showToast();
      break;
    case "info":
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "info",
      }).showToast();
      break;
    case "success":
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "success",
      }).showToast();
      break;
    default:
  }
}
