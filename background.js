import { getFontOptions } from "./options_storage.js";

async function commandHandler(message, sender) {
    switch (message.command) {
    case "getFontOptions":
        return getFontOptions();
    }

    return false;
}

messenger.scripting.compose.registerScripts([{
    id: "set-email-font",
    js: ["compose.js"]
}]).catch(console.info);

messenger.runtime.onMessage.addListener((message, sender) => {
    if (message && message.hasOwnProperty("command")) {
        return commandHandler(message, sender);
    }

    return false;
})