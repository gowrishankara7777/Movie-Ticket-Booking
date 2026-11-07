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

// ---------- Booking (saved by the seats page) ----------
const booking = JSON.parse(sessionStorage.getItem("booking") || "null");

if (!booking) {
  window.location.href = "../movies/movies.html";
}

// ---------- Settings ----------
const FEE_PER_TICKET = 25;
const PAYMENT_MINUTES = 5;

// ---------- Elements ----------
const miniPoster = document.getElementById("miniPoster");
const methodsBox = document.getElementById("methods");
const errorMsg = document.getElementById("errorMsg");
const payBtn = document.getElementById("payBtn");
const overlay = document.getElementById("overlay");
const popupIcon = document.getElementById("popupIcon");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const popupDetails = document.getElementById("popupDetails");
const doneBtn = document.getElementById("doneBtn");

let selectedMethod = "upi";
let grandTotal = 0;
let timerId = null;

// ---------- Theatre text ----------
function getTheatreText() {
  if (!booking.theatre) return "-";
  return booking.theatre.name + ", " + booking.theatre.area;
}

// ---------- Show booking summary ----------
function showSummary() {
  const movie = booking.movie;

  document.getElementById("movieTitle").textContent = movie.title;
  document.getElementById("movieMeta").textContent =
    movie.language + " • " + movie.duration;
  document.getElementById("showTheatre").textContent = getTheatreText();
  document.getElementById("showDate").textContent = booking.date;
  document.getElementById("showTime").textContent = booking.time;
  document.getElementById("showSeats").textContent = booking.seats.join(", ");

  const fee = FEE_PER_TICKET * booking.seats.length;
  grandTotal = booking.total + fee;

  document.getElementById("ticketAmount").textContent = "₹" + booking.total;
  document.getElementById("feeAmount").textContent = "₹" + fee;
  document.getElementById("grandTotal").textContent = "₹" + grandTotal;
  payBtn.textContent = "Pay ₹" + grandTotal;

  // Poster (tries several image extensions)
  miniPoster.style.background = movie.color;
  miniPoster.textContent = movie.emoji;

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

// ---------- Payment method tabs (UPI / Card) ----------
methodsBox.addEventListener("click", function (event) {
  const btn = event.target.closest(".method");
  if (!btn) return;

  selectedMethod = btn.dataset.method;

  methodsBox.querySelectorAll(".method").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");

  document.querySelectorAll(".panel").forEach(function (p) {
    p.classList.remove("active");
  });
  document.getElementById("panel-" + selectedMethod).classList.add("active");

  errorMsg.textContent = "";
});

// ---------- Input formatting ----------
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");

cardNumber.addEventListener("input", function () {
  const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

cardExpiry.addEventListener("input", function () {
  let digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) {
    digits = digits.slice(0, 2) + "/" + digits.slice(2);
  }
  cardExpiry.value = digits;
});

cardCvv.addEventListener("input", function () {
  cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 3);
});

// ---------- Validation (returns an error message, or "" if OK) ----------
function validate() {
  if (selectedMethod === "upi") {
    const upi = document.getElementById("upiId").value.trim();
    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi)) {
      return "Please enter a valid UPI ID (example: name@upi).";
    }
  }

  if (selectedMethod === "card") {
    const number = cardNumber.value.replace(/\s/g, "");
    const name = document.getElementById("cardName").value.trim();
    const expiry = cardExpiry.value;
    const cvv = cardCvv.value;

    if (!/^[0-9]{16}$/.test(number)) {
      return "Please enter a valid 16-digit card number.";
    }
    if (name.length < 2) {
      return "Please enter the name on the card.";
    }
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
      return "Please enter the expiry as MM/YY.";
    }

    const month = Number(expiry.slice(0, 2));
    const year = 2000 + Number(expiry.slice(3));
    const now = new Date();
    const expired =
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1);

    if (expired) {
      return "This card has expired.";
    }
    if (!/^[0-9]{3}$/.test(cvv)) {
      return "Please enter a valid 3-digit CVV.";
    }
  }

  return "";
}

// ---------- Booking ID ----------
function makeBookingId() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let id = "CB";
  for (let i = 0; i < 4; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return id + Math.floor(1000 + Math.random() * 9000);
}

// ---------- Pay ----------
payBtn.addEventListener("click", function () {
  const error = validate();

  if (error) {
    errorMsg.textContent = error;
    return;
  }

  errorMsg.textContent = "";
  clearInterval(timerId);

  // Show "processing"
  overlay.classList.add("show");
  popupIcon.textContent = "⏳";
  popupTitle.textContent = "Processing payment...";
  popupText.textContent = "Please do not close this page.";
  popupDetails.innerHTML = "";
  doneBtn.style.display = "none";

  // Pretend the bank takes 2 seconds
  setTimeout(function () {
    const confirmed = {
      bookingId: makeBookingId(),
      movie: booking.movie,
      theatre: booking.theatre,
      date: booking.date,
      time: booking.time,
      seats: booking.seats,
      ticketAmount: booking.total,
      totalPaid: grandTotal,
      method: selectedMethod,
      mobile: mobileNumber,
    };

    // Save for a ticket page later
    sessionStorage.setItem("confirmedBooking", JSON.stringify(confirmed));
    sessionStorage.removeItem("booking");
    sessionStorage.removeItem("selectedMovie");
    sessionStorage.removeItem("selectedShow");

    popupIcon.textContent = "✅";
    popupTitle.textContent = "Booking Confirmed!";
    popupText.textContent = "Enjoy the show 🍿";
    popupDetails.innerHTML =
      "<strong>Booking ID:</strong> " +
      confirmed.bookingId +
      "<br />" +
      "<strong>Movie:</strong> " +
      confirmed.movie.title +
      "<br />" +
      "<strong>Theatre:</strong> " +
      getTheatreText() +
      "<br />" +
      "<strong>Date:</strong> " +
      confirmed.date +
      "<br />" +
      "<strong>Time:</strong> " +
      confirmed.time +
      "<br />" +
      "<strong>Seats:</strong> " +
      confirmed.seats.join(", ") +
      "<br />" +
      "<strong>Paid:</strong> ₹" +
      confirmed.totalPaid;
    doneBtn.style.display = "block";
  }, 2000);
});

// ---------- Back to movies ----------
doneBtn.addEventListener("click", function () {
  window.location.href = "../movies/movies.html";
});

// ---------- Countdown timer ----------
function startTimer() {
  let secondsLeft = PAYMENT_MINUTES * 60;
  const timerText = document.getElementById("timer");

  timerId = setInterval(function () {
    secondsLeft--;

    const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    timerText.textContent = m + ":" + s;

    if (secondsLeft <= 0) {
      clearInterval(timerId);
      alert("Session expired. Please select your seats again.");
      window.location.href = "../seats/seats.html";
    }
  }, 1000);
}

// ---------- Start ----------
if (booking) {
  showSummary();
  startTimer();
}
