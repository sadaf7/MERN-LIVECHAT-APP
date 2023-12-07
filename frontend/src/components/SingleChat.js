import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Box, FormControl, IconButton, Input, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull, isLastMessage, isSameSender } from '../config/chatLogics';
import ProfileModal from './miscellenious/ProfileModal';
import UpdateGroupModal from './miscellenious/UpdateGroupModal';
import axios from 'axios';
import './style.css'
import ScrollableChat from './ScrollableChat';
import ScrollableFeed from 'react-scrollable-feed'

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const [messagess, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, selectedChat, setSelectedChat} = ChatState();

    const fetchMessages = async ()=>{
        if(!selectedChat) return

        try {
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true)

            const { data } = await axios.get(`http://localhost:2000/api/message/${selectedChat._id}`,config)
            console.log(data.message)
            setMessages(data.message)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: "Failed to load messages",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
              })
        }
    }

    const sendMessage = async(event)=>{
        if(event.key === "Enter" && newMessages){
           
            try {
                const config = {
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };
                setNewMessages('')
                const { data } = await axios.post('http://localhost:2000/api/message/',{
                    content: newMessages,
                    chatId : selectedChat._id ,
                },config)
                console.log([data])
                setMessages([...messagess,data.message])
                // setMessages([...messages,data])
            } catch (error) {
                toast({
                    title: 'Error occured',
                    description: "Failed to send message",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-left',
                  })
            }
    }
}

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const handleTyping = async(e)=>{
        setNewMessages(e.target.value)
    }

  return (
    <>
        {selectedChat?(
          <>
            <Text display={'flex'} alignItems={'center'} justifyContent={{base: 'space-between'}} w='100%' pb={3} fontFamily={'work sans'} px={2} fontSize={{base: '28px', md: '30px'}}>
                <IconButton icon={<ArrowBackIcon/>} display={{base: 'flex',md: 'none'}} onClick={()=>setSelectedChat('')}/>
              
            {!selectedChat.isGroupChat?(
                <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                </>
            )}
            </Text>
            <Box display={'flex'} flexDir={'column'} justifyContent={'flex-end'} p={3} width={'100%'} height={'100%'} borderRadius={'lg'} overflowY={'hidden'} bg={'#E8E8E8'}>
                {loading ? (
                    <Spinner m={'auto'} alignSelf={'center'} width={20} h={20} size={'lg'}/>
                ):(
                    <>
                      <div className='messages'>
                      
                    <ScrollableChat messagess={messagess}/>
                    
                      </div>
                    </>
                )}
                <FormControl isRequired onKeyDown={sendMessage} mt={1}>
                    <Input variant={'filled'} bg={'E0E0E0'} onChange={handleTyping} value={newMessages} placeholder='Send Message'/>
                </FormControl>
            </Box>
          </>
        ):(
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
                <Text fontSize={'2xl'} fontFamily={'work sans'} pb={3}>
                    Click Users to chat
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat
