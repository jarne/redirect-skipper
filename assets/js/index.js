/**
 * BPM Counter | counter script
 */

const adUrlTextarea = document.getElementById("adUrlTextarea");
const targetArea = document.getElementById("targetArea");
const targetLink = document.getElementById("targetLink");

let targetUrl = "#";

function extractTargetUrl(adUrl) {
    if (!adUrl.includes("https%3A")) {
        return;
    }

    const p1 = adUrl.split("https%3A");
    if (p1.length !== 2) {
        return;
    }
    const firstPart = `https%3A${p1[1]}`;

    const p2 = firstPart.split("&");
    const secondPart = p2[0];

    const decoded = decodeURIComponent(secondPart);
    targetUrl = decoded;

    renderResult(targetUrl);
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
