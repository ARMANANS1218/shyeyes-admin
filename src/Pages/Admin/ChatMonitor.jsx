import React, { useState, useEffect, useRef } from "react";

const usersData = [
  { id: 1, name: "Alicia", gender: "female", img: "https://randomuser.me/api/portraits/women/44.jpg", active: true },
  { id: 2, name: "Mark", gender: "male", img: "https://randomuser.me/api/portraits/men/22.jpg", active: true },
  { id: 5, name: "Maya", gender: "female", img: "https://randomuser.me/api/portraits/women/46.jpg", active: true },
  { id: 6, name: "Kevin", gender: "male", img: "https://randomuser.me/api/portraits/men/44.jpg", active: false },
  // ...add other users
];

// Create pairs
function createPairs(users) {
  const females = users.filter(u => u.gender === "female");
  const males = users.filter(u => u.gender === "male");
  const pairs = [];
  const maxPairs = Math.min(females.length, males.length);

  for (let i = 0; i < maxPairs; i++) {
    pairs.push({
      id: `pair${i + 1}`,
      female: females[i],
      male: males[i],
      messages: [
        { sender: females[i].id, text: `Hello from ${females[i].name}!`, time: "10:00 AM" },
        { sender: males[i].id, text: `Hey ${females[i].name}, how are you?`, time: "10:01 AM" },
      ],
    });
  }
  return pairs;
}

const ChatMonitoring = () => {
  const [chatPairs, setChatPairs] = useState(createPairs(usersData));
  const [selectedPair, setSelectedPair] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef();

  const filteredPairs = chatPairs.filter(
    pair => pair.female.name.toLowerCase().includes(searchTerm.toLowerCase()) || pair.male.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [selectedPair]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedPair) return;

    const updatedPairs = chatPairs.map(p => {
      if (p.id === selectedPair.id) {
        return {
          ...p,
          messages: [...p.messages, { sender: "admin", text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        };
      }
      return p;
    });

    setChatPairs(updatedPairs);
    setMessage("");
  };

  // Block user: mark both users as inactive
  const handleBlockUser = (pair) => {
    const updatedPairs = chatPairs.map(p => {
      if (p.id === pair.id) {
        return {
          ...p,
          female: { ...p.female, active: false },
          male: { ...p.male, active: false },
        };
      }
      return p;
    });
    setChatPairs(updatedPairs);
    alert(`Users ${pair.female.name} and ${pair.male.name} have been blocked.`);
  };

  // Delete chat: remove the chat messages
  const handleDeleteChat = (pair) => {
    const updatedPairs = chatPairs.map(p => {
      if (p.id === pair.id) {
        return { ...p, messages: [] };
      }
      return p;
    });
    setChatPairs(updatedPairs);
    alert(`Chat between ${pair.female.name} and ${pair.male.name} deleted.`);
  };

  // Download chat as JSON file
  const handleDownloadChat = (pair) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pair.messages, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${pair.female.name}_${pair.male.name}_chat.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedPair && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={selectedPair.female.img} className="w-10 h-10 rounded-full" alt={selectedPair.female.name} />
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{selectedPair.female.name}</div>
                  <div className={`text-sm ${selectedPair.female.active ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`}>
                    {selectedPair.female.active ? "Active now" : "Inactive"}
                  </div>
                </div>
              </div>
              <span className="mx-2 text-gray-500 dark:text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <img src={selectedPair.male.img} className="w-10 h-10 rounded-full" alt={selectedPair.male.name} />
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{selectedPair.male.name}</div>
                  <div className={`text-sm ${selectedPair.male.active ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`}>
                    {selectedPair.male.active ? "Active now" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBlockUser(selectedPair)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
              >
                Block
              </button>
              <button
                onClick={() => handleDeleteChat(selectedPair)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleDownloadChat(selectedPair)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        )}

        <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900">
          {selectedPair?.messages.map((msg, i) => {
            const isRight = msg.sender === selectedPair.male.id || msg.sender === "admin";
            const senderImg = isRight ? selectedPair.male.img : selectedPair.female.img;
            return (
              <div key={i} className={`flex ${isRight ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isRight && <img src={senderImg} className="w-8 h-8 rounded-full" alt="sender" />}
                <div className={`p-3 rounded-lg max-w-xs ${
                  isRight 
                    ? "bg-blue-500 text-white dark:bg-blue-600" 
                    : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                }`}>
                  {msg.text}
                  <div className={`text-xs mt-1 text-right ${
                    isRight ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {msg.time}
                  </div>
                </div>
                {isRight && <img src={senderImg} className="w-8 h-8 rounded-full" alt="sender" />}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        {selectedPair && (
          <div className="p-4 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <input
              type="text"
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage} 
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Send
            </button>
          </div>
        )}

        {/* Empty state when no pair is selected */}
        {!selectedPair && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Chat Selected</h3>
              <p className="text-gray-500 dark:text-gray-400">Select a chat pair from the sidebar to start monitoring</p>
            </div>
          </div>
        )}
      </div>

      {/* Users List */}
      <aside className="w-80 border-l border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {filteredPairs.length > 0 ? (
            filteredPairs.map(pair => (
              <div
                key={pair.id}
                className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 transition-colors ${
                  selectedPair?.id === pair.id 
                    ? "bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                }`}
                onClick={() => setSelectedPair(pair)}
              >
                <img src={pair.female.img} className="w-8 h-8 rounded-full" alt={pair.female.name} />
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pair.female.name}</span>
                <span className="mx-1 text-gray-500 dark:text-gray-400">→</span>
                <img src={pair.male.img} className="w-8 h-8 rounded-full" alt={pair.male.name} />
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pair.male.name}</span>
                
                {/* Active status indicators */}
                <div className="ml-auto flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${pair.female.active ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${pair.male.active ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No chat pairs found</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChatMonitoring;