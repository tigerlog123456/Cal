import { useState, useEffect, useRef } from 'react';
import { db, realtimeDb } from '../firebase-config';
import { ref, onValue, set, push } from 'firebase/database';
import SpecificUser from './specifecUser';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const ChatModule = (data) => {
    const [fetcheddata, setfetcheddata] = useState([]);
    const [messages, setmessages] = useState([]);
    const [showmessages, setshowmessages] = useState(false);
    const [showbutton, setshowbutton] = useState(true);
    const [sendnewmessage, setsendmessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [clientDetails, setClientDetails] = useState(null);
    const [newMessageReceived, setNewMessageReceived] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (data.data.userType === "agency") {
            const messagesRef = ref(realtimeDb, `messages1`);
            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();
                if (messages) {
                    const filteredChats = Object.keys(messages).filter(key => key.includes(data.data.uid)); 
                    
                    const chatDetails = filteredChats.map(chatId => {
                        const [clientId, agencyId] = chatId.split('-');
                        const chatMessages = messages[chatId] || {};
                        const messageKeys = Object.keys(chatMessages).sort((a, b) => a - b);

                        // Find the last message where clientname is defined
                        let clientName = 'Unknown';
                        for (let i = messageKeys.length - 1; i >= 0; i--) {
                            const msg = chatMessages[messageKeys[i]];
                            if (msg.clientname) {
                                clientName = msg.clientname;
                                break;
                            }
                        }
                        return { chatId, clientId, agencyId, clientName }; 
                        
                    });
                    setChatList(chatDetails);
                    const newMessages = {};
                    filteredChats.forEach(chatId => {
                        const lastMessage = messages[chatId][Object.keys(messages[chatId]).pop()];
                        if (lastMessage.receiver === data.data.uid && lastMessage.sender !== data.data.uid) {
                            newMessages[chatId] = true;
                        }
                    });
                    setNewMessageReceived(newMessages);
                    
                } else {
                    setChatList([]);
                }
            });
        } else if (fetcheddata.length === 2) {
            const messagesId = `${fetcheddata[0].uid}-${fetcheddata[1].uid}`;
            const messagesRef = ref(realtimeDb, `messages1/${messagesId}`);

            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();
                if (messages) {
                    const messagesArray = Object.entries(messages).map(([key, value]) => ({
                        id: key,
                        clientname: value.clientname,
                        agencyname: fetcheddata[1].agencyName,
                        ...value,
                    }));
                    setmessages(messagesArray);
                    if (messagesArray.length > 0 && messagesArray[messagesArray.length - 1].receiver === data.data.uid && messagesArray[messagesArray.length - 1].sender !== data.data.uid) {
                        setNewMessageReceived(prevState => ({ ...prevState, [messagesId]: true }));
                    }
                } else {
                    setmessages([]);
                }
            });
        }
    }, [fetcheddata, data.data.userType, data.data.uid]);

    useEffect(() => {
        if (selectedChat) {
            const [clientId, agencyId] = selectedChat.split('-');
            const clientRef = ref(realtimeDb, `users/${clientId}`);
            onValue(clientRef, (snapshot) => {
                const clientData = snapshot.val();
                setClientDetails(clientData);
            });

            const messagesRef = ref(realtimeDb, `messages1/${selectedChat}`);
            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();
                if (messages) {
                    const messagesArray = Object.entries(messages).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }));
                    setmessages(messagesArray);
                    if (messagesArray.length > 0 && messagesArray[messagesArray.length - 1].receiver === data.data.uid && messagesArray[messagesArray.length - 1].sender !== data.data.uid) {
                        setNewMessageReceived(prevState => ({ ...prevState, [selectedChat]: true }));
                    }
                } else {
                    setmessages([]);
                }
            });
        }
    }, [selectedChat]);

    useEffect(() => {
        if (showmessages) {
            scrollToBottom();
        }
    }, [showmessages, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const showmessagesoverlay = () => {
        setshowmessages(true);
        setshowbutton(false);
        setNewMessageReceived({});
    };
    const agencymessageoverlay = () =>{
        setshowmessages(true);
        setshowbutton(false);
    }
    const closeChat = () => {
        setshowmessages(false);
        setshowbutton(true);
    };

    const goBackToList = () => {
        setSelectedChat(null);
    };

    const sendmessage = async () => {
        if (fetcheddata[0]?.uid && fetcheddata[1]?.uid && sendnewmessage) {
            try {
                const messagesId = `${fetcheddata[0].uid}-${fetcheddata[1].uid}`;
                const messagesRef = ref(realtimeDb, `messages1/${messagesId}`);
                const newMessageRef = push(messagesRef);

                await set(newMessageRef, {
                    sender: fetcheddata[0].uid,
                    receiver: fetcheddata[1].uid,
                    message: sendnewmessage,
                    clientname: fetcheddata[0].fullName,
                    agencyname: fetcheddata[1].agencyName,
                    timestamp: new Date().toISOString(),
                });

                setsendmessage('');

            } catch (error) {
             
            }
        } else {
        
        }
    };

    const sendAgencyMessage = async () => {
        if (selectedChat && sendnewmessage) {
            try {
                const messagesRef = ref(realtimeDb, `messages1/${selectedChat}`);
                const newMessageRef = push(messagesRef);

                await set(newMessageRef, {
                    sender: data.data.uid,
                    receiver: selectedChat.split('-')[0],
                    message: sendnewmessage,
                    timestamp: new Date().toISOString(),
                });

                setsendmessage('');
            } catch (error) {
                
            }
        } else {
            
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (data.data.userType === "client") {
                sendmessage();
            } else if (data.data.userType === "agency") {
                sendAgencyMessage();
            }
        }
    };
    const formatDate = (timestamp) => {
        const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
        if (!date) return "N/A";
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleString("en-GB", options); // "en-GB" ensures DD/MM/YYYY format
    };

    const filteredChatList = chatList.filter(chat => chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className='fixed bottom-10 right-10'>

            {(data.data.userType == "client" )? (
                <>
                 {showbutton && (
                <Button className={`!rounded-lg fixed absolute !text-lg !px-5 !py-2 ${Object.values(newMessageReceived).some(received => received) && !showmessages ? '!bg-red-500' : ''}`} variant="contained" onClick={showmessagesoverlay}>
                    Chat
                </Button>
            )}
                </>
            ) : (
                <>
                {showbutton && (
               <Button className={`!rounded-lg fixed absolute !text-lg !px-5 !py-2${Object.values(newMessageReceived).some(received => received) && !showmessages ? '!bg-red-500' : ''}`} variant="contained" onClick={agencymessageoverlay}>
                   Chat
               </Button>
           )}
               </>
            )} 
            <SpecificUser data={data.data.uid} agencydata={data.data.agencyId} setfetcheddata={setfetcheddata} />
           
 {showmessages && data.data.userType === "client" && fetcheddata.length === 2 && (
    <div className="chat-box  fixed relative left-5  bg-gray-200 text-black dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 border-b dark:border-gray-600 pb-2">
            <h2 className="text-2xl font-semibold">Chat</h2>
            <Button onClick={closeChat} className="hover:bg-red-600 hover:text-white">
                <CloseIcon />
            </Button>
        </div>
        <div className="messages overflow-y-auto max-h-80 space-y-3">
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === fetcheddata[0].uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-xs rounded-lg break-word  ${message.sender === fetcheddata[0].uid ? 'text-white bg-blue-600' : 'bg-gray-300 text-black dark:text-white dark:bg-gray-700'}`}>
                        <strong>{message.sender === data.data.uid ? 'You' : message.agencyname}</strong>
                        <p className="mt-1 text-sm w-full text-wrap break-all">{message.message}</p>
                        <p className="mt-1 text-xs text-gray-400">{formatDate(message.timestamp)}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex">
            <input
                type="text"
                maxLength={50}
                className="flex-grow p-2 border-none rounded-l-xl text-black dark:bg-gray-700 dark:text-white placeholder-gray-400 focus:outline-none"
                placeholder="Type a message"
                value={sendnewmessage}
                onChange={(e) => setsendmessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button variant="contained" className="rounded-r-xl bg-blue-600 hover:bg-blue-500" onClick={sendmessage}>
                Send
            </Button>
        </div>
    </div>
)}

{/* Agency Chat List */}
{showmessages && data.data.userType === "agency" && !selectedChat && (
    <div className="chat-list bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
            <h2 className="text-2xl font-semibold">Chat List</h2>
            <Button onClick={closeChat} className="hover:bg-red-600 hover:text-white">
                <CloseIcon className="!hover:text-white" />
            </Button>
        </div>
        <input
            type="text"
            className="w-full p-2 mb-4 rounded-xl bg-gray-300 text-black dark:bg-gray-700 dark:text-white placeholder-gray-400 focus:outline-none"
            placeholder="Search for a client"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredChatList.length > 0 ? (
            filteredChatList.map(({ chatId, clientName }) => (
                <div
                    key={chatId}
                    className={`p-3 my-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 ${newMessageReceived[chatId] && chatId !== selectedChat ? 'bg-red-500' : 'text-black dark:text-white bg-gray-200 dark:bg-gray-800'}`}
                    onClick={() => {
                        setSelectedChat(chatId);
                        setNewMessageReceived(prevState => ({ ...prevState, [chatId]: false }));
                    }}
                >
                    <strong className="text-lg">{clientName}</strong>
                    {newMessageReceived[chatId] && chatId !== selectedChat && (
                        <span className="ml-2 text-sm font-extrabold text-red-900">New Message</span>
                    )}
                </div>
            ))
        ) : (
            <div className="text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No chats available</div>
        )}
    </div>
)}

{/* Agency Chat View */}
{selectedChat && data.data.userType === "agency" && (
    <div className="chat-box fixed relative left-5 dark:bg-gray-800 bg-gray-200  text-black dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg mt-6">
        <div className="flex justify-between items-center mb-4 border-b dark:bg-gray-800 bg-gray-200 dark:border-gray-600 pb-2">
            <h2 className="text-2xl font-semibold">Chat</h2>
            <Button onClick={goBackToList} className="hover:bg-red-600 hover:text-white">
                <CloseIcon className="!hover:text-white"/>
            </Button>
        </div>
        <div className="messages overflow-y-auto max-h-80 space-y-3 dark:bg-gray-800 bg-gray-200">
            {messages.map((message) => (
                <div key={message.id} className={`flex text-white ${message.sender === data.data.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-xs rounded-lg break-all ${message.sender === data.data.uid ? 'bg-blue-600' : 'text-black dark:text-white bg-gray-300 dark:bg-gray-700'}`}>
                        <strong>{message.sender === data.data.uid ? 'You' : message.clientname}</strong>
                        <p className="mt-1 text-smw-full text-wrap break-all">{message.message}</p>
                        <p className="mt-1 text-xs text-gray-400">{formatDate(message.timestamp)}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex">
            <input
                type="text"
                maxLength={50}
                className="flex-grow p-2 border-none rounded-l-xl dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none"
                placeholder="Type a message"
                value={sendnewmessage}
                onChange={(e) => setsendmessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button variant="contained" className="rounded-r-xl bg-blue-600 hover:bg-blue-500" onClick={sendAgencyMessage}>
                Send
            </Button>
        </div>
    </div>
)}
        </div>
    );
};

export default ChatModule;
