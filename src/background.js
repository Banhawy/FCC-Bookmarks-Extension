const { runtime, bookmarks } = chrome
let getFCCFolder = () =>
    new Promise((resolve, _reject) => {
        bookmarks.getTree((bookmarksTree) => {
            resolve(
                bookmarksTree[0].children[1].children.filter(
                    (child) => child.title === 'FCC Articles'
                )[0]
            )
        })
    })

runtime.onInstalled.addListener((_details) => {
    bookmarks.getTree(async (bookmarksTree) => {
        console.log(bookmarksTree)
        // Find an existing 'FCC Articles' bookmarks folder
        FCCFolder = await getFCCFolder()
        console.log({ FCCFolder })
        // If it doesn't exist create it
        if (!FCCFolder) {
            bookmarks.create({ title: 'FCC Articles' }, (bookmark) => {
                console.log(`Created bookmark`, bookmark)
                FCCFolder = bookmark
            })

            // Look for any previously bookmarked FCC articles and copy them to the FCC Articles Folder
            bookmarks.search(
                'https://freecodecamp.org/news/',
                (searchedBookmarksTree) => {
                    if (searchedBookmarksTree.length > 0) {
                        // Create an array of just bookmarked url strings
                        let FCCBookmarks = searchedBookmarksTree.map(
                            (bookmark) => bookmark.url
                        )
                        // Check if the root news route is present in the bookmarks & remove it
                        const rootNewsSiteIndex = FCCBookmarks.indexOf(
                            'https://www.freecodecamp.org/news/'
                        )
                        const rootNewsSiteIsPresent = rootNewsSiteIndex > -1
                        if (rootNewsSiteIsPresent) {
                            searchedBookmarksTree.splice(rootNewsSiteIndex, 1)
                        }
                        // Map through each bookemarked FCC Article and copy it to our extension's bookmarks folder
                        searchedBookmarksTree.forEach((fccArticle) => {
                            bookmarks.create({
                                parentId: FCCFolder.id,
                                title: fccArticle.title,
                                url: fccArticle.url
                            })
                        })
                    }
                }
            )
        }
    })
})

runtime.onConnect.addListener((port) => {
    console.assert(port.name == 'bookmarker')

    port.onMessage.addListener(async (request) => {
        let FCCFolder = await getFCCFolder()
        const { messageType } = request

        if (messageType === 'checkUrlInBookmarks') {
            let isBookmarkFound = false
            console.log({ FCCFolder })
            bookmarks.getChildren(FCCFolder.id, (FCCBookmarksTree) => {
                console.log({ FCCBookmarksTree })
                FCCBookmarksTree.forEach((bookmark) => {
                    if (bookmark.url === request.url) {
                        isBookmarkFound = true
                    }
                })
                console.log('Sending response: ', isBookmarkFound)
                port.postMessage({ isBookmarkFound, messageType })
            })
        }

        if (messageType === 'bookmark') {
            // add to bookmarks
            console.log(FCCFolder)
            bookmarks.get(FCCFolder.id, (FCCBookmarksTree) => {
                const createDetails = {
                    parentId: FCCFolder.id,
                    url: request.url,
                    title: request.title
                }
                bookmarks.create(createDetails, (createdBookmark) => {
                    console.log(createdBookmark)
                    port.postMessage({ successful: true, messageType })
                })
            })
        }

        if (messageType === 'remove') {
            // remove from bookmarks
            bookmarks.getChildren(FCCFolder.id, (FCCBookmarksTree) => {
                const bookmarkToDelete = FCCBookmarksTree.filter(
                    (bookmark) => bookmark.url === request.url
                )
                if (bookmarkToDelete.length > 0) {
                    bookmarks.remove(bookmarkToDelete[0].id, () => {
                        port.postMessage({ successful: true, messageType })
                    })
                }
            })
        }

        if (messageType === 'getAllArticles') {
            bookmarks.getChildren(FCCFolder.id, (FCCBookmarksTree) =>
                port.postMessage({
                    successful: true,
                    data: FCCBookmarksTree,
                    messageType
                })
            )
        }
    })
})
