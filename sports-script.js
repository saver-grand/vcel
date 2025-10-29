let hls;
let focusedIndex = 0;
let lastFocused = null;


const channels = [
  {
    title: "Houston Rockets vs. Toronto Raptors",
    date: "2025-10-30",
    time: "06:30am",
    server1: "https://e4.thetvapp.to/hls/NBA25/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214173.m3u8"
  },
  {
    title: "Cleveland Cavaliers vs. Boston Celtics",
    date: "2025-10-30",
    time: "07:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866204.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214171.m3u8"
  },
  {
    title: "Orlando Magic vs. Detroit Pistons",
    date: "2025-10-30",
    time: "07:00am",
    server1: "https://e2.thetvapp.to/hls/NBA08/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214174.m3u8"
  },
  {
    title: "Atlanta Hawks vs. Brooklyn Nets",
    date: "2025-10-30",
    time: "07:30am",
    server1: "https://e4.thetvapp.to/hls/NBA24/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214175.m3u8"
  },
  {
    title: "Sacramento Kings vs. Chicago Bulls",
    date: "2025-10-30",
    time: "8:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866311.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214176.m3u8"
  },
  {
    title: "Indiana Pacers vs. Dallas Mavericks",
    date: "2025-10-30",
    time: "08:30am",
    server1: "https://e4.thetvapp.to/hls/NBA23/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214177.m3u8"
  },
  {
    title: "New Orleans Pelicans vs. Denver Nuggets",
    date: "2025-10-30",
    time: "09:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866204.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214178.m3u8"
  },
  {
    title: "Portland Trail Blazers vs. Utah Jazz",
    date: "2025-10-30",
    time: "09:00am",
    server1: "https://e2.thetvapp.to/hls/NBA08/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214179.m3u8"
  },
  {
    title: "Los Angeles Lakers vs. Minnesota Timberwolves",
    date: "2025-10-30",
    time: "09:30am",
    server1: "https://e1.thetvapp.to/hls/NBA22/tracks-v1a1/mono.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214172.m3u8"
  },
  {
    title: "Memphis Grizzlies vs. Phoenix Suns",
    date: "2025-10-30",
    time: "10:00am",
    server1: "https://nami.videobss.com/live/hd-en-2-3866311.m3u8",
    server2: "https://s.rocketdns.info:443/live/xmltv/02a162774b/214180.m3u8"
  }
];

const logos = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDu-D6tpUgnxurH9_AkBQ6a9TzVVpBfNE0VJArNbaWwsFTAEddxVTgHs&s=10";

// 🧩 Render Channels
function renderChannels(list) {
  const container = document.getElementById("channelList");
  container.innerHTML = list.map((ch, i) => `
    <div class="channel-box" tabindex="0" data-index="${i}" onclick="playChannel('${ch.server1}')">
      <img loading="lazy" src="${logos}" alt="${ch.title}">
      <h3>${ch.title}</h3>
      <small>📅 ${ch.date} — ${ch.time} PH</small>
      <div id="timer-${i}" class="countdown">Loading...</div>
      <div class="server-buttons">
        <button onclick="event.stopPropagation(); playChannel('${ch.server1}')">Server 1</button>
        <button onclick="event.stopPropagation(); playChannel('${ch.server2}')">Server 2</button>
      </div>
    </div>
  `).join("");
  setFocus(focusedIndex);
}

// 🕒 Countdown
function updateCountdowns() {
  const now = new Date();
  const phTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const phDisplay = document.getElementById("phTime");

  if (phDisplay) {
    phDisplay.textContent = "🇵🇭 Philippine Time: " +
      phTime.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  channels.forEach((ch, i) => {
    const el = document.getElementById(`timer-${i}`);
    if (!el) return;

    const [time, ampm] = ch.time.toLowerCase().split(/(am|pm)/);
    let [hour, minute] = time.split(":").map(Number);
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    const [year, month, day] = ch.date.split("-").map(Number);
    const target = new Date(`${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00+08:00`);
    const diff = target - phTime;

    if (diff <= 0) {
      el.textContent = "LIVE NOW 🟢";
      el.style.color = "limegreen";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (diff <= 5 * 60 * 1000) {
      el.textContent = "Starting Soon 🔴";
      el.style.color = "#ff4444";
    } else {
      el.textContent = `Starts in ${d > 0 ? d + "d " : ""}${h}h ${m}m ${s}s`;
      el.style.color = "#ffcc66";
    }
  });
}

// ▶ Video Player (No popups / warnings)
function playChannel(url) {
  lastFocused = focusedIndex;
  const container = document.getElementById("videoContainer");
  const video = document.getElementById("videoPlayer");
  container.style.display = "flex";

  if (hls) hls.destroy();
  video.pause();
  video.removeAttribute("src");
  video.load();

  const isM3U8 = url.endsWith(".m3u8");
  const isTS = url.endsWith(".ts");

  try {
    if (isM3U8 && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveDurationInfinity: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    } else {
      video.src = url;
      video.play().catch(() => {});
    }

    // 🚫 Fully silent error handling
    const silentHandler = (e) => {
      if (e) {
        e.preventDefault?.();
        e.stopPropagation?.();
      }
      return false;
    };

    video.addEventListener("error", silentHandler, true);
    video.onerror = silentHandler;
    window.onerror = () => true;
    window.onunhandledrejection = () => true;
    console.error = () => {};
    console.warn = () => {};
  } catch (_) {}
}

// ❌ Close Player
function closeVideo() {
  const video = document.getElementById("videoPlayer");
  document.getElementById("videoContainer").style.display = "none";
  video.pause();
  video.removeAttribute("src");
  if (hls) hls.destroy();
  setFocus(lastFocused);
}

// 🔍 Search
document.getElementById("searchBar").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = channels.filter((c) => c.title.toLowerCase().includes(q));
  renderChannels(filtered);
});

// 🎮 TV Remote
document.addEventListener("keydown", (e) => {
  const total = document.querySelectorAll(".channel-box").length;
  switch (e.key) {
    case "ArrowDown": focusedIndex = Math.min(focusedIndex + 3, total - 1); break;
    case "ArrowUp": focusedIndex = Math.max(focusedIndex - 3, 0); break;
    case "ArrowRight": focusedIndex = Math.min(focusedIndex + 1, total - 1); break;
    case "ArrowLeft": focusedIndex = Math.max(focusedIndex - 1, 0); break;
    case "Enter": document.querySelectorAll(".channel-box")[focusedIndex]?.click(); break;
    case "Backspace":
    case "Escape": closeVideo(); break;
  }
  setFocus(focusedIndex);
});

// 🌟 Focus
function setFocus(index) {
  const boxes = document.querySelectorAll(".channel-box");
  boxes.forEach((b, i) => b.classList.toggle("focused", i === index));
  boxes[index]?.focus();
}

// 🚀 Init
window.onload = () => {
  renderChannels(channels);
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
};
