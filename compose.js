async function log(message) {
    await messenger.runtime.sendMessage({
        command: "log",
        text: message
    });
}

async function getFontOptions() {
    return await messenger.runtime.sendMessage({ command: "getFontOptions" });
}

async function setEmailFont() {
    try {
        const { fontFamily, fontSize } = await getFontOptions();
        document.body.style.fontFamily = fontFamily;
        document.body.style.fontSize = fontSize;
        await log(`set e-mail font to ${fontFamily} ${fontSize}`);
    } catch (e) {
        await log(`compose script error ${e}`);
    }
}

setEmailFont();
