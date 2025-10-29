let hls;
let focusedIndex = 0; // for TV navigation

const channels = [
  {
    title: "Houston Rockets vs. Toronto Raptors",
    date: "2025-10-30",
    time: "06:30am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866981.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214173.ts"
  },
  {
    title: "Cleveland Cavaliers vs. Boston Celtics",
    date: "2025-10-30",
    time: "07:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866204.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214171.ts"
  },
  {
    title: "Orlando Magic vs. Detroit Pistons",
    date: "2025-10-30",
    time: "07:00am",
    server1: "https://e2.thetvapp.to/hls/NBA08/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214174.ts"
  },
  {
    title: "Atlanta Hawks vs. Brooklyn Nets",
    date: "2025-10-30",
    time: "07:30am",
    server1: "https://e1.thetvapp.to/hls/NBA22/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214175.ts"
  },
  {
    title: "Sacramento Kings vs. Chicago Bulls",
    date: "2025-10-30",
    time: "8:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866311.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214176.ts"
  },
  {
    title: "Indiana Pacers vs. Dallas Mavericks",
    date: "2025-10-30",
    time: "08:30am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866981.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214177.ts"
  },
  {
    title: "New Orleans Pelicans vs. Denver Nuggets",
    date: "2025-10-30",
    time: "09:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866204.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214178.ts"
  },
  {
    title: "Portland Trail Blazers vs. Utah Jazz",
    date: "2025-10-30",
    time: "09:00am",
    server1: "https://e2.thetvapp.to/hls/NBA08/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214179.ts"
  },
  {
    title: "Los Angeles Lakers vs. Minnesota Timberwolves",
    date: "2025-10-30",
    time: "09:30am",
    server1: "https://e1.thetvapp.to/hls/NBA22/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214172.ts"
  },
  {
    title: "Memphis Grizzlies vs. Phoenix Suns",
    date: "2025-10-30",
    time: "10:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866311.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214180.ts"
  }
];

const logos =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDu-D6tpUgnxurH9_AkBQ6a9TzVVpBfNE0VJArNbaWwsFTAEddxVTgHs&s=10";

// ============ Render Channels ============
function renderChannels(list) {
  const container = document.getElementById("channelList");
  container.innerHTML = list
    .map(
      (ch, i) => `
      <div class="channel-box" tabindex="0" data-index="${i}">
        <img src="${logos}" alt="${ch.title}">
        <h3>${ch.title}</h3>
        <small class="game-date">📅 ${ch.date} — ${ch.time} PH</small>
        <div id="timer-${i}" class="countdown">Calculating...</div>
        <div class="server-buttons">
          <button onclick="playChannel('${ch.server1}')">▶ Server 1</button>
          <button onclick="playChannel('${ch.server2}')">▶ Server 2</button>
        </div>
      </div>`
    )
    .join("");
  highlightChannel(0);
}

// ============ Countdown Logic ============
function updateCountdowns() {
  const now = new Date();
  const phTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

  const timeDisplay = document.getElementById("phTime");
  if (timeDisplay)
    timeDisplay.textContent =
      "🇵🇭 Philippine Time: " +
      phTime.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

  channels.forEach((ch, i) => {
    const el = document.getElementById(`timer-${i}`);
    if (!el) return;
    const matchTime = parseTime(ch.time, ch.date);
    const diff = matchTime - phTime;

    if (diff <= 0) {
      el.textContent = "LIVE NOW 🟢";
      el.style.color = "limegreen";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (diff <= 5 * 60 * 1000) {
      el.textContent = "Starting Soon 🔴";
      el.style.color = "#ff4444";
    } else {
      const d = days > 0 ? `${days}d ` : "";
      el.innerHTML = `⏳ ${d}${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
      el.style.color = "#ffd966";
    }
  });
}

function parseTime(timeStr, dateStr) {
  const [hourStr, minuteStr] = timeStr.match(/\d+/g);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const isPM = timeStr.toLowerCase().includes("pm");
  const [y, m, d] = dateStr.split("-").map(Number);
  const hr24 = (hour % 12) + (isPM ? 12 : 0);
  return new Date(`${y}-${m}-${d}T${pad(hr24)}:${pad(minute)}:00+08:00`);
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

// ============ Player ============
function playChannel(url) {
  const container = document.getElementById("videoContainer");
  const video = document.getElementById("videoPlayer");
  container.style.display = "flex";

  if (hls) hls.destroy();
  video.pause();
  video.removeAttribute("src");
  video.load();

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.addEventListener("loadedmetadata", () => video.play());
  } else {
    alert("This stream format is not supported.");
  }
}

function closeVideo() {
  const video = document.getElementById("videoPlayer");
  document.getElementById("videoContainer").style.display = "none";
  video.pause();
  video.removeAttribute("src");
}

// ============ TV Remote Navigation ============
function highlightChannel(index) {
  const boxes = document.querySelectorAll(".channel-box");
  boxes.forEach((b) => b.classList.remove("focused"));
  const el = boxes[index];
  if (el) {
    el.classList.add("focused");
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

document.addEventListener("keydown", (e) => {
  const boxes = document.querySelectorAll(".channel-box");
  const total = boxes.length;
  if (document.getElementById("videoContainer").style.display === "flex") {
    if (e.key === "Backspace" || e.key === "Escape") closeVideo();
    return;
  }

  switch (e.key) {
    case "ArrowDown":
      focusedIndex = (focusedIndex + 1) % total;
      highlightChannel(focusedIndex);
      break;
    case "ArrowUp":
      focusedIndex = (focusedIndex - 1 + total) % total;
      highlightChannel(focusedIndex);
      break;
    case "Enter":
    case "OK":
      playChannel(channels[focusedIndex].server1);
      break;
    case "ArrowRight":
      playChannel(channels[focusedIndex].server2);
      break;
  }
});

// ============ Search ============
document.getElementById("searchBar").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  renderChannels(channels.filter((c) => c.title.toLowerCase().includes(q)));
  focusedIndex = 0;
  highlightChannel(0);
});

// ============ Init ============
window.onload = () => {
  renderChannels(channels);
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
};
