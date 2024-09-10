// src/CharacterPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Conversation, Message } from "../types";
import { ChevronLeft } from "lucide-react";

const CharacterPage: React.FC = () => {
  const { characterId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // State to store messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get<Conversation[]>(
          `/conversations?user_id=6e7ef93a-20a6-4a9c-8521-1269f8b8d571&character_id=${characterId}`
        );
        setConversations(response.data);
        if (response.data.length > 0) {
          // Fetch messages for the first conversation
          const conversationId = response.data[0].id;
          fetchMessages(conversationId);
        }
      } catch (err) {
        setError("Failed to fetch conversations.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async (conversationId: number) => {
      try {
        const response = await api.get<Message[]>(
          `/messages?conversation_id=${conversationId}`
        );
        setMessages(response.data);
      } catch (err) {
        setError("Failed to fetch messages.");
      }
    };

    fetchConversations();
  }, [characterId]);

  const getAIResponse = async (currentConversationId: string) => {
    console.log(
      "Getting AI response. Here is the selectedConversationId:",
      currentConversationId
    );
    try {
      const response = await api.post("/chat", {
        conversation_id: currentConversationId,
      });
      return response.data.ai_message;
    } catch (err) {
      console.error("Failed to get AI response");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;

    const updatedMessage = newMessage.trim();
    setNewMessage("");

    setLoading(true);

    let currentConversationId;
    if (!selectedConversationId) {
      console.log("Creating new conversation");
      try {
        const response = await api.post("/conversations", {
          user_id: "6e7ef93a-20a6-4a9c-8521-1269f8b8d571",
          character_id: characterId,
          title: "New Conversation",
        });
        console.log("Conversation created", response.data);
        conversations.push(response.data);
        setSelectedConversationId(response.data.conversation.id);
        currentConversationId = response.data.conversation.id;
        console.log("Selected conversation ID set:", currentConversationId);
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            role: "user",
            content: updatedMessage,
            conversation_id: currentConversationId,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error("Failed to create conversation");
        setLoading(false);
        return;
      }
    } else {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          role: "user",
          content: updatedMessage,
          conversation_id: selectedConversationId,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    // Send message to API
    try {
      // Assuming using the first conversation for now
      if (selectedConversationId) {
        currentConversationId = selectedConversationId;
      }

      console.log(
        "Sending message to API, selectedConversationId:",
        currentConversationId
      );

      const response = await api.post("/messages", {
        conversation_id: currentConversationId,
        role: "user", // Assuming user is sending the message
        content: updatedMessage,
      });

      console.log(response.data);

      // Clear input
    } catch (err) {
      console.error("Failed to send message");
    }

    const aiResponse = await getAIResponse(currentConversationId);

    console.log("AI response:", aiResponse);
    if (aiResponse) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          role: "assistant",
          content: aiResponse,
          conversation_id: currentConversationId,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  };

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen">
      {/* Left Navigation - Conversations */}
      <nav className="w-[15%] bg-zinc-100 border-r border-gray-200 p-4">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-zinc-700 px-4 h-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-bold text-center">Conversations</h3>
        </div>
        <ul>
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <li key={conversation.id} className="my-2">
                <p className="font-semibold">{conversation.title}</p>
                <p className="text-sm text-gray-600">
                  Last message: {conversation.last_message_content}
                </p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No conversations yet
            </p>
          )}
        </ul>
      </nav>

      {/* Chat Interface */}
      <div className="flex flex-col flex-1">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-xl p-4 font-bold mb-4">
            Chat with Character {characterId}
          </h2>
          <button onClick={() => navigate("/")} className="p-4 mr-2">
            <p className="rounded-full bg-gray-200 p-2">SD</p>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex flex-col flex-1 mb-4 p-4 h-64 overflow-y-scroll">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex my-2 w-full ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={` px-4 py-3 rounded-lg max-w-3/4 ${
                  message.role === "user"
                    ? "text-end bg-gray-200"
                    : "text-start bg-slate-700 text-white"
                }`}
              >
                <p
                  className={`
                  }`}
                >
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center pb-8 max-w-6xl w-full mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 px-3 py-4 border border-gray-300 rounded mr-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-8 h-full rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
