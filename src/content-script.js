import cssText from 'bundle-text:../dist/style.css'

const tail = `
<style>${cssText}</style>
<div class="mt-5 flex lg:mt-0 lg:ml-4">
    <span class="hidden sm:block">
      <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <!-- Heroicon name: solid/pencil -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Bookmark
      </button>
    </span>
`
const authorDiv = document.querySelector(
    '#site-main > div > article > div > section'
)
const bookmarkDiv = document.createElement('div')
bookmarkDiv.style.margin = '2rem'
authorDiv.insertAdjacentElement('beforeend', bookmarkDiv)
const shadowRoot = bookmarkDiv.attachShadow({ mode: 'open' })
shadowRoot.innerHTML = tail