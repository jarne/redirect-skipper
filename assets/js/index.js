/**
 * BPM Counter | counter script
 */

const PLAIN_HTTPS = "https://";
const ENCODED_HTTPS = "https%3A";

const adUrlTextarea = document.getElementById("adUrlTextarea");
const targetArea = document.getElementById("targetArea");
const targetLink = document.getElementById("targetLink");
const notFoundMsg = document.getElementById("notFoundMsg");

let targetUrl = "#";

function tryExtractEncodedUrl(adUrl) {
    const encUrlParts = adUrl.split(ENCODED_HTTPS);
    if (encUrlParts.length < 2) {
        throw new Exception();
    }
    const firstPart = `${ENCODED_HTTPS}${encUrlParts[1]}`;

    const urlEndParts = firstPart.split("&");
    const secondPart = urlEndParts[0];

    return decodeURIComponent(secondPart);
}

function tryExtractPlainUrl(adUrl) {
    const plaUrlParts = adUrl.split(PLAIN_HTTPS);
    if (plaUrlParts.length < 3) {
        throw new Exception();
    }
    const containedPart = `${PLAIN_HTTPS}${plaUrlParts[2]}`;

    return containedPart;
}

function extractTargetUrl(adUrl) {
    let fetchedUrl;

    try {
        fetchedUrl = tryExtractEncodedUrl(adUrl);
        return processResult(fetchedUrl);
    } catch (e) {
        // do nothing
    }

    try {
        fetchedUrl = tryExtractPlainUrl(adUrl);
        return processResult(fetchedUrl);
    } catch (e) {
        // do nothing
    }

    notFoundMsg.style.display = "inherit";
}

function processResult(fetchedUrl) {
    targetUrl = fetchedUrl;
    renderResult(fetchedUrl);
}

function renderResult(targetUrl) {
    targetLink.setAttribute("href", targetUrl);
    targetLink.innerText = targetUrl;

    targetArea.style.display = "inherit";

    targetLink.focus();
}

async function pasteClipboard() {
    let cbContent;
    try {
        cbContent = await navigator.clipboard.readText();
    } catch (e) {
        return;
    }

    adUrlTextarea.value = cbContent;
    extractTargetUrl(cbContent);
}

adUrlTextarea.addEventListener("input", (ev) => {
    extractTargetUrl(ev.target.value);
});

document.addEventListener("keydown", async (ev) => {
    if (ev.code !== "Enter") {
        return;
    }

    if (targetUrl === "#") {
        await pasteClipboard();

        return;
    }

    window.location.href = targetUrl;
});

window.addEventListener("load", async (ev) => {
    adUrlTextarea.focus();
});
