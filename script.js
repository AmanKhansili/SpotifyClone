console.log("I am working bro");
let currentSong = new Audio();
async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Projects/Spotify%20clone/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  // let audio = new Audio("/Projects/Spotify%20clone/songs/" + track);
  console.log(track);
  currentSong.src = "/Projects/Spotify%20clone/songs/" + track;
  currentSong.play();
  play.src = "svg/pause.svg";
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //Get the list of all the songs
  let songs = await getSongs();

  //Show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
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

  //Attach an eventListener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
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
}

main();
