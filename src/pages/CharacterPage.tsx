// src/CharacterPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Conversation, Message } from "../types";
import { ChevronLeft, Ellipsis, Loader2, Plus } from "lucide-react";

const CharacterPage: React.FC = () => {
  const { characterId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // State to store messages
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get<Conversation[]>(
          `/conversations?user_id=6e7ef93a-20a6-4a9c-8521-1269f8b8d571&character_id=${characterId}`
        );
        setConversations(response.data);
      } catch (err) {
        setError("Failed to fetch conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [characterId]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get<Message[]>(
        `/messages?conversation_id=${conversationId}`
      );
      setMessages(response.data);
    } catch (err) {
      setError("Failed to fetch messages.");
    }
  };

  const generateTitle = async (conversationId: string) => {
    try {
      console.log("Generating title for conversation:", conversationId);
      const response = await api.post("/get-title", {
        conversation_id: conversationId,
      });
      let currentConversation = conversations.find(
        (item) => item.id === conversationId
      );
      if (currentConversation) {
        currentConversation.title = response.data.title;

        setConversations([...conversations]);
      }
    } catch (err) {
      console.error("Failed to generate title");
    }
  };

  const getAIResponse = async (
    currentConversationId: string,
    newConversation: boolean
  ) => {
    console.log(
      "Getting AI response. Here is the selectedConversationId:",
      currentConversationId
    );
    try {
      const response = await api.post("/chat", {
        conversation_id: currentConversationId,
      });
      if (newConversation) {
        generateTitle(currentConversationId);
      }
      return response.data.ai_message;
    } catch (err) {
      console.error("Failed to get AI response");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;

    const updatedMessage = newMessage.trim();
    setNewMessage("");

    setMessageLoading(true);

    let currentMessages;
    let currentConversationId;
    let newConversation = false;

    if (!selectedConversationId) {
      console.log("Creating new conversation");
      newConversation = true;
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

        currentMessages = [
          ...messages,
          {
            id: (messages.length + 1).toString(), // Convert to string
            role: "user",
            content: updatedMessage,
            conversation_id: currentConversationId,
            created_at: new Date().toISOString(),
          },
        ];
        setMessages(currentMessages);
      } catch (err) {
        console.error("Failed to create conversation");
        setMessageLoading(false);
        return;
      }
    } else {
      currentMessages = [
        ...messages,
        {
          id: (messages.length + 1).toString(), // Convert to string
          role: "user",
          content: updatedMessage,
          conversation_id: selectedConversationId,
          created_at: new Date().toISOString(),
        },
      ];
      setMessages(currentMessages);
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

    const aiResponse = await getAIResponse(
      currentConversationId,
      newConversation
    );

    console.log("AI response:", aiResponse);
    if (aiResponse) {
      setMessages([
        ...currentMessages,
        {
          id: (messages.length + 1).toString(), // Ensure id is always a string
          role: "assistant",
          content: aiResponse,
          conversation_id: currentConversationId,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setMessageLoading(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
      setMessages([]);
    }
    try {
      await api.delete(`/conversations/${conversationId}`);
      setConversations(
        conversations.filter(
          (conversation) => conversation.id !== conversationId
        )
      );
    } catch (err) {
      console.error("Failed to delete conversation");
    }
  };

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen">
      {/* Left Navigation - Conversations */}
      <nav className="w-1/3 lg:w-[15%] bg-zinc-100 border-r border-gray-200 p-4">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-zinc-700 px-4 h-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-bold text-center">Conversations</h3>
        </div>
        <div className="flex flex-col">
          {conversations.length > 0 ? (
            <div
              onClick={() => setSelectedConversationId(null)}
              className="flex gap-2 border border-gray-500 my-2 p-2 rounded-md justify-center items-center text-zinc-700 hover:text-white hover:bg-zinc-600 cursor-pointer transition-all duration-500"
            >
              <Plus size={16} />
              <p className="text-sm">New Conversation</p>
            </div>
          ) : null}
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`relative my-0.5 py-2 pl-2 pr-2 rounded-md flex justify-between items-center group ${
                  selectedConversationId === conversation.id
                    ? "bg-zinc-200"
                    : "hover:bg-zinc-200 cursor-pointer"
                }`}
              >
                <p className="font-semibold line-clamp-1 truncate">
                  {conversation.title}
                </p>
                <div
                  className={`absolute right-2 bg-gradient-to-r rounded-md from-transparent h-full w-12 group-hover:to-zinc-200 ${
                    selectedConversationId === conversation.id
                      ? "to-zinc-200"
                      : "to-zinc-100"
                  }`}
                ></div>
                <div
                  onClick={() => handleDeleteConversation(conversation.id)}
                  className={`absolute right-0 h-full top-0 bottom-0 pr-2 pl-8 bg-gradient-to-l from-zinc-200 to-transparent from-50% rounded-md items-center justify-center ${
                    selectedConversationId === conversation.id
                      ? "flex"
                      : "hidden group-hover:flex"
                  }`}
                >
                  <Ellipsis
                    size={16}
                    className={`text-zinc-700 hover:text-black cursor-pointer`}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No conversations yet
            </p>
          )}
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="flex flex-col flex-1 max-h-screen">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-xl p-4 font-bold mb-4">
            Chat with Character {characterId}
          </h2>
          <button onClick={() => navigate("/")} className="p-4 mr-2">
            <p className="rounded-full bg-gray-200 p-2">SD</p>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex flex-col flex-1 h-64 overflow-y-auto w-full">
          <div className="w-full max-w-6xl mx-auto">
            {messages.length < 1 ? (
              <div className="flex flex-1 justify-center items-center">
                <p className="text-zinc-500 text-center">
                  Send a message to start a conversation
                </p>
              </div>
            ) : null}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex my-4 w-full ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={` px-4 py-3 rounded-lg max-w-[75%] ${
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
            {messageLoading && (
              <div className="flex justify-startitems-center my-2">
                <div className="flex text-start items-center gap-2 px-4 py-3 rounded-lg bg-slate-700 text-white">
                  <Loader2 size={16} className="animate-spin" />
                  <p>Loading...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center pb-8 w-full max-w-6xl mx-auto">
          <div className="flex w-full flex-1 border border-gray-300 rounded-lg p-2 focus-within:outline-zinc-200 focus-within:outline">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message"
              className="flex flex-1 pl-3 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 h-full rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
