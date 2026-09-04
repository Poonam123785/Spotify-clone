// script.js — simple audio player for the demo
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currTime = document.getElementById('currTime');
const totTime = document.getElementById('totTime');
const albumThumb = document.querySelector('.album-thumb');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');

const playlist = [
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    cover: 'card1img.jpeg'
  },
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    cover: 'card2img.jpeg'
  },
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    cover: 'card3img.jpeg'
  }
];

let idx = 0;
let isPlaying = false;

function loadTrack(i) {
  const t = playlist[i];
  audio.src = t.src;
  trackTitle.textContent = t.title;
  trackArtist.textContent = t.artist;
  if (albumThumb) albumThumb.src = t.cover;
  audio.load();
}

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

audio.addEventListener('loadedmetadata', () => {
  totTime.textContent = formatTime(audio.duration);
  progress.max = Math.floor(audio.duration) || 0;
});

audio.addEventListener('timeupdate', () => {
  if (!progress.matches(':active')) {
    progress.value = Math.floor(audio.currentTime);
  }
  currTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener('input', () => {
  currTime.textContent = formatTime(progress.value);
});

progress.addEventListener('change', () => {
  audio.currentTime = progress.value;
});

function play() {
  audio.play().then(() => {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playBtn.classList.remove('play');
  }).catch(() => {
    // autoplay blocked; update UI
    isPlaying = false;
  });
}
function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  playBtn.classList.add('play');
}

playBtn.addEventListener('click', () => {
  if (!isPlaying) play();
  else pause();
});

prevBtn.addEventListener('click', () => {
  idx = (idx - 1 + playlist.length) % playlist.length;
  loadTrack(idx);
  if (isPlaying) play();
});

nextBtn.addEventListener('click', () => {
  idx = (idx + 1) % playlist.length;
  loadTrack(idx);
  if (isPlaying) play();
});

audio.addEventListener('ended', () => {
  nextBtn.click();
});

// keyboard accessibility: space toggles play/pause
document.addEventListener('keydown', (e) => {
  const el = document.activeElement;
  if (e.code === 'Space' && el && ['INPUT','TEXTAREA'].indexOf(el.tagName) === -1) {
    e.preventDefault();
    if (isPlaying) pause();
    else play();
  }
});

// Initialize
loadTrack(idx);
