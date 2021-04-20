import React from 'react'

const Card = ({ bookmark }) => {
    const handleClick = (_) => chrome.tabs.create({ url: bookmark.url })
    return (
        <div
            className="py-4 flex rounded bg-white mt-4 mb-8 mx-1 p-4"
            onClick={handleClick}
        >
            <h2 className="text-xs font-bold text-center">{bookmark.title}</h2>
        </div>
    )
}

export default Card
