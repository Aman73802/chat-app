import React, { useRef, useState } from 'react'
import { BsSend } from "react-icons/bs";
import { MdImage } from "react-icons/md";
import useConversation from '../../zustand/useConversation';
import {useAuth} from '../../context/AuthContext'

const MessageInput = () => {
  const {messages,setMessages,selectedConversation} = useConversation();
  const [input,setInput] = useState("");
  const [image, setImage] = useState(null);
  const {authUser} = useAuth();
  const token = authUser?.token;
  const inputRef = useRef();
  const fileInputRef = useRef();

  const sendMessage = async (e)=>{
    e.preventDefault();
    if(!input.trim() && !image){
      inputRef.current.focus();
      return;
    }
    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await fetch(`http://localhost:8000/api/message/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization':`Bearer ${token}`
          },
          body: formData
        });
        const data = await res.json();
        if (data.imageUrl) {
          imageUrl = data.imageUrl;
          console.log(imageUrl);
          
        }
      }
      // Send message (with imageUrl if present)
      const res = await fetch(`http://localhost:8000/api/message/send/${selectedConversation._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({message: input, image: imageUrl}),
      });
      const data = await res.json();
      setMessages([...messages,data]);
      setInput("");
      setImage(null);
    } catch (error) {
      console.log('Error at Message Input: ',error)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form className='px-4 my-3' onSubmit={sendMessage} encType="multipart/form-data">
      <div className='w-full flex gap-4 items-center'>
        <input ref={inputRef} type="text" value={input} onChange={(e)=>setInput(e.target.value)} name="" id="" className='flex-1 px-4 py-2 rounded' placeholder='Message' />
        <input type="file" accept="image/*" style={{display:'none'}} ref={fileInputRef} onChange={handleImageChange} />
        <button type="button" className='flex items-center justify-center bg-gray-700 hover:bg-gray-500 rounded-full h-12 w-12' onClick={()=>fileInputRef.current.click()} title="Attach Image">
          <MdImage size={24}/>
        </button>
        <button className='flex items-center justify-center hover:bg-green-400 bg-green-500 text-white rounded-full h-12 w-12'><BsSend size={24}/></button>
      </div>
      {image && <div className='text-xs text-gray-600 mt-1'>Image selected: {image.name}</div>}
    </form>
  )
}

export default MessageInput