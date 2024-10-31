
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
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            resolve('no active tab')
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: returnSelection
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error("Failed to execute script:", chrome.runtime.lastError);
                    resolve('failed to execute')
                    return;
                }
                const selection = results[0].result
                resolve(selection || "No text selected")
            }); 
        });
    })
}

async function pasteIntoChatGPT(message) {
    let tabs = await chrome.tabs.query({ url: "https://chatgpt.com/*" });
    
   
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id }, 
        func: (msg) => {
            //let form = document.querySelector("form.w-full");

            const textArea = document.getElementById('prompt-textarea');
            console.log(textArea)      

            if (textArea) {
                //textArea.innerHTML = msg; 
                //textArea.focus();
                let enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                });
        
                textArea.dispatchEvent(enterEvent)

            } else {
                console.error("Text area not found");  
            }
        },
        args: [message]    
    })
}




const delay = ms => new Promise(res => setTimeout(res, ms));
let value = 'hello'; 

document.getElementById("load").addEventListener("click", async() => {
    result = await collectSelection()
    pasteIntoChatGPT(result)
});
