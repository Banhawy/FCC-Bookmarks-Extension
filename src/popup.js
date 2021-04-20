import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Card from './components/Card'

let port = chrome.runtime.connect({ name: 'bookmarker' })
let bookmarksArray = []

const getAllArticles = () => {
    const messageBody = {
        messageType: 'getAllArticles'
    }

    port.postMessage(messageBody)

    console.log('sent!', messageBody)
}

const reconnect = () => {
    port = chrome.runtime.connect({ name: 'bookmarker' })
    listenForMessages()
}

const listenForMessages = () => {
    const responseHandler = (response) => {
        const { messageType } = response
        switch (messageType) {
            case 'checkUrlInBookmarks':
                console.log('checkUrlInBookmarks')
                break
            case 'bookmark':
                console.log('bookmark')
                break
            case 'remove':
                console.log('remove')
            case 'getAllArticles':
                bookmarksArray = [...response.data]
                break
            default:
                console.error('Unhandled messageType', messageType)
        }
    }
    port.onMessage.addListener(responseHandler)

    port.onDisconnect.addListener((port) => {
        reconnect()
    })
}

listenForMessages()
getAllArticles()

const PopUp = () => {
    const [bookmarks, setBookmarks] = useState(bookmarksArray)

    useEffect(() => {
        console.log('bookmarksArr updated', bookmarksArray)
        const responseHandler = (response) => {
            if (response.messageType === 'getAllArticles') {
                setBookmarks(response.data)
            }
        }
        port.onMessage.addListener(responseHandler)
    })
    if (bookmarksArray.length === 0) {
        return <div>NO BOOKMARKS!</div>
    }
    return (
        <div className="">
            {bookmarks.map((bookmarkObject) => (
                <Card key={bookmarkObject.id} bookmark={bookmarkObject} />
            ))}
        </div>
    )
}

ReactDOM.render(<PopUp />, document.getElementById('root'))
