// Extract the current URL
var currentUrl = window.location.href;

// Check if the current URL contains "windfish.ddns.net"
if (currentUrl.includes("windfish.ddns.net")) {
    // Replace "windfish.ddns.net" with "wfshores.com" in the URL
    var newUrl = currentUrl.replace("windfish.ddns.net", "wfshores.com");

    // Redirect to the new URL
    window.location.replace(newUrl);
} else {
    // If the URL doesn't contain "windfish.ddns.net", no redirection needed
    console.log("No redirection needed.");
}
