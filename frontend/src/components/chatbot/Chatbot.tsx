import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
  }>>([
    {
      id: 'welcome',
      text: "Hi there! I'm Melodify Assistant. How can I help with your music experience today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [awaitingIssueDetail, setAwaitingIssueDetail] = useState(false);

  const suggestedPrompts = [
    "How do I play a song?",
    "How can I create a playlist?",
    "How do I search for music?",
    "How do I download songs?",
    "What’s the sound quality?",
    "Hi",
    "I'm facing an issue",
    "Why can't I play songs without signing in?"
  ];

  const handleSend = (customText?: string) => {
    const messageText = customText ?? input;
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user' as const
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse = {
        id: Date.now().toString(),
        text: getBotResponse(messageText),
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, botResponse]);

      // Reset awaiting state
      setAwaitingIssueDetail(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (awaitingIssueDetail) {
      return "Thanks for reaching out! For more specific help, mail us at melodify.support@gmail.com";
    }

    if (
      input.includes("why can't i play songs without signing in") ||
      input.includes("play songs without signing in")
    ) {
      return "To ensure a personalized and secure experience, song playback requires users to be signed in. Please log in to enjoy uninterrupted music!";
    }

    if (/playlist|collection|library/.test(input)) {
      return "If you have a premium subscription then you can create and manage playlists in the 'Your Library' section. Just click the '+' button to start a new playlist!";
    }

    if (/\bplay(?!list)\b|\bsong\b|\bmusic\b/.test(input)) {
      const responses = [
        "You can play songs by searching in the search bar on top or clicking on any song in your homepage.",
        "Having trouble playing a song? Try refreshing the page or checking your internet connection.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (/search|find/.test(input)) {
      return "Use the search bar at the top to find songs, artists, or albums. You can search by title, artist name, or even lyrics!";
    }

    if (/quality|bitrate|sound/.test(input)) {
      return "Melodify streams at the highest possible quality based on your connection.";
    }

    if (/discover|new music|recommend/.test(input)) {
      return "Check out our 'Made For You' and 'Trending' sections for personalized music recommendations based on your listening habits!";
    }

    if (/offline|download/.test(input)) {
      return "For offline listening, you'll need a premium subscription. This lets you download songs to your device.";
    }

    if (/hi|hello|hey/.test(input)) {
      return "Hello! Ready to explore some great music today?";
    }

    if (/problem|issue|error|bug/.test(input)) {
      setAwaitingIssueDetail(true);
      return "I'm sorry you're experiencing issues. Our team constantly works to improve Melodify. Could you describe what's happening in detail?";
    }

    return "Thanks for reaching out! For more specific help, mail us at melodify.support@gmail.com";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 rounded-full w-12 h-12 p-0 bg-purple-600 hover:bg-purple-700 z-50"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[80vh] flex flex-col">
          <DialogHeader className="border-b pb-3">
            <h3 className="text-lg font-semibold">Melodify Support</h3>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          <div className="p-4 border-t border-b overflow-x-auto whitespace-nowrap flex gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about music, playlists, etc..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={() => handleSend()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
