import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellenious/SideDrawer'
import MyChat from '../components/MyChat'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {

  const { user }  = ChatState()

  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent={'space-between'} w={'100%'} h={'92vh'} p={'10px'}>
        {user && <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
