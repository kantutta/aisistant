import React, {useState} from 'react'
import "./SettingsChat.css"

const SettingsChat = (props) => {

    const [changeTheme, setChangeTheme] = useState(false)
    const [changeName, setChangeName] = useState(false)
    const [deleteChat, setDeleteChat] = useState(false)

    /* Color Themes */
    const colorsTheme = [
        {id:1, c:"#625AC0"},
        {id:2, c:"#817AD4"},
        {id:3, c:"#A29CEA"},
        {id:4, c:"#C3C0ED"},
        {id:5, c:"#277ECF"},
        {id:6, c:"#2390F5"},
        {id:7, c:"#62AEF4"},
        {id:8, c:"#96CCFE"},
        {id:9, c:"#28ACB5"},
        {id:10, c:"#67BEC3"},
        {id:11, c:"#78CFD4"},
        {id:12, c:"#AEE0E3"},
        {id:13, c:"#13BC7F"},
        {id:14, c:"#3BC895"},
        {id:15, c:"#60DCAF"},
        {id:16, c:"#89EEC9"},
        {id:17, c:"#B53A6D"},
        {id:18, c:"#D13174"},
        {id:19, c:"#D86595"},
        {id:20, c:"#E490B3"},
        {id:21, c:"#D03030"},
        {id:22, c:"#E84F4F"},
        {id:23, c:"#DD6F6F"},
        {id:24, c:"#EE9E9E"}, 
    ]



    return (
        <> 
          {!changeTheme && !changeName && !deleteChat &&
            <div id="settings-chat" >
                <div className="settings-chat-container" >
                    <div className="chat-name-s" onClick={(() => setChangeName(true))} >
                        <span class="material-icons">create</span>
                        <h4>Nick Name</h4>
                    </div>
                    <div className="chat-theme-s" onClick={() => setChangeTheme(true)} >
                        <span className="theme-color" style={{background: props.chatOptions.chatTheme || "#625AC0"}} ></span>
                        <h4>Chat Theme</h4>
                    </div>
                    <div className="delete-s" onClick={(() => {setDeleteChat(true)})} >
                        <span class="material-icons">delete</span>
                        <h4>Delete Chat</h4>
                    </div>
                </div>
            </div> }

            {changeTheme && <>
              <div className="change-theme changing" >
                 <div className="change-theme-intro changing-intro" >
                     <h4>Change Theme</h4>
                     <div onClick={(() => setChangeTheme(false))} >
                         <span class="material-icons">close</span>
                     </div>
                 </div>
                 <div className="color-theme chat-content-change" >
                    <div className="color-theme-box" >
                      {colorsTheme.map((c) => (
                          <div onClick={(() => props.handleClickChangeTheme(c.c))}  key={c.id} className={c.c === props.chatOptions.chatTheme ? "active col-theme" : "col-theme"} >
                              <div style={{background: c.c}} ></div>
                          </div>
                      ))}
                    </div>
                 </div>
              </div>
            </>}
            {changeName && <>
                <div className="change-name changing" >
                 <div className="change-name-intro changing-intro" >
                     <h4>Change Name</h4>
                     <div onClick={(() => setChangeName(false))} >
                         <span class="material-icons">close</span>
                     </div>
                 </div>
                 <div className="chat-name chat-content-change" >
                    <div className="chat-name-box" >
                        <input onChange={((e) => props.handleChangeInputNewName(e) )} value={props.newName} />
                        <button style={{background: props.chatOptions.chatTheme}} onClick={(() => props.handleClickChatName(props.newName))} >Save</button>
                    </div>
                 </div>
              </div>
            </>}
            {
                deleteChat && <>
                    <div className="delete-opacity-all chat-content-change" >
                        <div className="delete-box" >
                            <h4>Are you sure you want to delete the chat</h4>
                            <div>
                                <button  className="delete-btn btn" onClick={props.handleClickDeleteChat}  >Delete</button>
                                <button className="close-btn btn" onClick={(() => {setDeleteChat(false)})} >Close</button>
                            </div>
                        </div>
                    </div>
                </>
            }

        </>
    )
}

export default SettingsChat
