import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/chatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messagess }) => {

  const { user } = ChatState();


  return (
    <ScrollableFeed>
        {
            messagess && messagess.map((m,i)=>{
                return(
                    <div style={{display:'flex'}} key={i}>
                {(isSameSender(messagess,m,i,user._id)
                  || isLastMessage(messagess,i,user._id)) &&(
                  
                    <Tooltip placement='bottom-start' lebel={m.sender.name} hasArrow>
                        <Avatar src={m.sender.pic} name={m.sender.name} mt={'7px'} mr={1} size={'sm'} cursor={'pointer'}/>
                        
                    </Tooltip>
                )}
                <span style={{backgroundColor: `${m.sender._id !== user._id ? "#BEE358" : "#B9F5D0"}`, borderRadius:'20px', padding:'5px 15px', maxWidth:'75%',
                marginLeft: isSameSenderMargin(messagess, m, i, user._id),
                marginTop: isSameUser(messagess, m, i, user._id) ? 3 : 10,}}>
                    {m.content}
                </span>
                    {/* {m.content}   */}
                
            </div>
                )
            })
        }
    </ScrollableFeed>
  )
}

export default ScrollableChat
