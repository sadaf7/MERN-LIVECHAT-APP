import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const {user, selectedChat, setSelectedChat} = ChatState();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState();
    const [renameLoading, setRenameLoading] = useState();

    const handleRename = async()=>{
        if(!groupChatName){
            return
        }
        try {
          setRenameLoading(true)
          const config = {
            headers:{
                "Authorization" : `Bearer ${user.token}`
            },
          };
          const { data } = await axios.put('http://localhost:2000/api/chat/rename',{
            chatId : selectedChat._id,
            chatName : groupChatName
          },config)
          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured',
                // description: error.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
              })
        }
        setGroupChatName("")
    }

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }

        try {
            setLoading(true)

            const config = {
                headers:{
                    "Authorization" : `Bearer ${user.token}`
                },
            };
            const { data } = await axios.get(`http://localhost:2000/api/user?search=${search}`,config)
            console.log(data);
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: 'Failed to load search users',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
        }
    }

    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find((u)=>u._id === user1._id)){
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only Admin can add member !!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              return;
        }
        try {
            setLoading(true)
            const config = {
                headers:{
                    "Authorization" : `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put('http://localhost:2000/api/chat/groupadd',{
                chatId: selectedChat._id,
                userId: user1._id
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              setLoading(false)
        }
    }
    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title: 'Only Admin can add member !!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              return;
        }

        try {
            setLoading(true)
            const config = {
                headers:{
                    "Authorization" : `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put('http://localhost:2000/api/chat/groupremove',{
                chatId: selectedChat._id,
                userId: user1._id
            },config)
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              setLoading(false)
        }
    }

  return (
    <>
        <IconButton icon={<ViewIcon/>} display={{base: 'flex'}} onClick={onOpen}/>
        {/* <span onClick={onOpen} display={{base: 'flex'}}>open</span> */}

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader display={'flex'} justifyContent={'center'} fontSize={'30px'} fontFamily={'work sans'}>{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
                    {selectedChat.users.map((u)=>{
                        return(
                            <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>
                        )
                    })}
                </Box>
                <FormControl display={'flex'} mt={2}>
                    <Input placeholder='Rename GroupName' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
                    <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                </FormControl>
                <FormControl display={'flex'} mt={2}>
                    <Input placeholder='Add Members' mb={3} onChange={(e)=>handleSearch(e.target.value)}/>
                </FormControl>
                {loading?(
                    <Spinner size={'lg'} m={'auto'}/>
                ):(
                    searchResult?.map((user)=>{
                        return(
                            <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                        )
                    })
                )}
            </ModalBody>

            <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemove()}>
                Leave Group
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}

export default UpdateGroupModal
