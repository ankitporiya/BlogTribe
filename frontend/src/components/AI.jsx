// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Send, Loader, Brain, MessageCircle, Sparkles } from 'lucide-react';

// const AI = ({ blog, isOpen, onClose }) => {
//   const [summary, setSummary] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [error, setError] = useState('');

//   const GEMINI_API_KEY = 'AIzaSyBdeEa4XsEKjxOC7FtHMpB0aLBtac-B3nY'; // Add your Gemini API key here
//   const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

//   // Generate summary when modal opens
//   useEffect(() => {
//     if (isOpen && blog && !summary) {
//       generateSummary();
//     }
//   }, [isOpen, blog]);

//   // Clear data when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setSummary('');
//       setMessages([]);
//       setInputMessage('');
//       setError('');
//     }
//   }, [isOpen]);

//   const generateSummary = async () => {
//     if (!GEMINI_API_KEY) {
//       setError('Gemini API key not configured');
//       return;
//     }

//     setSummaryLoading(true);
//     setError('');

//     try {
//       const prompt = `Please provide a concise summary of the following blog post in 3-4 sentences. Focus on the main points and key insights:

// Title: ${blog.title}
// Content: ${blog.content}`;

//       const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: prompt
//             }]
//           }]
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
//         setSummary(data.candidates[0].content.parts[0].text);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Error generating summary:', error);
//       setError('Failed to generate summary. Please try again.');
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!inputMessage.trim() || loading || !GEMINI_API_KEY) return;

//     const userMessage = inputMessage.trim();
//     setInputMessage('');
//     setLoading(true);
//     setError('');

//     // Add user message to chat
//     const newMessages = [...messages, { type: 'user', content: userMessage }];
//     setMessages(newMessages);

//     try {
//       const prompt = `Based on this blog post, please answer the following question:

// Blog Title: ${blog.title}
// Blog Content: ${blog.content}

// Question: ${userMessage}

// Please provide a helpful and relevant answer based on the blog content. If the question is not related to the blog content, politely mention that and try to redirect to blog-related topics.`;

//       const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: prompt
//             }]
//           }]
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
//         const aiResponse = data.candidates[0].content.parts[0].text;
//         setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages([...newMessages, {
//         type: 'ai',
//         content: 'Sorry, I encountered an error. Please try again.'
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
//         onClick={onClose}
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           className="bg-[#1A1A1D] max-w-4xl w-full max-h-[90vh] rounded-lg shadow-2xl overflow-hidden"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#A64D79] to-purple-600 p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-white bg-opacity-20 rounded-full">
//                   <Brain className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">AI Insights</h2>
//                   <p className="text-purple-100 text-sm">{blog?.title}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col h-[calc(90vh-120px)]">
//             {/* Summary Section */}
//             <div className="p-6 border-b border-gray-700">
//               <div className="flex items-center space-x-2 mb-4">
//                 <Sparkles className="w-5 h-5 text-[#A64D79]" />
//                 <h3 className="text-lg font-semibold text-white">Blog Summary</h3>
//               </div>

//               {summaryLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader className="w-6 h-6 text-[#A64D79] animate-spin mr-2" />
//                   <span className="text-gray-400">Generating summary...</span>
//                 </div>
//               ) : error && !summary ? (
//                 <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg">
//                   {error}
//                   <button
//                     onClick={generateSummary}
//                     className="ml-2 text-red-200 underline hover:text-red-100"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               ) : summary ? (
//                 <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
//                   <p className="text-gray-300 leading-relaxed">{summary}</p>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
//                   <p className="text-gray-400">Summary will appear here...</p>
//                 </div>
//               )}
//             </div>

//             {/* Chat Section */}
//             <div className="flex-1 flex flex-col">
//               {/* Chat Header */}
//               <div className="p-4 border-b border-gray-700">
//                 <div className="flex items-center space-x-2">
//                   <MessageCircle className="w-5 h-5 text-[#A64D79]" />
//                   <h3 className="text-lg font-semibold text-white">Ask Questions</h3>
//                 </div>
//                 <p className="text-gray-400 text-sm mt-1">Ask me anything about this blog post</p>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="text-center py-8">
//                     <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
//                     <p className="text-gray-400">Start a conversation about this blog post!</p>
//                     <p className="text-gray-500 text-sm mt-2">Ask questions, request explanations, or discuss the content</p>
//                   </div>
//                 ) : (
//                   messages.map((message, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div
//                         className={`max-w-[80%] p-3 rounded-lg ${
//                           message.type === 'user'
//                             ? 'bg-[#A64D79] text-white'
//                             : 'bg-gray-800 text-gray-300'
//                         }`}
//                       >
//                         <p className="whitespace-pre-wrap">{message.content}</p>
//                       </div>
//                     </motion.div>
//                   ))
//                 )}

//                 {loading && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex justify-start"
//                   >
//                     <div className="bg-gray-800 text-gray-300 p-3 rounded-lg flex items-center">
//                       <Loader className="w-4 h-4 animate-spin mr-2" />
//                       <span>AI is thinking...</span>
//                     </div>
//                   </motion.div>
//                 )}
//               </div>

//               {/* Input */}
//               <div className="p-4 border-t border-gray-700">
//                 {!GEMINI_API_KEY ? (
//                   <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-sm">
//                     ⚠️ Gemini API key not configured. Please add your API key to use AI features.
//                   </div>
//                 ) : (
//                   <div className="flex space-x-3">
//                     <textarea
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Ask a question about this blog post..."
//                       className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A64D79] resize-none"
//                       rows="2"
//                       disabled={loading}
//                     />
//                     <button
//                       onClick={sendMessage}
//                       disabled={loading || !inputMessage.trim()}
//                       className="px-4 py-2 bg-[#A64D79] hover:bg-purple-600 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? (
//                         <Loader className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <Send className="w-4 h-4" />
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default AI;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader, Brain, MessageCircle, Sparkles } from "lucide-react";

const AI = ({ blog, isOpen, onClose }) => {
  const [summary, setSummary] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const GEMINI_API_KEY = "AIzaSyBdeEa4XsEKjxOC7FtHMpB0aLBtac-B3nY"; // Add your Gemini API key here
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  // Only auto-scroll when new messages are added (not on manual scroll)
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // New message added, scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Auto-scroll when loading starts (AI thinking message appears)
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading]);

  // Generate summary when modal opens
  useEffect(() => {
    if (isOpen && blog && !summary) {
      generateSummary();
    }
  }, [isOpen, blog]);

  // Clear data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSummary("");
      setMessages([]);
      setInputMessage("");
      setError("");
    }
  }, [isOpen]);

  const generateSummary = async () => {
    if (!GEMINI_API_KEY) {
      setError("Gemini API key not configured");
      return;
    }

    setSummaryLoading(true);
    setError("");

    try {
      const prompt = `Please provide a concise summary of the following blog post in 3-4 sentences. Focus on the main points and key insights:

Title: ${blog?.title}
Content: ${blog?.content}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setSummary(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading || !GEMINI_API_KEY) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setLoading(true);
    setError("");

    // Add user message to chat
    const newMessages = [...messages, { type: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const prompt = `Based on this blog post, please answer the following question:

Blog Title: ${blog?.title}
Blog Content: ${blog?.content}

Question: ${userMessage}

Please provide a helpful and relevant answer based on the blog content. If the question is not related to the blog content, politely mention that and try to redirect to blog-related topics.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages([...newMessages, { type: "ai", content: aiResponse }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-[#1A1A1D] max-w-4xl w-full h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#A64D79] to-purple-600 p-6 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Insights</h2>
                  <p className="text-purple-100 text-sm">{blog?.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Summary Section */}
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#A64D79]" />
                <h3 className="text-lg font-semibold text-white">
                  Blog Summary
                </h3>
              </div>

              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 text-[#A64D79] animate-spin mr-2" />
                  <span className="text-gray-400">Generating summary...</span>
                </div>
              ) : error && !summary ? (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg">
                  {error}
                  <button
                    onClick={generateSummary}
                    className="ml-2 text-red-200 underline hover:text-red-100"
                  >
                    Retry
                  </button>
                </div>
              ) : summary ? (
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed">{summary}</p>
                </div>
              ) : (
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <p className="text-gray-400">Summary will appear here...</p>
                </div>
              )}
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-[#A64D79]" />
                  <h3 className="text-lg font-semibold text-white">
                    Ask Questions
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Ask me anything about this blog post
                </p>
              </div>

              {/* Messages - Scrollable Area */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#A64D79 #2D2D30",
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Start a conversation about this blog post!
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Ask questions, request explanations, or discuss the
                      content
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-[#A64D79] text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800 text-gray-300 p-3 rounded-lg flex items-center">
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      <span>AI is thinking...</span>
                    </div>
                  </motion.div>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Fixed at bottom */}
              <div className="p-4 border-t border-gray-700 flex-shrink-0">
                {!GEMINI_API_KEY ? (
                  <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-sm">
                    ⚠️ Gemini API key not configured. Please add your API key to
                    use AI features.
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question about this blog post..."
                      className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A64D79] resize-none"
                      rows="2"
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !inputMessage.trim()}
                      className="px-4 py-2 bg-[#A64D79] hover:bg-purple-600 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 8px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: #2d2d30;
              border-radius: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #a64d79;
              border-radius: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: #8b3a5c;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AI;
