import React, { useEffect } from 'react'
import {Box, Center, Container, Text,Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  

  return (
    <Container maxW='xl' centerContent>
      <Box d='flex' justifyContent='center' p={3} bg={'white'} w='100%' m='40px 0 15px 0' borderRadius={'lg'} borderWidth={'1px'}>
        <Text fontSize={'3xl'} fontFamily={'work sans'} textAlign={'center'}>Live-Chat</Text>
      </Box>
      <Box borderRadius={'lg'} borderWidth={'1px'}  w='100%' bg={'white'}>
        <Tabs variant='soft-rounded'>
          <TabList mb={'1em'} mt={'1em'} ml={'1em'}>
            <Tab w={'50%'}>SignUp</Tab>
            <Tab w={'50%'}>LogIn</Tab>
          </TabList>
          <TabPanels>
            <TabPanel >
              <Signup/>
            </TabPanel>
            <TabPanel>
              <Login/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
