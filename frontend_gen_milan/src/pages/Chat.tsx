import React, { useEffect, useRef, useState } from 'react';

import Pusher from "pusher-js";
import baseClient from '@/services/apiClient';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {

  const messagesEnd = useRef(null);

  const [scrollnow, setScrollNow] = useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);

  let allMessages = [];


  useEffect(() => {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, scrollnow])


   function loadMessages() {
    baseClient.get(`chat/${chat_id}/messages`)
      .then((response) => {
        setLoading(false);
        if (response?.data?.success) {
          allMessages = response.data?.chat_room?.messages;
          setMessages(allMessages);
        } else {
          toast.error(response?.data?.message);
        }
      });
  }

  const { chat_id } = useParams();

  const current_user = JSON.parse(localStorage.getItem("user"));
  const [refresh_component, setRefreshComponent] = useState(false);

  useEffect(() => {

    loadMessages();

  }, [chat_id, refresh_component])

  const handleSendMessage = () => {
    if (message == "") {
      return;
    }
    setProcessing(true);
    const data = {
      message: message,
      chat_id: chat_id
    };

    allMessages = messages;
    allMessages.push(
      { id: 6667, message: message, user_id: current_user?.id, chat_id: chat_id, file_name: null, user: current_user }
    );
    setMessages(allMessages);
    setScrollNow(!scrollnow);

    baseClient.post('chat/message', data).then((response) => {
      setProcessing(false);
    });

    setMessage('');
  }


  useEffect(() => {
    const pusher = new Pusher('cba34a03b87076b69b01', {
      cluster: 'ap2',
    });
    const channel = pusher.subscribe('chats-development');
    channel.bind('chat', (data: any) => {

      if (current_user?.id != data?.message?.user?.id) {
        loadMessages();
      }
    });

    return () => {
      pusher.unsubscribe('chat_app');
    };
  }, []);

  return (
    <div className="flex h-[90vh] antialiased md:pl-[84px] sm:pl-0 text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl border border-gray-500  bg-black bg-opacity-25 h-full p-2">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className=" grid-cols-12 gap-y-2 ">


                  {messages.map((msg, index) => (

                    <div
                      key={index}
                      className={`block col-start-${msg?.user_id === current_user?.id ? '8' : '1'} col-end-${msg?.user_id === current_user?.id ? '13' : '8'} p-3 rounded-lg`}
                    >
                      <div className={`flex ${msg?.user_id === current_user?.id ? 'items-center justify-start flex-row-reverse' : 'items-center'}`}>
                        <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-indigo-500 flex-shrink-0">
                          {msg?.user?.name[0].toUpperCase()}
                        </div>
                        <div className={`relative ${msg?.user_id === current_user?.id ? 'mr-3' : 'ml-3'} text-sm bg-${msg?.user_id === current_user?.id ? 'indigo-100 bg-indigo-500 text-white' : ' bg-muted/50 text-white'} py-2 px-4 shadow rounded-xl`}>
                          <div>{msg.message}</div>
                        </div>
                      </div>
                    </div>



                  ))}

                  <div style={{ float: "left", clear: "both" }}
                    ref={messagesEnd}>
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-muted/50 w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex w-full border rounded-xl  bg-muted/50 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    placeholder="Type your message here..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleSendMessage}
                  disabled={processing}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
