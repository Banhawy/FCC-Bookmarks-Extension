console.log('hi')
const savedBookmarks = [ 'boobs' ]
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ savedBookmarks });
    console.log('Default background color set to %cgreen', `color: ${savedBookmarks}`);
});