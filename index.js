function returnSelection() {
    return new Promise((resolve, reject) => {
        if (window.getSelection) {
            resolve(window.getSelection().toString());
        } else if (document.getSelection) {
            resolve(document.getSelection().toString());
        } else if (document.selection) {
            resolve(document.selection.createRange().text.toString());
        } else reject("No selection API available");
    });
}

async function collectSelection() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            console.error("No active tab found");
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: returnSelection
        }, (results) => {
            if (chrome.runtime.lastError) {
                console.error("Failed to execute script:", chrome.runtime.lastError);
                return;
            }
            
            const selectedText = results[0].result;
            console.log("Selected text:", selectedText);
            display.innerText = selectedText || "No text selected";
            value = selectedText || "No text selected"
        });
    });
}

async function pasteIntoChatGPT(message) {
    const tabs = await chrome.tabs.query({ url: "https://chatgpt.com/" });

    if (tabs.length === 0) {
        console.error("ChatGPT tab not found");
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id }, 
        func: (msg) => {
            const textArea = document.getElementById('prompt-textarea');
            if (textArea) {
                textArea.innerHTML = msg; 
                textArea.focus();
            } else {
                console.error("Text area not found");
            }
        },
        args: [message] 
    });
}







const display = document.getElementById("display");
let value = 'hello'; 

document.getElementById("createGPT").addEventListener("click", () => {
    console.log(value)
    pasteIntoChatGPT(value);
});

document.getElementById("load").addEventListener("click", () => {
    collectSelection(value)
});