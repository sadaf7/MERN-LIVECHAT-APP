import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState();

    const toast = useToast()

    const {user,chats,setChats} =ChatState()

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

    const handleGroup=(userToAdd)=>{
        if(selectedUser.includes(userToAdd)){
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
              return
        }
        setSelectedUser([...selectedUser,userToAdd])

    }
    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUser){
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              })
        }

        try {
            const config = {
                headers:{
                    "Authorization" : `Bearer ${user.token}`
                },
            };

            const { data } = await axios.post('http://localhost:2000/api/chat/group',{name:groupChatName,
            users: JSON.stringify(selectedUser.map((u)=>u._id))
            },config)
            setChats([data,...chats])
            onClose()
            toast({
                title: 'Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            })
        } catch (error) {
            toast({
                title: 'Failed to create Group Chat',
                description: error.response.data,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            })
        }
    }
    const handleDelete=(delUser)=>{
        setSelectedUser(selectedUser?.filter((sel)=>sel._id !== delUser._id))
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} fontSize={'28px'} justifyContent={'center'} fontFamily={'work sans'}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <FormControl>
                <Input placeholder='Enter Group Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>

            <FormControl>
                <Input placeholder='Search User' mb={3} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
            {selectedUser?.map((u)=>{
                return(
                    <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                )
            })}
            </Box>
            {loading ? (<div>loading..</div>):(
                searchResult?.slice(0,4).map((user)=>{
                    return(
                        <UserListItem key={user._id} user={user} handleFunction={()=>{handleGroup(user)}}/>
                    )
                })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
