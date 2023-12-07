import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate  } from "react-router-dom"

const Signup = () => {

const [show, setShow] = useState(false);
const [name, setName] = useState();
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [confirmPassword, setConfirmPassword] = useState();
const [pic, setPic] = useState();
const [loading, setLoading] = useState(false);
const toast = useToast()
const navigate = useNavigate();

const handleClick=()=>{
    setShow(!show)
}


// 'https://api.cloudinary.com/v1_1/dmumjlve0/image/upload'



const postDetails=async(pics)=>{
  setLoading(true)

  if(pics === undefined){
    toast({
      title: 'Please Select an image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: 'bottom'
    })
    return
  }
  if(pics.type==='image/jpeg' || pics.type==='image/png'){
    const data = new FormData();
    data.append('file', pics);
    data.append('upload_preset','live-chat-app')
    data.append('cloud_name','dmumjlve0')
    fetch('https://api.cloudinary.com/v1_1/dmumjlve0/image/upload',{
      method:'POST',
      body: data
    }).then((res)=>res.json())
      .then((data)=>{
        setPic(data.url.toString())
        setLoading(false)
      })
      .catch((err)=>{
        console.log("error", err)
        setLoading(false)
      })
  } else{
    toast({
      title: 'Please Select an image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: 'bottom'
    })
    setLoading(false)
    return
  }
}

const submitHandler=async()=>{
  setLoading(true)
  if(!name || !email || !password || !confirmPassword){
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
  if (password !== confirmPassword) {
    toast({
      title: 'Password doesn"t matched',
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
    const {data} = await axios.post('http://localhost:2000/api/user/',{name,email,password,pic},config)
    toast({
      title: 'Registration Succesfull',
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
      title: 'Please Select an image',
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
    <VStack spacing={'5px'}>

      <FormControl id='first_name' isRequired>
        <FormLabel>Name: </FormLabel>
        <Input placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)}/>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email: </FormLabel>
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

      <FormControl id='password' isRequired>
        <FormLabel>Confirm Password: </FormLabel>
        <InputGroup size={'md'}>
            <Input type={show?'text':'password'} placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            <InputRightElement w={'4.5rem'}>
                <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                    {show ? 'hide' : 'show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload Picture: </FormLabel>
        <Input type='file' placeholder='Upload Picture' accept='image/*' p={1.5} onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>

      <Button colorScheme='blue' value={pic} isLoading={loading} marginTop={'15'} width={'100%'} onClick={submitHandler}>SignUp</Button>
    </VStack>
  )
}

export default Signup
