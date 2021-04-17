import cssText from 'bundle-text:../dist/style.css'

const url = document.URL
const title = document.title
const port = chrome.runtime.connect({ name: 'bookmarker' })
let shadowRoot

const createButtonHTML = (articleInBookmarks) => {
    // The bookmark button html to inject
    const bookmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
    const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    const buttonHTML = `
        <button id="bookmark" type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 ${
            articleInBookmarks ? 'bg-white' : 'bg-green-500'
        } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
           aria-label="${articleInBookmarks ? 'remove' : 'bookmark'}">
          ${articleInBookmarks ? removeIcon : bookmarkIcon}
          ${articleInBookmarks ? 'Remove from Bookmarks' : 'Save for Later'}
        </button>
  `
    const bookmarkHTML = `
    <style>${cssText}</style>
    <div class="mt-5 flex lg:mt-0 lg:ml-4">
        <span class="hidden sm:block">
          ${buttonHTML}
        </span>
    </div>
  `
    const bookmarkDiv = document.createElement('div')
    bookmarkDiv.style.margin = '2rem'
    return { buttonHTML, bookmarkDiv, bookmarkHTML }
}

const injectBookmarksButton = (articleInBookmarks) => {
    // The bookmark button html to inject
    const { bookmarkHTML, bookmarkDiv } = createButtonHTML(articleInBookmarks)
    // The DOM element to inject our button
    const authorDiv = document.querySelector(
        '#site-main > div > article > div > section'
    )

    if (authorDiv) {
        authorDiv.insertAdjacentElement('beforeend', bookmarkDiv)
        // Create a shadow DOM to isolate our custom div from external styles and apply only our own
        shadowRoot = bookmarkDiv.attachShadow({ mode: 'open' })
        shadowRoot.innerHTML = bookmarkHTML

        return shadowRoot
    }
}

const updateBookmarksButton = (articleInBookmarks) => {
    const { buttonHTML } = createButtonHTML(articleInBookmarks)
    const updatedBookmarkDiv = document.createElement('div')
    updatedBookmarkDiv.innerHTML = buttonHTML
    shadowRoot.getElementById('bookmark').replaceWith(updatedBookmarkDiv)
}

const checkArticleInBookmarks = () => {
    const messageBody = {
        messageType: 'checkUrlInBookmarks',
        url
    }

    port.postMessage(messageBody)
}

const addListenerToButton = () => {
    shadowRoot.getElementById('bookmark').addEventListener('click', (event) => {
        const messageType = event.target.ariaLabel
        const messageBody = {
            messageType,
            url,
            title
        }
        port.postMessage(messageBody)
    })
}

const listenForMessages = () => {
    port.onMessage.addListener((response) => {
        const { messageType } = response
        switch (messageType) {
            case 'checkUrlInBookmarks':
                injectBookmarksButton(response.isBookmarkFound)
                break
            case 'bookmark':
                updateBookmarksButton(true)
                break
            case 'remove':
                updateBookmarksButton(false)
                break
            default:
                console.error('Unhandled messageType', messageType)
        }
        addListenerToButton()
    })
}

checkArticleInBookmarks()
listenForMessages()
