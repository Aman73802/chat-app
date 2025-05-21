import React from 'react'
import {useAuth} from '../../context/AuthContext'

const Message = ({message,selectedConversation}) => {
  const {authUser} = useAuth();
  const isSender = authUser._id === message.senderId ? true : false;
  function extractTime(isoString){
    const date = new Date(isoString);
    const hours = date.getHours() 
    const minutes =  date.getMinutes()
     return {hours,minutes};
  }
  const {hours,minutes} = extractTime(message.createdAt);
  // Check if message has image or audio
  const hasImage = message.image;
  const hasAudio = message.audio;
  return (
    <div className={`chat ${isSender ? 'chat-end' : 'chat-start'} p-4`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={`${isSender ? authUser.profilePic : selectedConversation?.profilePic }`} />
        </div>
      </div>
      <div className={`chat-bubble max-w-36 ${isSender && 'bg-blue-500 text-white'}`}>
        {hasImage && (
          <img src={`http://localhost:8000${message.image}`} alt="sent" className="mb-2 max-w-[120px] rounded" />
        )}
        {hasAudio && (
          <audio src={`http://localhost:8000${message.audio}`} controls className="mb-2 w-full" style={{width:'120px'}} />
        )}
        {message.message}
      </div>
      {hours}:{minutes}
    </div>
  )
}

export default Message