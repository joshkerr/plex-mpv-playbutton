console.log('Plex MPV Launcher content script started');

function waitForElement(selector, callback, maxAttempts = 10) {
    let attempts = 0;
    
    const checkElement = () => {
        attempts++;
        const element = document.querySelector(selector);
        
        if (element) {
            callback(element);
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(checkElement, 500);
        } else {
            console.log(`Failed to find element: ${selector} after ${maxAttempts} attempts`);
        }
    };
    
    checkElement();
}

function createMPVButton() {
    const mpvButton = document.createElement('button');
    mpvButton.id = 'mpv-play-button';
    mpvButton.className = '_1v4h9jl0 _76v8d62 _76v8d61 _76v8d68 tvbry60 _76v8d6g _76v8d65 _1v25wbq1g _1v25wbq1c';
    mpvButton.setAttribute('role', 'button');
    mpvButton.setAttribute('type', 'button');
    mpvButton.setAttribute('data-testid', 'preplay-mpv');
    
    mpvButton.innerHTML = `
        <div aria-hidden="true" class="_76v8d6p">
            <div aria-hidden="true" class="_1oqmfda1 _1oqmfda3 _1oqmfda6"></div>
        </div>
        <div aria-hidden="false" class="_76v8d6q">
            <div class="_1h4p3k00 _1v25wbq8 _1v25wbq1w _1v25wbqg _1v25wbq1g _1v25wbq1c _1v25wbq14 _1v25wbq3g _1v25wbq2g">
                <svg aria-hidden="true" class="rkbrtb0 rkbrtb1 rkbrtb3 _1v25wbq5k" fill="currentColor" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 42C13.1022 42 12.7206 41.842 12.4393 41.5607C12.158 41.2794 12 40.8978 12 40.5V7.49999C12 7.23932 12.0679 6.98314 12.197 6.75671C12.3262 6.53028 12.5121 6.34141 12.7365 6.20873C12.9609 6.07605 13.216 6.00413 13.4766 6.00006C13.7372 5.99599 13.9944 6.05992 14.2229 6.18554L44.2228 22.6855C44.4582 22.815 44.6545 23.0052 44.7912 23.2364C44.9279 23.4676 45.0001 23.7313 45.0001 23.9999C45.0001 24.2685 44.9279 24.5322 44.7912 24.7634C44.6545 24.9946 44.4582 25.1849 44.2228 25.3143L14.2229 41.8143C14.0014 41.9361 13.7527 41.9999 13.5 42Z" fill="currentColor"></path>
                </svg>
                <span class="ineka90 ineka9h ineka9d ineka9r ineka9n _1v25wbq1g _1v25wbq1c _1v25wbqlk" title="MPV">MPV</span>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #mpv-play-button {
            background-color: #E5A00D !important;
            color: black !important;
        }
        #mpv-play-button:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    mpvButton.addEventListener('click', handleMPVPlay);
    return mpvButton;
}

function addMPVButton() {
    // Remove any existing MPV buttons first
    const existingButtons = document.querySelectorAll('#mpv-play-button');
    existingButtons.forEach(button => button.remove());

    // Wait for the button container to exist
    waitForElement('div[class*="_1h4p3k00"][class*="_1v25wbq8"][class*="_1v25wbq1o"]', (buttonContainer) => {
        console.log('Found button container:', buttonContainer);
        
        // Wait for the play button to exist
        waitForElement('[data-testid="preplay-play"]', (playButton) => {
            // Double check that an MPV button doesn't exist before adding
            if (!document.querySelector('#mpv-play-button')) {
                console.log('Found play button, adding MPV button');
                const mpvButton = createMPVButton();
                playButton.insertAdjacentElement('afterend', mpvButton);
            }
        });
    });
}

function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 20px;
        background-color: #333;
        color: white;
        padding: 10px;
        border-radius: 4px;
        z-index: 10000;
        transition: opacity 0.5s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

function openMoreOptionsMenu() {
    const moreButton = document.querySelector('button[data-testid="moreLikeThisMoreButton"]') ||
                       document.querySelector('button[aria-label="More"]');
    if (moreButton) {
        moreButton.click();
        return true;
    }
    console.error('More options button not found');
    return false;
}

function getPlexToken() {
    const possibleTokenSources = [
        document.querySelector('[data-testid="preplayPlay"]')?.getAttribute('data-token'),
        Array.from(document.querySelectorAll('a[href*="X-Plex-Token"]'))
            .map(a => new URLSearchParams(new URL(a.href).search).get('X-Plex-Token'))
            .find(token => token),
        Array.from(document.querySelectorAll('img[src*="X-Plex-Token"]'))
            .map(img => new URLSearchParams(new URL(img.src).search).get('X-Plex-Token'))
            .find(token => token)
    ];

    return possibleTokenSources.find(token => token);
}

function handleMPVPlay() {
    const moreButton = document.querySelector('button[data-testid="moreLikeThisMoreButton"]') ||
                       document.querySelector('button[aria-label="More"]');
    if (moreButton) {
        moreButton.click();
        
        setTimeout(() => {
            const link = document.querySelector('a[data-testid="dropdownItem"][target="downloadFileFrame"]');
            if (link) {
                const mpvCommand = `mpv "${link.href}"`;
                
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                }));
                
                navigator.clipboard.writeText(mpvCommand).then(() => {
                    showNotification('MPV command copied to clipboard!');
                    
                    const watchedButton = document.querySelector('button[data-testid="preplay-togglePlayedState"]');
                    if (watchedButton) {
                        watchedButton.click();
                        showNotification('Marked as watched');
                    }
                });
            } else {
                showNotification('Failed to find download link');
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                }));
            }
        }, 50);
    } else {
        showNotification('Failed to find More button');
    }
}

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('URL changed, checking for button placement');
        addMPVButton();
    }
}).observe(document, {subtree: true, childList: true});

console.log('Starting MPV button setup');
addMPVButton();

// Modify the interval to also clean up duplicate buttons
setInterval(() => {
    // Remove duplicate buttons first
    const mpvButtons = document.querySelectorAll('#mpv-play-button');
    if (mpvButtons.length > 1) {
        // Keep only the first button
        for (let i = 1; i < mpvButtons.length; i++) {
            mpvButtons[i].remove();
        }
    }
    
    // Add button if none exist
    if (!document.querySelector('#mpv-play-button')) {
        console.log('Periodic check: Adding MPV button');
        addMPVButton();
    }
}, 2000);

console.log('Plex MPV Launcher content script finished initial setup');
