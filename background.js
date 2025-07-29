chrome.runtime.onStartup.addListener(applyStoredCookies);
chrome.runtime.onInstalled.addListener(applyStoredCookies);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.importCookies) {
    applyCookies(changes.importCookies.newValue);
  }
});

async function applyStoredCookies() {
  chrome.storage.local.get("importCookies", (result) => {
    if (result.importCookies) {
      applyCookies(result.importCookies);
    }
  });
}

async function applyCookies(cookieList) {
  for (const cookie of cookieList) {
    const url = getUrlFromCookie(cookie);
    if (!url) continue;

    try {
      await chrome.cookies.set({
        url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || "/",
        secure: cookie.secure || false,
        httpOnly: cookie.httpOnly || false,
        sameSite: cookie.sameSite || "no_restriction",
        expirationDate: cookie.expirationDate,
        storeId: cookie.storeId || undefined
      });
      console.log(`✅ Set cookie: ${cookie.name} for ${url}`);
    } catch (e) {
      console.warn(`❌ Failed to set cookie ${cookie.name}:`, e);
    }
  }
}

function getUrlFromCookie(cookie) {
  try {
    const protocol = cookie.secure ? "https://" : "http://";
    const host = cookie.domain.startsWith(".") ? cookie.domain.substring(1) : cookie.domain;
    return `${protocol}${host}${cookie.path || "/"}`;
  } catch (e) {
    console.warn("❌ Could not build URL from cookie:", cookie, e);
    return null;
  }
}
