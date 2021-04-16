const { runtime, bookmarks } = chrome
runtime.onInstalled.addListener((details) => {
    bookmarks.getTree((bookmarksTree) => {
				// Find an existing 'FCC Articles' bookmarks folder
        let FCCFolder = bookmarksTree[0].children[1].children.filter(
            (child) => child.title === 'FCC Articles'
        )[0]
				// If it doesn't exist create it
        if (!FCCFolder) {
            bookmarks.create({ title: 'FCC Articles' }, (bookmark) => {
                console.log(`Created bookmark`, bookmark)
                FCCFolder = bookmark
            })
        }
        // Look for any previously bookmarked FCC articles and copy them to the FCC Articles Folder
        bookmarks.search('https://freecodecamp.org', (bookmarksTree) => {
            if (bookmarksTree.length > 0) {
                bookmarks.get(FCCFolder.id, (folder) => {
                    bookmarksTree.forEach((fccArticle) => {
                        bookmarks.create({
                            parentId: FCCFolder.id,
                            title: fccArticle.title,
                            url: fccArticle.url
                        })
                    })
                })
            }
        })
    })
})
