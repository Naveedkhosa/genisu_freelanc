import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';

const ChatBot = () => {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState('');
  const [assistantId] = useState("asst_moT7wdGGJRlL4lL0acG6cBHB");
  const [threadId, setThreadId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user");
  const current_user = user ? JSON.parse(user) : null;
  const openai = useRef(new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  })).current;

  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      try {
        const thread = await openai.beta.threads.create({
          messages: [
            {
              role: 'assistant',
              content: "Hello! Welcome to GeniusShip. I am your virtual assistant here to help you with any queries you might have. Whether you are a driver or a customer, feel free to ask me anything, and I'll do my best to assist you. How can I help you today?",
            },
          ],
        });
        setThreadId(thread.id);
        setMessages([
          {
            role: 'assistant',
            content: "Hello! Welcome to GeniusShip. I am your virtual assistant here to help you with any queries you might have. Whether you are a driver or a customer, feel free to ask me anything, and I'll do my best to assist you. How can I help you today?",
          },
        ]);
        console.log('Initialized thread with Id: ' + thread.id);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, [openai]);



  const handleSendMessage = async () => {
    if (!input.trim() || !assistantId || !threadId) return;

    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages: any) => [...prevMessages, userMessage]);
    setInput('');

    try {
      //@ts-ignore
      await openai.beta.threads.messages.create(threadId, userMessage);

      const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
        additional_instructions: `Please address the user as ${current_user?.name}.`,
      });

      console.log('Run finished with status: ' + run.status);

      if (run.status === 'completed') {
        const threadMessages = await openai.beta.threads.messages.list(threadId);
        const allMessages = threadMessages.getPaginatedItems().map(msg => ({
          role: msg.role,
          //@ts-ignore
          content: msg.content[0].text.value,
        }));
        setMessages(allMessages.reverse());
      }
    } catch (error) {
      console.error('Error fetching assistant response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[90vh] antialiased md:pl-[84px] sm:pl-0 text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl border border-gray-500  bg-black bg-opacity-25 h-full p-2">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className=" grid-cols-12 gap-y-2 ">

                  {messages.map((msg: any, index: any) => (
                    <div
                      key={index}
                      className={`block col-start-${msg.role === 'user' ? '8' : '1'} col-end-${msg.role === 'user' ? '13' : '8'} p-3 rounded-lg`}
                    >
                      <div className={`flex ${msg.role === 'user' ? 'items-center justify-start flex-row-reverse' : 'items-center'}`}>
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          {msg.role === 'user' ? 'U' : 'A'}
                        </div>
                        <div className={`relative ${msg.role === 'user' ? 'mr-3' : 'ml-3'} text-sm bg-${msg.role === 'user' ? 'indigo-100 bg-muted/50' : ' bg-muted/50 text-white'} py-2 px-4 shadow rounded-xl`}>
                          <div>{msg.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          A
                        </div>
                        <div className="relative ml-3 text-sm bg-muted/50 py-2 px-4 shadow rounded-xl">
                          <div>Typing...</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-muted/50 w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex w-full border rounded-xl  bg-muted/50 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    placeholder="Type your message here..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
