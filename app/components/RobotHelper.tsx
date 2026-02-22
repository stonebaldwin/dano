"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  actions?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};

const SESSION_KEY = "robot_helper_seen_v1";
const PHONE_DIAL = siteConfig.phone.replace(/\D/g, "");

const quickPrompts = [
  "Buying a home",
  "Refinancing options",
  "Current rates",
  "Documents needed",
  "Talk to a person"
];

function buildHandoffMessage(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "bot",
    text: "I can connect you with a real person right now.",
    actions: [
      { label: `Call ${siteConfig.phone}`, href: `tel:${PHONE_DIAL}` },
      { label: `Email ${siteConfig.email}`, href: `mailto:${siteConfig.email}` },
      { label: "Schedule a call", href: "https://calendly.com/dopirhory-alcova/30min", external: true }
    ]
  };
}

function getBotReply(input: string): ChatMessage {
  const message = input.toLowerCase();

  if (message.includes("person") || message.includes("human") || message.includes("agent") || message.includes("call me")) {
    return buildHandoffMessage();
  }
  if (message.includes("buy") || message.includes("purchase") || message.includes("first time")) {
    return {
      id: crypto.randomUUID(),
      role: "bot",
      text: "For home purchases, focus on down payment, credit, and monthly payment range first. If you want, I can connect you now for a personalized plan.",
      actions: [{ label: "Talk to a person", href: "#handoff" }]
    };
  }
  if (message.includes("refi") || message.includes("refinance")) {
    return {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Refinancing decisions usually depend on your current rate, closing costs, and how long you will keep the home.",
      actions: [{ label: "Talk to a person", href: "#handoff" }]
    };
  }
  if (message.includes("rate") || message.includes("interest")) {
    return {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Rates change daily and depend on loan type, credit profile, and occupancy. I can connect you for an accurate quote.",
      actions: [{ label: "Talk to a person", href: "#handoff" }]
    };
  }
  if (message.includes("document") || message.includes("docs") || message.includes("paperwork")) {
    return {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Most applications start with pay stubs, W-2s, recent bank statements, tax returns, and photo ID."
    };
  }

  return {
    id: crypto.randomUUID(),
    role: "bot",
    text: "I can help with buying, refinancing, rates, documents, or connecting you with a person. Ask me one of those to start."
  };
}

export default function RobotHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "bot",
      text: "Hi, I am your mortgage helper. Ask me a question below."
    }
  ]);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
      if (!seen) {
        const timer = window.setTimeout(() => setIsOpen(true), 1200);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setIsOpen(true), 1200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  const persistSeen = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // no-op if storage is unavailable
    }
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed
    };
    const botReply = getBotReply(trimmed);
    setMessages((current) => [...current, userMessage, botReply]);
  };

  const handleClose = () => {
    persistSeen();
    setIsOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const renderedMessages = useMemo(() => messages.slice(-8), [messages]);

  useEffect(() => {
    if (!isOpen || !logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isOpen]);

  return (
    <div className="robot-helper-shell" aria-live="polite">
      {isOpen ? (
        <section className="robot-helper-panel" aria-label="Mortgage helper chat">
          <div className="robot-helper-header">
            <strong>Mortgage Helper</strong>
            <div className="robot-helper-header-actions">
              <button type="button" onClick={handleClose} aria-label="Minimize helper">
                -
              </button>
            </div>
          </div>
          <div className="robot-helper-body">
            <div ref={logRef} className="robot-chat-log">
              {renderedMessages.map((message) => (
                <div key={message.id} className={`robot-chat-row is-${message.role}`}>
                  <p className={`robot-chat-bubble is-${message.role}`}>{message.text}</p>
                  {message.actions?.length ? (
                    <div className="robot-helper-options">
                      {message.actions.map((action) => (
                        action.href === "#handoff" ? (
                          <button key={action.label} type="button" onClick={() => setMessages((current) => [...current, buildHandoffMessage()])}>
                            {action.label}
                          </button>
                        ) : (
                          <a
                            key={action.label}
                            className="robot-helper-action"
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noreferrer" : undefined}
                          >
                            {action.label}
                          </a>
                        )
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="robot-helper-label">Quick topics</p>
            <div className="robot-helper-quick">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <form className="robot-helper-input-row" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Type your question..."
                aria-label="Type your mortgage question"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="robot-helper-bubble"
          onClick={() => {
            setIsOpen(true);
            persistSeen();
          }}
          aria-label="Open mortgage helper"
        >
          <span>Ask Me</span>
        </button>
      )}
    </div>
  );
}
