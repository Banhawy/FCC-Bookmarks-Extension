const { runtime, bookmarks } = chrome
runtime.onInstalled.addListener((details) => {
    bookmarks.getTree((bookmarksTree) => {
        console.log(bookmarksTree)
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
				bookmarks.search('https://freecodecamp.org/news/', (searchedBookmarksTree) => {
					if (searchedBookmarksTree.length > 0) {
						// Create an array of just bookmarked url strings
						let FCCBookmarks = searchedBookmarksTree.map(bookmark => bookmark.url)
						// Check if the root news route is present in the bookmarks & remove it
						const rootNewsSiteIndex = FCCBookmarks.indexOf('https://www.freecodecamp.org/news/')
						const rootNewsSiteIsPresent = rootNewsSiteIndex > -1
						if (rootNewsSiteIsPresent) {
							searchedBookmarksTree.splice(rootNewsSiteIndex ,1)
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
				})
    })
})