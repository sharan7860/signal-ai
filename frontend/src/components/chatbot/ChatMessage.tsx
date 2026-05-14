import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaRobot, FaUser } from "react-icons/fa";
import type { ChatMessageType } from "@/services/aiService";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[90%] items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/90 text-cyan-300 shadow-[0_0_22px_rgba(56,189,248,0.32)]">
          {isUser ? <FaUser className="h-5 w-5" /> : <FaRobot className="h-5 w-5" />}
        </div>

        <div
          className={`rounded-[28px] border border-[rgba(102,252,241,0.18)] p-4 shadow-[0_8px_30px_-16px_rgba(56,189,248,0.65)] ${
            isUser
              ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100"
              : "bg-[rgba(10,12,22,0.92)] text-slate-100"
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-[0.75rem] uppercase tracking-[0.24em] text-cyan-300/80">
            <span>{isUser ? "You" : "Trader AI"}</span>
            <span className="text-cyan-100/60">{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>

          <div className="max-w-none space-y-4 text-sm leading-7 text-slate-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-cyan-300 underline transition hover:text-cyan-100"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
                code: ({ node, className, children, ...props }) => {
                  const isInline = !node?.position || (node as any)?.tagName !== "pre";
                  const isBlock = String(children).includes("\n");
                  return (
                    <code
                      {...props}
                      className={`rounded-xl border border-[rgba(102,252,241,0.18)] bg-slate-900 px-1 py-0.5 text-[0.8rem] text-cyan-200 ${
                        !isBlock ? "" : "block overflow-x-auto"
                      } ${className ?? ""}`}
                    >
                      {children}
                    </code>
                  );
                },
                li: ({ children, ...props }) => <li className="ml-5 list-disc" {...props}>{children}</li>,
                p: ({ children, ...props }) => <p className="mt-0" {...props}>{children}</p>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
