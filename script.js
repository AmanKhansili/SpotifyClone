console.log("I am working bro");
let currentSong = new Audio(); // Create a new Audio object to handle song playback
let songs;

// Function to convert seconds to a formatted string of minutes and seconds
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0"); // Format minutes to always have two digits
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
// Asynchronous function to fetch the list of songs
async function getSongs() {
  let response = await fetch(
    "http://127.0.0.1:3000/Projects/Spotify%20clone/songs/"
  );
  let htmlContent = await response.text();

  let div = document.createElement("div");
  div.innerHTML = htmlContent;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // Check if the href ends with ".mp3"
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
// Function to play or pause a song
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/Projects/Spotify%20clone/songs/" + track);
  console.log(track);
  currentSong.src = "/Projects/Spotify clone/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "svg/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

// Main function to initialize the application
async function main() {
  //Get the list of all the songs
  songs = await getSongs();
  playMusic(songs[0], true);

  //Show all the songs in the playlist
  let songListElement = document.querySelector(".songList");
  let songUl = songListElement.getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML += `<li>
                <img src="svg/music.svg" alt="" />
                <div class="info flex1">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Aman</div>
                </div>
                <div class="flex">
                  Play Now
                  <img src="svg/play.svg" alt="" />
                </div>
              </li>`;
  }

  //Attach an eventListener to each song in the list
  Array.from(songListElement.getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  //Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svg/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to the seek bar for seeking within the song
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event listener for Hamburger functionality
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //Add event listener for close hamburger
  document.querySelector(".cancle").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });
  //Add event listener for previous and next
  let previous = document.getElementById("previous");
  let next = document.getElementById("next");

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
    console.log(index);
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    console.log(index);
  });
}

main();
