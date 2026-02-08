async function getFontOptions() {
    return await messenger.runtime.sendMessage({ command: "getFontOptions" });
}

async function saveFontFamily(fontFamily) {
    await messenger.runtime.sendMessage({ command: "saveFontFamily", fontFamily });
}

async function saveFontSize(fontSize) {
    await messenger.runtime.sendMessage({ command: "saveFontSize", fontSize });
}

async function restoreOptions() {
    const { fontFamily, fontSize } = await getFontOptions();
    const fontFamilyInput = document.getElementById("fontFamily");
    fontFamilyInput.value = fontFamily;
    fontFamilyInput.addEventListener("input", e => {
        saveFontFamily(e.target.value);
    });
    const fontSizeInput = document.getElementById("fontSize");
    fontSizeInput.value = fontSize;
    fontSizeInput.addEventListener("input", e => {
        saveFontSize(e.target.value);
    })
}

restoreOptions();