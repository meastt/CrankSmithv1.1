import { useState, useRef, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import { RileyAI } from '../lib/rileyAI';

export default function AskRiley() {
  const [riley] = useState(() => new RileyAI(null, null));
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm Riley, your AI bike expert. I've been trained on thousands of bike maintenance manuals and brand support docs. I can help you with upgrade questions, installation guides, compatibility checks, and general bike maintenance advice. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What tire pressure should I use for road cycling?",
    "How do I know if my chain needs replacing?",
    "What's the difference between 11-speed and 12-speed?",
    "Can I upgrade from rim brakes to disc brakes?",
    "How do I choose the right gear ratio?",
    "What tools do I need for basic bike maintenance?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the existing Riley AI implementation
      const rileyResponse = await riley.askRiley(userMessage.content);

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: rileyResponse.success ? rileyResponse.response : rileyResponse.error,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <>
      <SEOHead
        title="Ask Riley - AI Bike Expert | CrankSmith"
        description="Get instant answers to your bike questions from Riley, our AI expert trained on thousands of bike maintenance manuals. Ask about upgrades, installations, compatibility, and more."
        url="https://cranksmith.com/ask-riley"
        image="/og-image.jpg"
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-blue to-brand-purple text-white py-16">
          <div className="container-responsive">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Riley
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Your AI-powered bike expert trained on thousands of maintenance manuals and brand support docs
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">Upgrade Questions</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Installation Guides</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Compatibility Checks</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Maintenance Tips</span>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Interface */}
        <section className="py-8">
          <div className="container-responsive max-w-4xl">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="border-b border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Riley</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">AI Bike Expert • Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-brand-blue text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-6">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Riley about your bike..."
                    className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Questions */}
        <section className="py-8">
          <div className="container-responsive max-w-4xl">
            <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">
              Popular Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-brand-blue dark:hover:border-brand-blue transition-colors"
                >
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{question}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Riley Features */}
        <section className="py-16 bg-neutral-100 dark:bg-neutral-900">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
                What Riley Can Help With
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Trained on thousands of bike maintenance manuals and brand support documentation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-2xl text-white">🔧</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Upgrade Questions</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Get advice on component upgrades, compatibility, and performance improvements for your bike.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl text-white">📋</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Installation Guides</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Step-by-step installation instructions and troubleshooting tips for bike components.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Compatibility Checks</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Verify if components work together and avoid costly compatibility mistakes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA to other tools */}
        <section className="py-16">
          <div className="container-responsive text-center">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
              Need More Tools?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
              Combine Riley's expertise with our precision calculators for the ultimate bike optimization experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-primary">
                Gear Calculator
              </Link>
              <Link href="/tire-pressure" className="btn-secondary">
                Tire Pressure Tool
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}