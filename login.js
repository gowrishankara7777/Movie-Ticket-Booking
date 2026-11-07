document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const mobile = document.getElementById("mobile").value.trim();

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    // Store mobile number
    sessionStorage.setItem("mobileNumber", mobile);

    // Navigate to OTP folder
    window.location.href = "otp/otp.html";
  });

function register(event) {
  event.preventDefault();
  alert("Registration page will be added later.");
}
