import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {
        children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
        )
      }

    <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
        <ModalOverlay />
        <ModalContent h={'350px'}>
          <ModalHeader fontSize={'25px'} display={'flex'} justifyContent={'center'} fontFamily={'work sans'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'space-between'}>
            <Image src={user.pic} alt={user.name} borderRadius={'full'} boxSize={'100px'}/>
            <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
    </Modal>

    </>
  )
}

export default ProfileModal
