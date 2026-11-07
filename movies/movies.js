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

// ---------- Movie data (Telugu + Hindi + English) ----------
// image = file inside movies/images/  (emoji + color are used if image is missing)
const movies = [
  // ----- Telugu -----
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    language: "Telugu",
    duration: "3h 20m",
    rating: 8.0,
    image: "images/pushpa2.jpg",
    emoji: "🪓",
    color: "linear-gradient(135deg, #cb2d3e, #ef473a)",
  },
  {
    id: 2,
    title: "RRR",
    language: "Telugu",
    duration: "3h 07m",
    rating: 8.8,
    image: "images/rrr.jpg",
    emoji: "🔥",
    color: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
  {
    id: 3,
    title: "Baahubali 2: The Conclusion",
    language: "Telugu",
    duration: "2h 47m",
    rating: 8.2,
    image: "images/baahubali2.jpg",
    emoji: "⚔️",
    color: "linear-gradient(135deg, #134e5e, #71b280)",
  },
  {
    id: 4,
    title: "Kalki 2898 AD",
    language: "Telugu",
    duration: "3h 01m",
    rating: 7.6,
    image: "images/kalki.jpg",
    emoji: "🚀",
    color: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  {
    id: 5,
    title: "Salaar: Part 1 - Ceasefire",
    language: "Telugu",
    duration: "2h 55m",
    rating: 6.5,
    image: "images/salaar.jpg",
    emoji: "💥",
    color: "linear-gradient(135deg, #232526, #414345)",
  },
  {
    id: 6,
    title: "Devara: Part 1",
    language: "Telugu",
    duration: "2h 57m",
    rating: 6.7,
    image: "images/devara.jpg",
    emoji: "🌊",
    color: "linear-gradient(135deg, #0f2027, #2c5364)",
  },
  {
    id: 7,
    title: "HanuMan",
    language: "Telugu",
    duration: "2h 38m",
    rating: 7.9,
    image: "images/hanuman.jpg",
    emoji: "🐒",
    color: "linear-gradient(135deg, #8e2de2, #4a00e0)",
  },
  {
    id: 8,
    title: "Lucky Baskhar",
    language: "Telugu",
    duration: "2h 28m",
    rating: 8.1,
    image: "images/lucky-baskhar.jpg",
    emoji: "💰",
    color: "linear-gradient(135deg, #614385, #516395)",
  },

  // ----- Hindi -----
  {
    id: 9,
    title: "Jawan",
    language: "Hindi",
    duration: "2h 49m",
    rating: 7.0,
    image: "images/jawan.jpg",
    emoji: "🎭",
    color: "linear-gradient(135deg, #232526, #8e2de2)",
  },
  {
    id: 10,
    title: "Pathaan",
    language: "Hindi",
    duration: "2h 26m",
    rating: 5.9,
    image: "images/pathaan.jpg",
    emoji: "🕵️",
    color: "linear-gradient(135deg, #cb2d3e, #ef473a)",
  },
  {
    id: 11,
    title: "Animal",
    language: "Hindi",
    duration: "3h 21m",
    rating: 6.3,
    image: "images/animal.jpg",
    emoji: "🐺",
    color: "linear-gradient(135deg, #373b44, #bd3f32)",
  },
  {
    id: 12,
    title: "Stree 2",
    language: "Hindi",
    duration: "2h 27m",
    rating: 7.5,
    image: "images/stree2.jpg",
    emoji: "👻",
    color: "linear-gradient(135deg, #614385, #516395)",
  },
  {
    id: 13,
    title: "3 Idiots",
    language: "Hindi",
    duration: "2h 50m",
    rating: 8.4,
    image: "images/3-idiots.jpg",
    emoji: "🎓",
    color: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
  {
    id: 14,
    title: "Dangal",
    language: "Hindi",
    duration: "2h 41m",
    rating: 8.3,
    image: "images/dangal.jpg",
    emoji: "🤼",
    color: "linear-gradient(135deg, #134e5e, #71b280)",
  },
  {
    id: 15,
    title: "Chhaava",
    language: "Hindi",
    duration: "2h 41m",
    rating: 7.3,
    image: "images/chhaava.jpg",
    emoji: "🛡️",
    color: "linear-gradient(135deg, #b24592, #f15f79)",
  },
  {
    id: 16,
    title: "Bajrangi Bhaijaan",
    language: "Hindi",
    duration: "2h 43m",
    rating: 8.1,
    image: "images/bajrangi-bhaijaan.jpg",
    emoji: "🙏",
    color: "linear-gradient(135deg, #1cb5e0, #000046)",
  },

  // ----- English -----
  {
    id: 17,
    title: "Inception",
    language: "English",
    duration: "2h 28m",
    rating: 8.8,
    image: "images/inception.jpg",
    emoji: "🌀",
    color: "linear-gradient(135deg, #373b44, #4286f4)",
  },
  {
    id: 18,
    title: "Interstellar",
    language: "English",
    duration: "2h 49m",
    rating: 8.7,
    image: "images/interstellar.jpg",
    emoji: "🪐",
    color: "linear-gradient(135deg, #0f0c29, #302b63)",
  },
  {
    id: 19,
    title: "The Dark Knight",
    language: "English",
    duration: "2h 32m",
    rating: 9.0,
    image: "images/dark-knight.jpg",
    emoji: "🦇",
    color: "linear-gradient(135deg, #141e30, #243b55)",
  },
  {
    id: 20,
    title: "Avengers: Endgame",
    language: "English",
    duration: "3h 01m",
    rating: 8.4,
    image: "images/endgame.jpg",
    emoji: "🦸",
    color: "linear-gradient(135deg, #7b4397, #dc2430)",
  },
  {
    id: 21,
    title: "Oppenheimer",
    language: "English",
    duration: "3h 00m",
    rating: 8.3,
    image: "images/oppenheimer.jpg",
    emoji: "💣",
    color: "linear-gradient(135deg, #b24592, #f15f79)",
  },
  {
    id: 22,
    title: "Dune: Part Two",
    language: "English",
    duration: "2h 46m",
    rating: 8.5,
    image: "images/dune2.jpg",
    emoji: "🏜️",
    color: "linear-gradient(135deg, #c79081, #dfa579)",
  },
  {
    id: 23,
    title: "Avatar: The Way of Water",
    language: "English",
    duration: "3h 12m",
    rating: 7.6,
    image: "images/avatar2.jpg",
    emoji: "🌊",
    color: "linear-gradient(135deg, #1cb5e0, #000046)",
  },
  {
    id: 24,
    title: "Deadpool & Wolverine",
    language: "English",
    duration: "2h 08m",
    rating: 7.6,
    image: "images/deadpool-wolverine.jpg",
    emoji: "😂",
    color: "linear-gradient(135deg, #cb2d3e, #ffc93c)",
  },
];

// ---------- Languages shown as buttons ----------
const languages = ["Telugu", "Hindi", "English"];
let selectedLanguage = "Telugu"; // default tab

// ---------- Elements ----------
const movieGrid = document.getElementById("movieGrid");
const languageFilters = document.getElementById("languageFilters");
const noResults = document.getElementById("noResults");

// ---------- Build one poster (tries several image extensions) ----------
function createPoster(movie) {
  const poster = document.createElement("div");
  poster.className = "poster";
  poster.style.background = movie.color;
  poster.textContent = movie.emoji;

  const tag = document.createElement("span");
  tag.className = "lang-tag";
  tag.textContent = movie.language;
  poster.appendChild(tag);

  // "images/rrr.jpg" -> "images/rrr"
  const basePath = movie.image.replace(/\.[^.]+$/, "");
  const extensions = [".jpg", ".png", ".webp", ".jpeg"];
  let attempt = 0;

  const img = document.createElement("img");
  img.alt = movie.title + " poster";
  img.loading = "lazy";

  img.addEventListener("error", function () {
    attempt++;
    if (attempt < extensions.length) {
      img.src = basePath + extensions[attempt];
    } else {
      img.remove(); // no image found, so the emoji fallback shows
    }
  });

  img.src = basePath + extensions[0];
  poster.appendChild(img);
  return poster;
}

// ---------- Show movies ----------
function showMovies(list) {
  movieGrid.innerHTML = "";

  if (list.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  list.forEach(function (movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.appendChild(createPoster(movie));

    const info = document.createElement("div");
    info.className = "movie-info";
    info.innerHTML = `
      <h3>${movie.title}</h3>
      <p class="meta">
        ${movie.language}<br />
        ${movie.duration}<br />
        <span class="rating">⭐ ${movie.rating}/10</span>
      </p>
      <button class="book-btn" data-id="${movie.id}">Book Now</button>
    `;

    card.appendChild(info);
    movieGrid.appendChild(card);
  });
}

// ---------- Filter by language ----------
function applyFilter() {
  const filtered = movies.filter(function (movie) {
    return movie.language === selectedLanguage;
  });

  showMovies(filtered);
}

// ---------- Language buttons ----------
function createFilters() {
  languages.forEach(function (language) {
    const btn = document.createElement("button");
    btn.className =
      "filter-btn" + (language === selectedLanguage ? " active" : "");
    btn.textContent = language;

    btn.addEventListener("click", function () {
      languageFilters.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      selectedLanguage = language;
      applyFilter();
    });

    languageFilters.appendChild(btn);
  });
}

// ---------- Select a movie ----------
movieGrid.addEventListener("click", function (event) {
  if (!event.target.classList.contains("book-btn")) return;

  const movieId = Number(event.target.dataset.id);
  const selectedMovie = movies.find(function (movie) {
    return movie.id === movieId;
  });

  // Save selected movie for the theatre selection page
  sessionStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));

  // Clear any previous show choice
  sessionStorage.removeItem("selectedShow");

  // Go to theatre selection
  window.location.href = "../theatres/theatres.html";
});

// ---------- Start ----------
createFilters();
applyFilter();
