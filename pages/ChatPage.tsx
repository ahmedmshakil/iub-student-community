
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, ChatMessage as ChatMessageType, User, MessageSender } from '../types';
import { MOCK_COURSES, UNIVERSITY_SHORT_NAME } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
// FIX: Import ChatBubbleIcon
import { PaperClipIcon, SendIcon, CameraIcon, ChatBubbleIcon } from '../components/icons'; // Assuming CameraIcon is for image attachments

const ChatMessage: React.FC<{ message: ChatMessageType; currentUser: User | null }> = ({ message, currentUser }) => {
  const isUserMessage = message.senderType === MessageSender.USER && message.sender.name === currentUser?.name;
  
  return (
    <div className={`flex mb-4 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      {!isUserMessage && (
        <Avatar name={typeof message.sender === 'string' ? message.sender : message.sender.name} size="sm" className="mr-2 self-end" />
      )}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
          isUserMessage ? 'bg-iub-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        {!isUserMessage && <p className="text-xs font-semibold mb-0.5 text-iub-primary">{typeof message.sender === 'string' ? message.sender : message.sender.name}</p>}
        <p className="text-sm">{message.text}</p>
        {message.attachment && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <p className="font-medium">Attachment: {message.attachment.name}</p>
            {message.attachment.type === 'image' && message.attachment.url && (
               <img src={message.attachment.url} alt={message.attachment.name} className="max-w-full h-auto rounded mt-1" />
            )}
            <p className="text-gray-500">Type: {message.attachment.type}</p>
          </div>
        )}
        <p className={`text-xs mt-1 ${isUserMessage ? 'text-iub-primary/70' : 'text-gray-400'} text-right`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUserMessage && (
         <Avatar name={currentUser?.name} size="sm" className="ml-2 self-end" />
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (courseId) {
      const course = MOCK_COURSES.find(c => c.id === courseId);
      setSelectedCourse(course || null);
      // Mock loading messages for the selected course
      if (course) {
        setMessages([
          { id: 'm1', courseId: course.id, sender: { name: 'Alice' }, senderType: MessageSender.OTHER, text: `Hello everyone in ${course.name}!`, timestamp: new Date(Date.now() - 300000) },
          { id: 'm2', courseId: course.id, sender: { name: 'Bob' }, senderType: MessageSender.OTHER, text: 'Hi Alice! Ready for the quiz?', timestamp: new Date(Date.now() - 240000) },
          { id: 'm3', courseId: course.id, sender: user || {name: 'You'}, senderType: MessageSender.USER, text: 'Hey Bob, yeah, been studying!', timestamp: new Date(Date.now() - 180000), attachment: {name: 'study_notes.pdf', type: 'file'} },
        ]);
      }
    } else {
        // If no courseId, navigate to the first course by default or show a selection message
        if (MOCK_COURSES.length > 0) {
            navigate(`/chat/${MOCK_COURSES[0].id}`, { replace: true });
        }
    }
  }, [courseId, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedCourse || !user) return;
    const message: ChatMessageType = {
      id: `m${Date.now()}`,
      courseId: selectedCourse.id,
      sender: user,
      senderType: MessageSender.USER,
      text: newMessage,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCourse && user) {
      const fileTypeGuess = file.type.startsWith('image') ? 'image' : (file.type.startsWith('video') ? 'video' : (file.type.startsWith('audio') ? 'audio' : 'file'));
      const message: ChatMessageType = {
        id: `m${Date.now()}`,
        courseId: selectedCourse.id,
        sender: user,
        senderType: MessageSender.USER,
        text: `Attached: ${file.name}`,
        timestamp: new Date(),
        attachment: {
          name: file.name,
          type: fileTypeGuess,
          url: fileTypeGuess === 'image' ? URL.createObjectURL(file) : undefined, // Show preview for images
        },
      };
      setMessages(prevMessages => [...prevMessages, message]);
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height,100px))] max-h-[calc(100vh-80px)] md:max-h-full bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Courses Sidebar */}
      <div className="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-iub-primary">My Courses</h2>
        </div>
        <ul className="p-2">
          {MOCK_COURSES.map(course => (
            <li key={course.id}>
              <button
                onClick={() => navigate(`/chat/${course.id}`)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-150 ${
                  selectedCourse?.id === course.id ? 'bg-iub-primary/10 text-iub-primary font-medium' : 'hover:bg-gray-200'
                }`}
              >
                <span className="block text-sm font-medium">{course.code}</span>
                <span className="block text-xs text-gray-600">{course.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedCourse ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-gray-800">{selectedCourse.name} ({selectedCourse.code})</h2>
              <p className="text-sm text-gray-500">Group Chat</p>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-100">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} currentUser={user} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
                  <PaperClipIcon className="w-5 h-5" />
                </Button>
                 <Button variant="ghost" size="sm" onClick={() => alert('Camera access not implemented.')} aria-label="Take picture">
                  <CameraIcon className="w-5 h-5" />
                </Button>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 !mb-0"
                  containerClassName="flex-1 !mb-0"
                />
                <Button onClick={handleSendMessage} size="sm" aria-label="Send message">
                  <SendIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 text-center">
            <div>
              <ChatBubbleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Welcome to {UNIVERSITY_SHORT_NAME} Chats</h2>
              <p className="text-gray-500">Select a course from the sidebar to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;