import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate  } from "react-router-dom"
import axios from 'axios'

const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState(); 
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const navigate = useNavigate();

    const handleClick=()=>{
        setShow(!show)
    }
    const submitHandler=async()=>{
      console.log("object")
      setLoading(true)
      if( !email || !password ){
        toast({
          title: 'Please fill all fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        setLoading(false)
        return
      }
      
      try {
        const config={
          headers:{
            "Content-Type":"application/json"
          },
        };
        const {data} = await axios.post('http://localhost:2000/api/user/login',{email,password},config)
        toast({
          title: 'Login Succesfull',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        localStorage.setItem('userInfo',JSON.stringify(data))
        setLoading(false)
        navigate('/chat')
      } catch (error) {
        toast({
          title: 'Error Occured',
          description:error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        setLoading(false)
      }
    }

  return (
    <VStack spacing={'5px'} centerContent>


      <FormControl isRequired>
        <FormLabel id='email'>Email: </FormLabel>
        <Input type='email' placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password: </FormLabel>
        <InputGroup size={'md'}>
            <Input type={show?'text':'password'} placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <InputRightElement w={'4.5rem'}>
                <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                    {show ? 'hide' : 'show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme='blue' marginTop={'15'} isLoading={loading} width={'100%'} onClick={submitHandler}>Login</Button>
      <Button colorScheme='red' variant={'solid'} marginTop={'15'} width={'100%'} onClick={()=>{ setEmail('guest@gmailcom');setPassword('123456')}}>Guest User Cred</Button>
      </VStack>
  )
}

export default Login
