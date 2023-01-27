import React from 'react'
import ProfileSettings from '../../components/ProfileSettings/ProfileSettings'
import { UsersProvider } from '../../context/UsersContext'

const ProfileSetting = () => {
    return (
        <UsersProvider>
            <ProfileSettings />
        </UsersProvider>
    )
}

export default ProfileSetting
