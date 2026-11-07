const otpForm = document.getElementById("otpForm");
const otpInput = document.getElementById("otp");
const displayMobile = document.getElementById("displayMobile");

const mobileNumber = sessionStorage.getItem("mobileNumber");

if (!mobileNumber) {
  window.location.href = "../login/login.html";
} else {
  displayMobile.textContent = "+91 " + mobileNumber;
}

// Demo OTP
const demoOTP = "223344";

// Verify OTP
otpForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredOTP = otpInput.value.trim();

  if (enteredOTP === demoOTP) {
    sessionStorage.setItem("isLoggedIn", "true");
    window.location.href = "../movies/movies.html";
  } else {
    alert("Invalid OTP. Please enter the correct OTP.");
    otpInput.value = "";
    otpInput.focus();
  }
});

// Resend OTP
function resendOTP() {
  otpInput.value = "";
  otpInput.focus();

  alert("OTP has been resent. Please re-enter the OTP.");
}
