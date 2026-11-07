// ---------- Login check ----------
const isLoggedIn = sessionStorage.getItem("isLoggedIn");
const mobileNumber = sessionStorage.getItem("mobileNumber");

if (isLoggedIn !== "true") {
  window.location.href = "../index.html";
}

document.getElementById("userMobile").textContent = mobileNumber || "";

// ---------- Logout ----------
document.getElementById("logoutBtn").addEventListener("click", function () {
  sessionStorage.clear();
  window.location.href = "../index.html";
});

// ---------- Selected movie (saved by the movies page) ----------
const movie = JSON.parse(sessionStorage.getItem("selectedMovie") || "null");

if (!movie) {
  window.location.href = "../movies/movies.html";
}

// ---------- Theatres (sample data - edit freely) ----------
const theatres = [
  {
    id: 1,
    name: "CineBook Grand",
    area: "City Center",
    format: "Dolby Atmos",
    times: ["10:00 AM", "01:30 PM", "04:45 PM", "08:00 PM", "11:00 PM"],
  },
  {
    id: 2,
    name: "Starlight Multiplex",
    area: "Mall Road",
    format: "4K Laser",
    times: ["11:15 AM", "02:30 PM", "06:00 PM", "09:15 PM"],
  },
  {
    id: 3,
    name: "Silver Screen Cinemas",
    area: "Central Plaza",
    format: "2D",
    times: ["10:30 AM", "01:45 PM", "05:00 PM", "08:30 PM"],
  },
  {
    id: 4,
    name: "Galaxy IMAX",
    area: "Lakeview",
    format: "IMAX",
    times: ["12:00 PM", "03:30 PM", "07:00 PM", "10:30 PM"],
  },
  {
    id: 5,
    name: "Royal Talkies",
    area: "Old Town",
    format: "2D",
    times: ["09:45 AM", "01:00 PM", "04:15 PM", "07:30 PM"],
  },
];

// ---------- Elements ----------
const miniPoster = document.getElementById("miniPoster");
const movieTitle = document.getElementById("movieTitle");
const movieMeta = document.getElementById("movieMeta");
const dateChips = document.getElementById("dateChips");
const theatreList = document.getElementById("theatreList");
const noShows = document.getElementById("noShows");

// ---------- State ----------
let dates = [];
let selectedDateIndex = 0;

// ---------- Movie header ----------
function showMovieHeader() {
  movieTitle.textContent = movie.title;
  movieMeta.textContent =
    movie.language + " • " + movie.duration + " • ⭐ " + movie.rating + "/10";

  miniPoster.style.background = movie.color;
  miniPoster.textContent = movie.emoji;

  // Try several image extensions (movies folder is one level up)
  const basePath = "../movies/" + movie.image.replace(/\.[^.]+$/, "");
  const extensions = [".jpg", ".png", ".webp", ".jpeg"];
  let attempt = 0;

  const img = document.createElement("img");
  img.alt = movie.title + " poster";

  img.addEventListener("error", function () {
    attempt++;
    if (attempt < extensions.length) {
      img.src = basePath + extensions[attempt];
    } else {
      img.remove();
    }
  });

  img.src = basePath + extensions[0];
  miniPoster.appendChild(img);
}

// ---------- Dates (today + next 4 days) ----------
function createDates() {
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  dates.forEach(function (d, index) {
    const label =
      index === 0
        ? "Today"
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });

    const btn = document.createElement("button");
    btn.className = "chip" + (index === 0 ? " active" : "");
    btn.textContent = label;

    btn.addEventListener("click", function () {
      selectedDateIndex = index;

      dateChips.querySelectorAll(".chip").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      showTheatres();
    });

    dateChips.appendChild(btn);
  });
}

// ---------- "10:00 AM" -> minutes since midnight ----------
function toMinutes(timeText) {
  const parts = timeText.split(" ");
  const hm = parts[0].split(":");
  let hours = Number(hm[0]) % 12;
  const minutes = Number(hm[1]);

  if (parts[1] === "PM") hours += 12;

  return hours * 60 + minutes;
}

// ---------- Has this show already started? (only matters for today) ----------
function isPast(timeText) {
  if (selectedDateIndex !== 0) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return toMinutes(timeText) <= nowMinutes;
}

// ---------- Show theatre cards ----------
function showTheatres() {
  theatreList.innerHTML = "";
  let availableShows = 0;

  theatres.forEach(function (theatre) {
    const card = document.createElement("div");
    card.className = "theatre-card";

    const info = document.createElement("div");
    info.className = "theatre-info";
    info.innerHTML = `
      <h4>${theatre.name}</h4>
      <p class="theatre-area">📍 ${theatre.area}</p>
      <span class="format-tag">${theatre.format}</span>
      <p class="cancel-note">✔ Cancellation available</p>
    `;

    const timesBox = document.createElement("div");
    timesBox.className = "show-times";

    theatre.times.forEach(function (time) {
      const btn = document.createElement("button");
      btn.className = "show-btn";
      btn.textContent = time;
      btn.dataset.theatre = theatre.id;
      btn.dataset.time = time;

      if (isPast(time)) {
        btn.disabled = true;
      } else {
        availableShows++;
      }

      timesBox.appendChild(btn);
    });

    card.appendChild(info);
    card.appendChild(timesBox);
    theatreList.appendChild(card);
  });

  noShows.style.display = availableShows === 0 ? "block" : "none";
}

// ---------- Click on a showtime ----------
theatreList.addEventListener("click", function (event) {
  const btn = event.target.closest(".show-btn");
  if (!btn || btn.disabled) return;

  const theatre = theatres.find(function (t) {
    return t.id === Number(btn.dataset.theatre);
  });

  const show = {
    theatreId: theatre.id,
    theatreName: theatre.name,
    area: theatre.area,
    format: theatre.format,
    date: dates[selectedDateIndex].toDateString(),
    time: btn.dataset.time,
  };

  // Save for the seat selection page
  sessionStorage.setItem("selectedShow", JSON.stringify(show));

  window.location.href = "../seats/seats.html";
});

// ---------- Start ----------
if (movie) {
  showMovieHeader();
  createDates();
  showTheatres();
}
