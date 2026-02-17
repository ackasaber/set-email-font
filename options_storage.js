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

export { getFontOptions, saveFontFamily, saveFontSize };
