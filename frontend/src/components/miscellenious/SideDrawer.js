import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { BellIcon,ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user} = ChatState()
    const { setSelectedChat, chats, setChats } = ChatState()

    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        navigate('/')
    }

    const handleSearch=async()=>{
        if(!search){
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
              })
              return  
        }
        try {
            setLoading(true)

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                },
            }
            const {data} = await axios.get(`http://localhost:2000/api/user?search=${search}`,config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Failed to search users',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
              })
        }
    }

    const accesChat=async(userId)=>{
      try {
        setLoadingChat(true)

      const config ={
        headers:{
          "Content-Type":'application/json',
          Authorization:`Bearer ${user.token}`
        },
      }

      const { data } = await axios.post('http://localhost:2000/api/chat',{userId},config);

      if(!chats.find((c)=> c._id === data._id)){
        setChats([data, ...chats])
      }
      
      console.log(data)
      setSelectedChat(data)
      setLoadingChat(false)
      onClose();
      } catch (error) {
        toast({
          title: 'Error fetching the chat',
          description: error.message,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-left',
        })
      }
  }

  return (
<>
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} bg={'white'} w={'100%'} borderWidth={'5px'} p={'5px 10px '}>
        <Tooltip label='Search User' hasArrow placement='bottom-end'>
            <Button variant={'ghost'} onClick={onOpen}>
                <FaSearch/>
                <Text display={{base: 'none', md:"flex"}} px='4'>
                    Search User
                </Text>
            </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={'work sans'}>
            LIVECHAT-APP
        </Text>
        <Menu>
            <MenuButton>
                <BellIcon fontSize='2xl' m={1}/>
                {/* <MenuList></MenuList> */}
            </MenuButton>
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button mt={1} onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user)=>{
                return (
                    <UserListItem key={user._id} user={user} handleFunction={()=>accesChat(user._id)}/>
                )
              })
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    
</>

  )
}

export default SideDrawer
