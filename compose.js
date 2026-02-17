async function getFontOptions() {
    // ES6 modules can't be used in compose scripts, so fetch the data from the background script.
    return messenger.runtime.sendMessage({ command: "getFontOptions" });
}

async function setEmailFont() {
    try {
        const { fontFamily, fontSize } = await getFontOptions();
        document.body.style.fontFamily = fontFamily;
        document.body.style.fontSize = fontSize;
    } catch (e) {
        console.error(e);
    }
}

setEmailFont();
