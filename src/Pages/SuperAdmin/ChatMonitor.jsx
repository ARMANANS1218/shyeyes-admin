import React, { useState, useEffect, useRef } from "react";

// 🧠 Sample users
const usersData = [
  { id: 1, name: "Alicia", gender: "female", img: "https://randomuser.me/api/portraits/women/44.jpg", active: true },
  { id: 2, name: "Mark", gender: "male", img: "https://randomuser.me/api/portraits/men/22.jpg", active: true },
  { id: 5, name: "Maya", gender: "female", img: "https://randomuser.me/api/portraits/women/46.jpg", active: true },
  { id: 6, name: "Kevin", gender: "male", img: "https://randomuser.me/api/portraits/men/44.jpg", active: false },
  { id: 7, name: "Mark", gender: "male", img: "https://randomuser.me/api/portraits/men/22.jpg", active: true },
  { id: 8, name: "Riya", gender: "female", img: "https://randomuser.me/api/portraits/women/46.jpg", active: true },
  { id: 9, name: "Kajal", gender: "male", img: "https://randomuser.me/api/portraits/men/44.jpg", active: false },
  { id: 10, name: "Marku", gender: "male", img: "https://randomuser.me/api/portraits/men/22.jpg", active: true },
  { id: 11, name: "Tiya", gender: "female", img: "https://randomuser.me/api/portraits/women/46.jpg", active: true },
  { id: 12, name: "Kiran", gender: "male", img: "https://randomuser.me/api/portraits/men/44.jpg", active: false },
];

// Pair creation
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
    pair =>
      pair.female.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.male.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          messages: [
            ...p.messages,
            {
              sender: "admin",
              text: message,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return p;
    });

    setChatPairs(updatedPairs);
    setMessage("");
  };

  const handleBlockUser = (pair) => {
    const updatedPairs = chatPairs.map(p =>
      p.id === pair.id
        ? {
            ...p,
            female: { ...p.female, active: false },
            male: { ...p.male, active: false },
          }
        : p
    );
    setChatPairs(updatedPairs);
    alert(`Users ${pair.female.name} and ${pair.male.name} have been blocked.`);
  };

  const handleDeleteChat = (pair) => {
    const updatedPairs = chatPairs.map(p =>
      p.id === pair.id ? { ...p, messages: [] } : p
    );
    setChatPairs(updatedPairs);
    alert(`Chat between ${pair.female.name} and ${pair.male.name} deleted.`);
  };

  const handleDownloadChat = (pair) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pair.messages, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${pair.female.name}_${pair.male.name}_chat.json`);
    dlAnchorElem.click();
  };

  // ✅ Edit action
  const handleEditPair = (pair) => {
    alert(`🛠️ Open edit modal for chat between ${pair.female.name} and ${pair.male.name}`);
  };

  return (
    <div className="flex h-screen">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-pink-50">
        {selectedPair && (
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={selectedPair.female.img} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-bold">{selectedPair.female.name}</div>
                  <div className="text-green-500">
                    {selectedPair.female.active ? "Active now" : "Inactive"}
                  </div>
                </div>
              </div>
              <span className="mx-2">→</span>
              <div className="flex items-center gap-2">
                <img src={selectedPair.male.img} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-bold">{selectedPair.male.name}</div>
                  <div className="text-gray-400">
                    {selectedPair.male.active ? "Active now" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Admin Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditPair(selectedPair)}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleBlockUser(selectedPair)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Block
              </button>
              <button
                onClick={() => handleDeleteChat(selectedPair)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleDownloadChat(selectedPair)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-2">
          {selectedPair?.messages.map((msg, i) => {
            const isRight = msg.sender === selectedPair.male.id || msg.sender === "admin";
            const senderImg = isRight ? selectedPair.male.img : selectedPair.female.img;
            return (
              <div key={i} className={`flex ${isRight ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isRight && <img src={senderImg} className="w-8 h-8 rounded-full" />}
                <div
                  className={`p-2 rounded-lg ${isRight ? "bg-pink-400 text-white" : "bg-white text-gray-800"} max-w-xs`}
                >
                  {msg.text}
                  <div className="text-xs text-gray-500 text-right">{msg.time}</div>
                </div>
                {isRight && <img src={senderImg} className="w-8 h-8 rounded-full" />}
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        {selectedPair && (
          <div className="p-4 flex items-center gap-2 border-t">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="bg-pink-500 text-white px-4 py-2 rounded-full">
              Send
            </button>
          </div>
        )}
      </div>

      {/* Users Sidebar */}
      <aside className="w-80 border-l p-4 bg-white">
        <input
          type="text"
          placeholder="Search by username..."
          className="w-full border rounded px-2 py-1 mb-4"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {filteredPairs.map(pair => (
            <div
              key={pair.id}
              className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                selectedPair?.id === pair.id ? "bg-pink-200" : "hover:bg-pink-100"
              }`}
              onClick={() => setSelectedPair(pair)}
            >
              <img src={pair.female.img} className="w-8 h-8 rounded-full" />
              <span>{pair.female.name}</span>
              <span className="mx-1">→</span>
              <img src={pair.male.img} className="w-8 h-8 rounded-full" />
              <span>{pair.male.name}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default ChatMonitoring;