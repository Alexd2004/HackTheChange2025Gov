"use client";

import type { ReactNode } from "react";

export default function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-6 whitespace-pre-wrap ${
          isUser
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

function renderMarkdown(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  const lines = text.split(/\r?\n/);
  let listState:
    | { type: "ul" | "ol"; items: ReactNode[][]; key: string }
    | null = null;

  const flushList = () => {
    if (!listState) return;
    const { type, items, key } = listState;
    const list = items.map((item, index) => (
      <li key={`${key}-item-${index}`} className="mb-1 last:mb-0">
        {item}
      </li>
    ));

    if (type === "ul") {
      elements.push(
        <ul key={key} className="list-disc pl-5 text-sm text-gray-900">
          {list}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} className="list-decimal pl-5 text-sm text-gray-900">
          {list}
        </ol>
      );
    }

    listState = null;
  };

  lines.forEach((rawLine, lineIndex) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Support Markdown headings (#, ##, ###)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const size =
        level === 1
          ? "text-lg font-bold"
          : level === 2
          ? "text-base font-semibold"
          : "text-sm font-semibold text-gray-800";
      elements.push(
        <p key={`h-${lineIndex}`} className={`${size} mt-2 mb-1`}>
          {renderInline(text, `h-${lineIndex}`)}
        </p>
      );
      return;
    }

    // Support unordered and ordered lists
    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);

    if (unorderedMatch) {
      const content = unorderedMatch[1];
      if (!listState || listState.type !== "ul") {
        flushList();
        listState = { type: "ul", items: [], key: `ul-${lineIndex}` };
      }
      listState.items.push(
        renderInline(content, `${listState.key}-${listState.items.length}`)
      );
      return;
    }

    if (orderedMatch) {
      const content = orderedMatch[1];
      if (!listState || listState.type !== "ol") {
        flushList();
        listState = { type: "ol", items: [], key: `ol-${lineIndex}` };
      }
      listState.items.push(
        renderInline(content, `${listState.key}-${listState.items.length}`)
      );
      return;
    }

    // Fallback for standard paragraphs
    flushList();
    elements.push(
      <p key={`p-${lineIndex}`} className="mb-2 last:mb-0">
        {renderInline(trimmed, `p-${lineIndex}`)}
      </p>
    );
  });

  flushList();
  return elements.length > 0 ? elements : [text];
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*(?!\s)([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const slice = text.slice(lastIndex, match.index);
      nodes.push(
        <span key={`${keyPrefix}-text-${tokenIndex}-pre`}>{slice}</span>
      );
    }

    if (match[2] && match[3]) {
      // Markdown link
      const linkText = renderInline(match[2], `${keyPrefix}-link-${tokenIndex}`);
      nodes.push(
        <a
          key={`${keyPrefix}-link-${tokenIndex}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline underline-offset-2"
        >
          {linkText}
        </a>
      );
    } else if (match[4]) {
      // Bold emphasis
      nodes.push(
        <strong key={`${keyPrefix}-strong-${tokenIndex}`}>
          {renderInline(match[4], `${keyPrefix}-strong-${tokenIndex}`)}
        </strong>
      );
    } else if (match[5]) {
      // italic
      nodes.push(
        <em key={`${keyPrefix}-em-${tokenIndex}`}>
          {renderInline(match[5], `${keyPrefix}-em-${tokenIndex}`)}
        </em>
      );
    } else if (match[6]) {
      // Inline code
      nodes.push(
        <code
          key={`${keyPrefix}-code-${tokenIndex}`}
          className="rounded bg-gray-200 px-1 py-0.5 text-xs font-mono text-gray-800"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = pattern.lastIndex;
    tokenIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <span key={`${keyPrefix}-text-${tokenIndex}-post`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return nodes.length > 0 ? nodes : [text];
}
