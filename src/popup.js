import React from 'react'
import ReactDOM from 'react-dom'
import Card from './components/Card'


const PopUp = () => {
    return (
        <div className="">
            <Card />
        </div>
    )
}

ReactDOM.render(
  <PopUp />,
  document.getElementById('root'),
)