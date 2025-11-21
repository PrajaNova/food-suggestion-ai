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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Food Suggestion AI</span>
          </h1>
          <p className={styles.subtitle}>
            Powered by Gemini • Get personalized food recommendations
          </p>
        </div>
        <button
          type="button"
          className={styles.settingsButton}
          onClick={() => setIsModalOpen(true)}
          aria-label="API Settings"
        >
          ⚙️
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.chatContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🍽️</div>
              <h2>What would you like to eat?</h2>
              <p>
                Tell me about your cravings, available ingredients, or dietary
                preferences, and I'll suggest delicious options!
              </p>
              <div className={styles.suggestions}>
                <button
                  type="button"
                  onClick={() =>
                    setInput("I want something spicy with chicken")
                  }
                  className={styles.suggestionChip}
                >
                  🌶️ Spicy chicken dishes
                </button>
                <button
                  type="button"
                  onClick={() => setInput("vegetarian Italian pasta")}
                  className={styles.suggestionChip}
                >
                  🍝 Vegetarian Italian
                </button>
                <button
                  type="button"
                  onClick={() => setInput("healthy breakfast ideas")}
                  className={styles.suggestionChip}
                >
                  🥗 Healthy breakfast
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.type === "user"
                      ? styles.userMessage
                      : styles.assistantMessage
                  }`}
                >
                  {message.type === "user" ? (
                    <div className={styles.userBubble}>{message.content}</div>
                  ) : (
                    <div className={styles.assistantContent}>
                      <p className={styles.assistantText}>{message.content}</p>
                      {message.suggestions && (
                        <div className={styles.suggestions}>
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
                  )}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={styles.loader}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you craving today?"
            className={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? "⏳" : "✨"}
          </button>
        </form>
      </footer>

      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
