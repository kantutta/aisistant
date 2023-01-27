import { Search } from '@material-ui/icons'
import React from 'react'
import "./FindInput.css"

const FindInput = (props) => {
    return (
        <div className="find-input" >
            <Search />
            <input type="text" placeholder={"Search Friends"} onChange={props.changeFindFriend} value={props.findFriend} />  
        </div>
    )
}

export default FindInput
