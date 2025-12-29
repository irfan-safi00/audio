/**
 * AUDIOBOOK PLAYER ENGINE - Syllabus with Rohit
 * This script handles all audio logic, UI updates, and local storage.
 */

// 1. SELECTING UI ELEMENTS
const audio = document.getElementById('audio-engine');
const playBtn = document.getElementById('play-btn');
const playIcon = playBtn.querySelector('i');
const barFill = document.getElementById('bar-fill');
const progressArea = document.getElementById('progress-area');
const trackListUI = document.getElementById('track-list');
const speedSelect = document.getElementById('speed');
const container = document.getElementById('player-container');

// 2. DATA CONFIGURATION
// Replace 'file' with the path to your MP3s and 'img' with your thumbnails.
const tracks = [
    { 
        title: "01. Syllabus Introduction", 
        file: "audio/intro.mp3", 
        img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500" 
    },
    { 
        title: "02. Core Chapter One", 
        file: "audio/chapter1.mp3", 
        img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500" 
    },
    { 
        title: "03. Advanced Concepts", 
        file: "audio/chapter2.mp3", 
        img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500" 
    },
    { 
        title: "04. Exam Preparation Tips", 
        file: "audio/exam-tips.mp3", 
        img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" 
    }
];

let trackIndex = 0;
let isPlaying = false;

// 3. INITIALIZING THE SITE
function initPlayer() {
    renderPlaylist();
    loadTrack(trackIndex);
}

// Render the playlist sidebar
function renderPlaylist() {
    trackListUI.innerHTML = "";
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = `track-item ${index === trackIndex ? 'active' : ''}`;
        li.innerHTML = `
            <i class="fas ${index === trackIndex && isPlaying ? 'fa-volume-up' : 'fa-play-circle'}"></i>
            <span>${track.title}</span>
        `;
        li.onclick = () => {
            trackIndex = index;
            loadTrack(trackIndex);
            playAudio();
        };
        trackListUI.appendChild(li);
    });
}

// 4. CORE AUDIO FUNCTIONS
function loadTrack(index) {
    const track = tracks[index];
    
    // Update Text and Images
    document.getElementById('main-title').innerText = track.title;
    document.getElementById('main-img').src = track.img;
    
    // Load Audio Source
    audio.src = track.file;
    audio.load();
    
    // Reset Progress UI
    barFill.style.width = '0%';
    document.getElementById('current').innerText = "0:00";
    
    renderPlaylist(); // Refresh active state in list
}

function playAudio() {
    isPlaying = true;
    audio.play();
    playIcon.className = "fas fa-pause";
    container.classList.add('playing');
}

function pauseAudio() {
    isPlaying = false;
    audio.pause();
    playIcon.className = "fas fa-play";
    container.classList.remove('playing');
}

// 5. EVENT LISTENERS
playBtn.addEventListener('click', () => {
    (isPlaying) ? pauseAudio() : playAudio();
});

// Update Progress Bar as Audio Plays
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.target;
    if (duration) {
        const percent = (currentTime / duration) * 100;
        barFill.style.width = `${percent}%`;

        // Update Time Stamps
        document.getElementById('current').innerText = formatTime(currentTime);
        document.getElementById('total').innerText = formatTime(duration);
    }
});

// Click on Progress Bar to Seek
progressArea.addEventListener('click', (e) => {
    const width = progressArea.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// Navigation Controls
document.getElementById('next').onclick = () => {
    trackIndex = (trackIndex + 1) % tracks.length;
    loadTrack(trackIndex);
    if(isPlaying) playAudio();
};

document.getElementById('prev').onclick = () => {
    trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(trackIndex);
    if(isPlaying) playAudio();
};

// Speed Control
speedSelect.addEventListener('change', () => {
    audio.playbackRate = parseFloat(speedSelect.value);
});

// Auto-play Next Chapter
audio.onended = () => {
    document.getElementById('next').click();
};

// Helper function to format seconds into 0:00
function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// RUN PLAYER ON LOAD
window.onload = initPlayer;
      
