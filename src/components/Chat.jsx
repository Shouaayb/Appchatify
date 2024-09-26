import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
};

const ChatRoom = ({ token }) => {
  const currentUserId = '12345';
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  const [currentMessage, setCurrentMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(localStorage.getItem('conversationId') || '');
  const [chatConversations, setChatConversations] = useState(JSON.parse(localStorage.getItem('conversations')) || []);
  const [mockMessages, setMockMessages] = useState([
    {
      text: "Hej Shouaayb, hur står det till?",
      avatar: "https://i.pravatar.cc/100",
      username: "Alex",
      conversationId: null
    },
    {
      text: "Kom igen, svara snart!",
      avatar: "https://i.pravatar.cc/100",
      username: "Alex",
      conversationId: null
    },
    {
      text: "Tjena Alex, allt är bra här! Är jag godkänd?",
      avatar: "https://i.pravatar.cc/101",
      username: "Du",
      conversationId: null
    }
  ]);

  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${selectedConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const data = await response.json();
        setMessages(data);
        localStorage.setItem('messages', JSON.stringify(data));

        const conversationExists = chatConversations.some((convo) => convo.id === selectedConversation);
        if (!conversationExists) {
          const newConversation = {
            id: selectedConversation,
            name: 'Ny Konversation',
          };
          const updatedConversations = [...chatConversations, newConversation];
          setChatConversations(updatedConversations);
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        }
      } catch (error) {
        setErrorMsg('Kunde inte hämta meddelanden');
      }
    };

    loadMessages();
  }, [selectedConversation, token, chatConversations]);

  const sendNewMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: escapeHtml(currentMessage),
          conversationId: selectedConversation,
        }),
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte skickas');

      const { latestMessage } = await response.json();
      const newMessage = {
        ...latestMessage,
        userId: currentUserId, 
        username: 'Du', 
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      handleAutoReply(currentMessage);
      setCurrentMessage('');
    } catch (error) {
      setErrorMsg('Meddelandet kunde inte skickas');
    }
  };

  const handleAutoReply = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    let autoReply = '';

    if (lowerCaseMessage.includes('fint väder')) {
      autoReply = 'Eller hur!';
    } else if (lowerCaseMessage.includes('hej')) {
      autoReply = 'Hej där!';
    }

    if (autoReply) {
      const replyMessage = {
        text: autoReply,
        avatar: "https://i.pravatar.cc/100",
        username: "Bot",
        userId: 'botId',
      };

      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, replyMessage];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }, 1000);
    }
  };

  const removeMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte raderas');

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((message) => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setErrorMsg('Meddelandet kunde inte raderas');
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation.id);
    localStorage.setItem('conversationId', conversation.id);
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex" style={{ minHeight: '100vh', backgroundImage: "url('/src/components/Assets/ChatBackground.svg')", backgroundSize: 'cover' }}>
        <div className="flex-grow-1 ms-4 p-4">
          <h2 className="mb-4">
            Chat: {chatConversations.find((convo) => convo.id === selectedConversation)?.name || ''}
          </h2>
          <div className="bg-light rounded shadow-sm p-4 mb-4" style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
            <div>
              {/* Display mock messages */}
              {mockMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex align-items-start mb-2 ${msg.username === 'Du' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div className={`d-flex align-items-start ${msg.username === 'Du' ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar} alt="avatar" className="rounded-circle me-2" style={{ width: '3rem', height: '3rem' }} />
                    <div className={`p-2 rounded ${msg.username === 'Du' ? 'bg-dark text-light' : 'bg-secondary text-light'}`}>
                      <div className="fw-bold">{msg.username}</div>
                      <p className="mb-0" dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }}></p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Display real messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex align-items-start mb-2 ${msg.userId === currentUserId ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div className={`d-flex align-items-start ${msg.userId === currentUserId ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="rounded-circle me-2" style={{ width: '3rem', height: '3rem' }} />
                    <div className={`p-2 rounded ${msg.userId === currentUserId ? 'bg-dark text-light' : 'bg-secondary text-light'}`}>
                      <div className="fw-bold">{msg.userId === currentUserId ? 'Du' : msg.username}</div>
                      <p className="mb-0" dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }}></p>
                      {msg.userId === currentUserId && (
                        <button
                          onClick={() => removeMessage(msg.id)}
                          className="btn btn-outline-danger btn-sm ms-2"
                        >
                          Ta bort
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex align-items-center mb-2">
            <input
              id="messageInput"
              name="currentMessage"
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="form-control me-2"
            />
            <button
              onClick={sendNewMessage}
              className="btn btn-success"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
