
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
            const selection = results[0].result
            display.innerText = selection || "No text selected";
            value = selection || "No text selected"
        });
    });
}

async function pasteIntoChatGPT(message) {
    let tabs = await chrome.tabs.query({ url: "https://chatgpt.com/*" });

   
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
   
    })
}






const delay = ms => new Promise(res => setTimeout(res, ms));
const display = document.getElementById("display");
let value = 'hello'; 

document.getElementById("load").addEventListener("click", () => {
    collectSelection(value)
    //pasteIntoChatGPT(value)
    //console.log('finished attempt to paste into chatgpt')
});
