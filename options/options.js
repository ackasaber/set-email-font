import { getFontOptions, saveFontFamily, saveFontSize } from '../options_storage.js';
import * as i18n from '../i18n.mjs'

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

i18n.localizeDocument();
restoreOptions();