async function getFontOptions() {
    return await messenger.storage.local.get({
        fontFamily: "Calibri, 'Droid Sans', Helvetica, sans-serif",
        fontSize: "11pt"
    });
}

async function saveFontFamily(fontFamily) {
    await messenger.storage.local.set({ fontFamily });
}

async function saveFontSize(fontSize) {
    await messenger.storage.local.set({ fontSize });
}

async function dispatchRuntimeMessage(message, sender) {
    if (!message || !message.hasOwnProperty("command"))
        return;

    const { command } = message;
    const { tab: { id: tabId } } = sender;

    switch (command) {
    case "log":
        console.log(`[tab ${tabId}] ${message.text}`);
        return;

    case "getFontOptions":
        return await getFontOptions();

    case "saveFontFamily":
        await saveFontFamily(message.fontFamily);
        return;

    case "saveFontSize":
        await saveFontSize(message.fontSize);
        return;
    }
}

messenger.scripting.compose.registerScripts([{
    id: "set-email-font",
    js: ["compose.js"]
}]).catch(console.info);

messenger.runtime.onMessage.addListener(dispatchRuntimeMessage)