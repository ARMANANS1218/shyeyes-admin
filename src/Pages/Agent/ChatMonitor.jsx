import React, { useState, useEffect, useRef } from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

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
  useDocumentTitle("Chat Monitoring"); // This will set the title as "Chat Monitoring - Agent Dashboard | ShyEyes"
  
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-transparent">
        {selectedPair && (
          <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-800 transition-colors">
            {/* User Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img src={selectedPair.female.img} className="w-10 h-10 rounded-full" alt={selectedPair.female.name} />
                <div>
                  <div className="font-bold">{selectedPair.female.name}</div>
                  <div className="text-sm text-green-500">{selectedPair.female.active ? "Active now" : "Inactive"}</div>
                </div>
              </div>

              <div className="text-sm text-gray-400 dark:text-gray-300">→</div>

              <div className="flex items-center gap-2">
                <img src={selectedPair.male.img} className="w-10 h-10 rounded-full" alt={selectedPair.male.name} />
                <div>
                  <div className="font-bold">{selectedPair.male.name}</div>
                  <div className="text-sm text-gray-400 dark:text-gray-300">{selectedPair.male.active ? "Active now" : "Inactive"}</div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBlockUser(selectedPair)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Block
              </button>
              <button
                onClick={() => handleDeleteChat(selectedPair)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleDownloadChat(selectedPair)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        )}

        <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-2 bg-white dark:bg-gray-800 transition-colors">
          {selectedPair?.messages.map((msg, i) => {
            const isRight = msg.sender === selectedPair.male.id || msg.sender === "admin";
            const senderImg = isRight ? selectedPair.male.img : selectedPair.female.img;
            return (
              <div key={i} className={`flex ${isRight ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isRight && <img src={senderImg} className="w-8 h-8 rounded-full" alt="sender" />}
                <div className={`p-2 rounded-lg max-w-xs ${isRight ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                  {msg.text}
                  <div className="text-xs text-gray-500 dark:text-gray-300 text-right">{msg.time}</div>
                </div>
                {isRight && <img src={senderImg} className="w-8 h-8 rounded-full" alt="sender" />}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        {selectedPair && (
          <div className="p-4 flex items-center gap-2 border-t bg-white dark:bg-gray-800 transition-colors">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
              Send
            </button>
          </div>
        )}
      </div>

      {/* Users List */}
      <aside className="w-80 border-l p-4 bg-white dark:bg-gray-800 transition-colors">
        <input
          type="text"
          placeholder="Search by username..."
          className="w-full border rounded px-2 py-1 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {filteredPairs.map(pair => (
            <div
              key={pair.id}
              className={`p-2 rounded cursor-pointer flex items-center gap-2 ${selectedPair?.id === pair.id ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              onClick={() => setSelectedPair(pair)}
            >
              <img src={pair.female.img} className="w-8 h-8 rounded-full" alt={pair.female.name} />
              <span className="flex-1">{pair.female.name}</span>
              <span className="mx-1 text-gray-400 dark:text-gray-300">→</span>
              <img src={pair.male.img} className="w-8 h-8 rounded-full" alt={pair.male.name} />
              <span className="flex-1 text-right">{pair.male.name}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default ChatMonitoring;
