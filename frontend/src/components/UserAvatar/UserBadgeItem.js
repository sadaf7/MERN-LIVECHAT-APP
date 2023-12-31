import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box px={2} py={1} m={1} mb={2} borderRadius={'lg'} varient='solid' fontSize={12} cursor={'pointer'} bg='purple' onClick={handleFunction} color={'white'}>
        {user.name}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem
