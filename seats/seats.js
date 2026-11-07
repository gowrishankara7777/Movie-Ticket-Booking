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

// ---------- Selected movie + show (saved by earlier pages) ----------
const movie = JSON.parse(sessionStorage.getItem("selectedMovie") || "null");
const show = JSON.parse(sessionStorage.getItem("selectedShow") || "null");

if (!movie) {
  window.location.href = "../movies/movies.html";
} else if (!show) {
  window.location.href = "../theatres/theatres.html";
}

// ---------- Settings ----------
const MAX_SEATS = 8;
const SEATS_PER_ROW = 10;
const AISLE_AFTER = 5; // gap after the 5th seat

const rows = [
  { label: "A", price: 150 },
  { label: "B", price: 150 },
  { label: "C", price: 150 },
  { label: "D", price: 220 },
  { label: "E", price: 220 },
  { label: "F", price: 220 },
  { label: "G", price: 300 },
  { label: "H", price: 300 },
];

// ---------- Elements ----------
const miniPoster = document.getElementById("miniPoster");
const movieTitle = document.getElementById("movieTitle");
const movieMeta = document.getElementById("movieMeta");
const showMeta = document.getElementById("showMeta");
const seatMap = document.getElementById("seatMap");
const selectedSeatsText = document.getElementById("selectedSeats");
const totalPriceText = document.getElementById("totalPrice");
const proceedBtn = document.getElementById("proceedBtn");

// ---------- State ----------
let selectedSeats = []; // e.g. ["D4", "D5"]
let bookedSeats = []; // seats already taken for this show

// ---------- Movie + show header ----------
function showMovieHeader() {
  movieTitle.textContent = movie.title;
  movieMeta.textContent =
    movie.language + " • " + movie.duration + " • ⭐ " + movie.rating + "/10";

  showMeta.textContent =
    show.theatreName +
    ", " +
    show.area +
    " • " +
    show.format +
    " • " +
    show.date +
    " • " +
    show.time;

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

// ---------- Demo booked seats (same show = same booked seats) ----------
function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return hash;
}

function seededRandom(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBookedSeats() {
  const seed = hashText(
    movie.id + "|" + show.theatreId + "|" + show.date + "|" + show.time,
  );
  const random = seededRandom(seed);
  const booked = [];

  rows.forEach(function (row) {
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      if (random() < 0.25) {
        booked.push(row.label + n);
      }
    }
  });

  return booked;
}

// ---------- Draw seat map ----------
function drawSeats() {
  seatMap.innerHTML = "";

  rows.forEach(function (row, rowIndex) {
    // Small gap between price tiers
    if (rowIndex > 0 && rows[rowIndex - 1].price !== row.price) {
      const gap = document.createElement("div");
      gap.className = "tier-gap";
      seatMap.appendChild(gap);
    }

    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = row.label;
    rowDiv.appendChild(label);

    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const seatId = row.label + n;

      const seat = document.createElement("button");
      seat.className = "seat";
      seat.textContent = n;
      seat.dataset.seat = seatId;
      seat.title = seatId + " - ₹" + row.price;

      if (bookedSeats.includes(seatId)) {
        seat.classList.add("booked");
        seat.disabled = true;
      } else if (selectedSeats.includes(seatId)) {
        seat.classList.add("selected");
      }

      rowDiv.appendChild(seat);

      if (n === AISLE_AFTER) {
        const aisle = document.createElement("span");
        aisle.className = "aisle";
        rowDiv.appendChild(aisle);
      }
    }

    seatMap.appendChild(rowDiv);
  });
}

// ---------- Price of a seat ----------
function getSeatPrice(seatId) {
  const rowLabel = seatId.charAt(0);
  const row = rows.find(function (r) {
    return r.label === rowLabel;
  });
  return row.price;
}

// ---------- Update summary ----------
function updateSummary() {
  if (selectedSeats.length === 0) {
    selectedSeatsText.textContent = "None";
    totalPriceText.textContent = "₹0";
    proceedBtn.disabled = true;
    return;
  }

  let total = 0;
  selectedSeats.forEach(function (seatId) {
    total += getSeatPrice(seatId);
  });

  selectedSeatsText.textContent = selectedSeats.join(", ");
  totalPriceText.textContent = "₹" + total;
  proceedBtn.disabled = false;
}

// ---------- Click on a seat ----------
seatMap.addEventListener("click", function (event) {
  const seat = event.target.closest(".seat");
  if (!seat || seat.classList.contains("booked")) return;

  const seatId = seat.dataset.seat;

  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter(function (s) {
      return s !== seatId;
    });
    seat.classList.remove("selected");
  } else {
    if (selectedSeats.length >= MAX_SEATS) {
      alert("You can select a maximum of " + MAX_SEATS + " seats.");
      return;
    }
    selectedSeats.push(seatId);
    seat.classList.add("selected");
  }

  updateSummary();
});

// ---------- Proceed ----------
proceedBtn.addEventListener("click", function () {
  let total = 0;
  selectedSeats.forEach(function (seatId) {
    total += getSeatPrice(seatId);
  });

  const booking = {
    movie: movie,
    theatre: {
      id: show.theatreId,
      name: show.theatreName,
      area: show.area,
      format: show.format,
    },
    date: show.date,
    time: show.time,
    seats: selectedSeats,
    total: total,
  };

  // Save booking for the payment page
  sessionStorage.setItem("booking", JSON.stringify(booking));

  // Go to payment
  window.location.href = "../payment/payment.html";
});

// ---------- Start ----------
if (movie && show) {
  showMovieHeader();
  bookedSeats = generateBookedSeats();
  drawSeats();
  updateSummary();
}
