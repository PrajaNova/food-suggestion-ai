"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ApiKeyModal from "@/components/ApiKeyModal";
import SuggestionCard from "@/components/SuggestionCard";
import { getSuggestions } from "@/lib/api";
import type { Message } from "@/types";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    try {
      const response = await getSuggestions(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Here are ${response.suggestions.length} delicious suggestions for you:`,
        suggestions: response.suggestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Sorry, I couldn't get suggestions. Please make sure the backend is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.newChatButton}
          onClick={handleNewChat}
        >
          <span>+</span> New chat
        </button>

        <div className={styles.recentChats}>
          <div className={styles.recentChatTitle}>Recent</div>
          <div className={styles.chatItem}>Spicy Chicken Ideas</div>
          <div className={styles.chatItem}>Vegetarian Pasta</div>
          <div className={styles.chatItem}>Healthy Breakfast</div>
        </div>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.sidebarButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span>⚙️</span> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <div className={styles.modelSelector}>
            Food Genie <span style={{ fontSize: "0.8em", opacity: 0.6 }}>▼</span>
          </div>
          <div style={{ width: 24 }} /> {/* Spacer for centering if needed */}
        </header>

        <div className={styles.chatContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <h1 className={styles.greeting}>
                <span>Hello, Foodie</span>
              </h1>
              <p className={styles.subGreeting}>What are you craving today?</p>

              <div className={styles.suggestionsGrid}>
                <button
                  type="button"
                  className={styles.suggestionCard}
                  onClick={() => setInput("I want something spicy with chicken")}
                >
                  <span className={styles.suggestionIcon}>🌶️</span>
                  <span className={styles.suggestionText}>
                    Spicy chicken dishes for dinner
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.suggestionCard}
                  onClick={() => setInput("vegetarian Italian pasta")}
                >
                  <span className={styles.suggestionIcon}>🍝</span>
                  <span className={styles.suggestionText}>
                    Vegetarian Italian pasta recipes
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.suggestionCard}
                  onClick={() => setInput("healthy breakfast ideas")}
                >
                  <span className={styles.suggestionIcon}>🥗</span>
                  <span className={styles.suggestionText}>
                    Quick & healthy breakfast ideas
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.suggestionCard}
                  onClick={() => setInput("sweet desserts with chocolate")}
                >
                  <span className={styles.suggestionIcon}>🍫</span>
                  <span className={styles.suggestionText}>
                    Decadent chocolate desserts
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.messagesWrapper}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.type === "user"
                      ? styles.userMessage
                      : styles.assistantMessage
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className={`${styles.avatar} ${styles.assistantAvatar}`}>
                      ✦
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    {message.content}
                    {message.suggestions && (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }} >
                        {message.suggestions.map((suggestion, index) => (
                          <SuggestionCard
                            // biome-ignore lint/suspicious/noArrayIndexKey: temporary fix
                            key={index}
                            suggestion={suggestion}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {message.type === "user" && (
                    <div className={`${styles.avatar} ${styles.userAvatar}`}>
                      U
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={`${styles.avatar} ${styles.assistantAvatar}`}>
                    ✦
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.loader}>
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <button type="button" className={styles.actionButton}>
                <span>+</span>
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Food Genie..."
                className={styles.input}
                disabled={isLoading}
                rows={1}
              />
              <button type="button" className={styles.actionButton}>
                <span>🎤</span>
              </button>
              <button
                type="submit"
                className={`${styles.actionButton} ${styles.sendButton} ${
                  input.trim() ? styles.active : ""
                }`}
                disabled={!input.trim() || isLoading}
              >
                ➤
              </button>
            </form>
          </div>
          <div className={styles.disclaimer}>
            Food Genie can make mistakes. Consider checking important information.
          </div>
        </div>
      </main>

      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
