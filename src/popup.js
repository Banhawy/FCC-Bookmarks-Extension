let action = document.getElementById('action')

action.addEventListener('click', () => {
    chrome.bookmarks.search('freecodecamp.org/news', (btree) => {
        console.log('ok...')
        console.log('OI:', btree)
    })
})