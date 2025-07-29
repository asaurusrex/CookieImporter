document.getElementById("importBtn").addEventListener("click", () => {
  const input = document.getElementById("cookieInput").value;
  const status = document.getElementById("status");
  status.textContent = "";

  let cookies;
  try {
    cookies = JSON.parse(input);
    if (!Array.isArray(cookies)) throw new Error("Not an array");

    for (const cookie of cookies) {
      if (typeof cookie.name !== "string" || typeof cookie.value !== "string" || typeof cookie.domain !== "string") {
        throw new Error("Invalid cookie format");
      }
    }

    chrome.storage.local.set({ importCookies: cookies }, () => {
      status.style.color = "green";
      status.textContent = "✅ Cookies saved for import!";
    });

  } catch (err) {
    status.style.color = "red";
    status.textContent = "❌ Invalid JSON: " + err.message;
  }
});
