"use client";

import { useEffect, useState } from "react";
import styles from "./ApiKeyModal.module.css";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved settings
      const savedProvider = localStorage.getItem("ai_provider") as
        | "openai"
        | "gemini"
        | null;
      const savedKey = localStorage.getItem(`${savedProvider}_api_key`) || "";

      if (savedProvider) {
        setProvider(savedProvider);
        setApiKey(savedKey);
      }
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem(`${provider}_api_key`, apiKey);
    setSaved(true);

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem("ai_provider");
    localStorage.removeItem("openai_api_key");
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setSaved(false);
  };

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: temporary fix
    <div
      className={styles.overlay}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2>⚙️ API Configuration</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <span className={styles.label}>AI Provider</span>
            <div className={styles.providerButtons}>
              <button
                type="button"
                className={`${styles.providerButton} ${
                  provider === "gemini" ? styles.active : ""
                }`}
                onClick={() => {
                  setProvider("gemini");
                  setApiKey(localStorage.getItem("gemini_api_key") || "");
                }}
              >
                <span className={styles.providerIcon}>✨</span>
                Google Gemini
              </button>
              <button
                type="button"
                className={`${styles.providerButton} ${
                  provider === "openai" ? styles.active : ""
                }`}
                onClick={() => {
                  setProvider("openai");
                  setApiKey(localStorage.getItem("openai_api_key") || "");
                }}
              >
                <span className={styles.providerIcon}>🤖</span>
                OpenAI
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="apiKey">
              {provider === "gemini" ? "Gemini" : "OpenAI"} API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider === "gemini" ? "Gemini" : "OpenAI"} API key`}
              className={styles.input}
            />
            <p className={styles.hint}>
              {provider === "gemini" ? (
                <>
                  Get your API key from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google AI Studio
                  </a>
                </>
              ) : (
                <>
                  Get your API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenAI Platform
                  </a>
                </>
              )}
            </p>
          </div>

          {saved && (
            <div className={styles.successMessage}>
              ✓ API key saved successfully!
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            Clear All
          </button>
          <div className={styles.footerButtons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!apiKey.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
