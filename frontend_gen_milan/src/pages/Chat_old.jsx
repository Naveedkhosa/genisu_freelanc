import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'peerjs';

const Chat = () => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { chat_room } = useParams();
  const [peerID, setPeerID] = useState('');
  const [chatlist, setChatlist] = useState([]);
  const [message, setMessage] = useState('');
  const [conn, setConn] = useState(null);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const RandomInt = (min, max) => {
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }

    const NamePrefix = RandomInt(100000000, 999999999);
    const newPeer = new Peer(NamePrefix + '-name',
      // {
      //   host: 'your-peerjs-server-host',
      //   port: 5173,
      //   path: '/myapp'
      // }
    );

    setPeer(newPeer);

    newPeer.on('open', (id) => {
      setPeerID(id);
      console.log("My peer ID is: " + id);
    });

    newPeer.on('connection', (connection) => {
      setConn(connection);
      connection.on('open', () => {
        console.log('Connection established');
      });

      connection.on('data', (data) => {
        setChatlist(prevChatlist => [...prevChatlist, <div key={Date.now()} className="left">{data}</div>]);
      });

      connection.on('error', (err) => {
        console.error('Connection error:', err);
      });
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
    });

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    }
  }, []);


  useEffect(()=>{
    if(current_user?.role=="Driver"){
      
    }
  },[])

  const connect = () => {
    if (peer) {
      const newConn = peer.connect(chat_room);
      newConn.on('open', () => {
        setConn(newConn);
        console.log('Connection established');
      });

      newConn.on('data', (data) => {
        setChatlist(prevChatlist => [...prevChatlist, <div key={Date.now()} className="left">{data}</div>]);
      });

      newConn.on('error', (err) => {
        console.error('Connection error:', err);
      });
    }
  }

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send(message);
      setChatlist(prevChatlist => [...prevChatlist, <div key={Date.now()} className="right">{message}</div>]);
      setMessage('');
    }
  }

  return (
    <div className="container">
      {/* Chat Container */}
      <div className="mt-4 w-full max-w-md border shadow-lg bg-white flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <div className="font-semibold">Chat</div>
          <div className="text-sm text-white bg-green-500 border-2 border-white px-4 py-2 rounded-xl">Online</div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatlist}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-gray-300 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>

        {/* Connect Button */}
        <div className="p-3 border-t border-gray-300 flex justify-center">
          <button
            onClick={connect}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
