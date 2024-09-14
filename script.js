const notes = [
  {
    solfege: "do",
    letter: "c",
  },
  {
    solfege: "ré",
    letter: "d",
  },
  {
    solfege: "mi",
    letter: "e",
  },
  {
    solfege: "fa",
    letter: "f",
  },
  {
    solfege: "sol",
    letter: "g",
  },
  {
    solfege: "la",
    letter: "a",
  },
  {
    solfege: "si",
    letter: "b",
  },
];
const alterations = ["bémol", "dièse"];

const noteContainer = document.getElementById("note");

const notationInput = document.getElementById("notation");

const timerIntervalDisplay = document.getElementById("timerIntervalDisplay");
const timerIntervalInput = document.getElementById("timerInterval");
let timerInterval = timerIntervalInput.value;
timerIntervalDisplay.innerText = formatedCurrentInterval();
let setIntervalTimer;
const toggleTimerBtn = document.getElementById("toggleTimerBtn");
let timerEnabled = false;

const toggleVoiceBtn = document.getElementById("toggleVoiceBtn");
const voiceVolumeInput = document.getElementById("voiceVolumeInput");
let voiceVolume = voiceVolumeInput.value;
let voiceEnabled = false;
let voices;
let voice;

noteContainer.addEventListener("click", handleClickNote);

timerIntervalInput.addEventListener("input", handleChangeTimerInterval);
toggleTimerBtn.addEventListener("click", handleToggleTimer);

toggleVoiceBtn.addEventListener("click", handleToggleVoice);
voiceVolumeInput.addEventListener("input", handleChangeVoiceVolume);

function handleClickNote() {
  if (timerEnabled) {
    clearInterval(setIntervalTimer);
  }
  newNote();
  if (timerEnabled) {
    initTimer();
  }
}

function newNote() {
  cancelNoteReading();
  const { note, alteration } = generateNote();
  displayNote(note, alteration);
  if (voiceEnabled) {
    readNote(note, alteration);
  }
}

function displayNote(note, alteration) {
  let fullNote = note;
  if (alteration) {
    fullNote += ` <span>${alteration}</span>`;
  }
  noteContainer.innerHTML = fullNote;
}

function generateNote() {
  const index = getRandomNumber(0, 6);
  const notations = [...notationInput.selectedOptions].map((o) => o.value);
  const notation = notations[getRandomNumber(0, notations.length - 1)];
  let note = {
    note: notes[index][notation].toUpperCase(),
    alteration: undefined,
  };
  const hasAlteration = getRandomNumber(0, 1);
  if (hasAlteration) {
    note.alteration = alterations[getRandomNumber(0, 1)];
  }
  return note;
}

function initTimer() {
  setIntervalTimer = setInterval(() => {
    newNote();
  }, timerInterval * 1000);
}

function handleChangeTimerInterval() {
  if (timerEnabled) {
    clearInterval(setIntervalTimer);
  }
  timerInterval = timerIntervalInput.value;
  timerIntervalDisplay.innerText = formatedCurrentInterval();
  if (timerEnabled) {
    initTimer();
  }
}

function handleChangeVoiceVolume() {
  voiceVolume = voiceVolumeInput.value;
}

function formatedCurrentInterval() {
  return `${timerInterval} second${timerInterval < 2 ? "" : "s"}`;
}

function handleToggleTimer() {
  timerEnabled = !timerEnabled;
  if (timerEnabled) {
    toggleTimerBtn.innerText = "Disable";
    initTimer();
  } else {
    toggleTimerBtn.innerText = "Enable";
    clearInterval(setIntervalTimer);
  }
}

function handleToggleVoice() {
  voiceEnabled = !voiceEnabled;
  if (voiceEnabled) {
    toggleVoiceBtn.innerText = "Disable";
  } else {
    cancelNoteReading();
    toggleVoiceBtn.innerText = "Enable";
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  // const frenchVoices = voices.filter((v) => v.lang === "fr-FR");
  // if (frenchVoices.length === 0) {
  //   toggleVoiceBtn.insertAdjacentHTML(
  //     "beforebegin",
  //     "No french voices on your device."
  //   );
  // }
  // console.log(frenchVoices);
  // voices = frenchVoices;
  const defaultVoice = voices.find((v) => v.default);
  if (!defaultVoice) {
    toggleVoiceBtn.insertAdjacentHTML(
      "beforebegin",
      "No default voice on your device."
    );
    toggleVoiceBtn.disabled = true;
  }
  voice = defaultVoice;
};

function readNote(note, alteration) {
  const text = note + " " + (alteration ?? "");
  const speech = new SpeechSynthesisUtterance(text);
  // const voice = voices[getRandomNumber(0, voices.length - 1)];
  speech.voice = voice;
  speech.volume = voiceVolume;
  speechSynthesis.speak(speech);
}

function cancelNoteReading() {
  speechSynthesis.cancel();
}

newNote();
