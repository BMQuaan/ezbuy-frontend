"use client";
/* eslint-disable */

import React, {
  useCallback,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import ProductCard from "@/components/product/ProductCard";
import { ProductClient } from "@/features/products/types";
import HScroll from "@/components/common/HScroll";
// import api from "@/lib/api/api";
import { axiosInstance } from "@/utils/axiosInstance";
import { notify } from "@/lib/notification/notistack";

type BotTextMsg = { id: string; role: "bot"; type: "text"; text: string };
type UserImageMsg = {
  id: string;
  role: "user";
  type: "image";
  previewUrl: string;
};
type BotResultsMsg = {
  id: string;
  role: "bot";
  type: "results";
  products: ProductClient[];
  predictedCategoryName?: string;
};
type BotTypingMsg = { id: string; role: "bot"; type: "typing" };
type ChatMsg = BotTextMsg | UserImageMsg | BotResultsMsg | BotTypingMsg;

type SearchState = "idle" | "preview" | "loading" | "done" | "error";

type User = {
  fullName: string;
  imageUrl: string | null;
  role: string;
  email: string;
};
/* ===================== Main Chatbot ===================== */

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<SearchState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    load();
    window.addEventListener("auth:changed", load);
    return () => window.removeEventListener("auth:changed", load);
  }, []);

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "bot",
      type: "text",
      text:
        "Hi! I’m the EZBuy Visual Assistant 👋\n" +
        "Upload a product image and I’ll suggest the most similar products.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const onPick = () => inputRef.current?.click();

  const resetAll = useCallback(() => {
    setFile(null);
    setErrorMsg("");
    setState("idle");
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "bot",
        type: "text",
        text:
          "Hi! I’m the EZBuy Visual Assistant 👋\n" +
          "Upload a product image and I’ll suggest the most similar products.",
      },
    ]);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    resetAll();
  }, [resetAll]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (jpg/png/webp…).");
      setState("error");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (f.size > MAX_SIZE) {
      notify("File must be smaller than 5MB", { variant: "warning" });
      return;
    }

    const url = URL.createObjectURL(f);
    setFile(f);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", type: "image", previewUrl: url },
    ]);

    setState("preview"); // 1. Đổi state để ẩn UploadBubble
    doSearch(f);
  };

  

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const doSearch = async (newFile?: File) => {
    const fileToUpload = newFile || file;
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      setState("loading");
      setErrorMsg("");

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", type: "typing" },
      ]);
      scrollToBottom();

      const res = await axiosInstance.post("/search/by-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const products = res.data.data.products;
      const predicted = res.data.data.predictedCategoryName;
      // setResults(products);
      setState("done");

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.type !== "typing");
        return [
          ...withoutTyping,
          {
            id: crypto.randomUUID(),
            role: "bot",
            type: "results",
            products: products,
            predictedCategoryName: predicted,
          },
        ];
      });
      scrollToBottom();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setState("error");
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.type !== "typing");
        return [
          ...withoutTyping,
          {
            id: crypto.randomUUID(),
            role: "bot",
            type: "text",
            text: "Sorry, something went wrong while processing the image. Please try again.",
          },
        ];
      });
      scrollToBottom();
    }
  };

  if (user && user.role === "ADMIN") return null;

  return (
    <div className="fixed bottom-8 right-5 z-50">
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="relative w-14 h-14 flex items-center justify-center text-white rounded-full 
                     shadow-[0_0_10px_3px_rgba(59,130,246,0.7)]
                     hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.9)]
                     transition cursor-pointer overflow-hidden bg-primary"
          aria-label="Open EZBuy chatbot"
        >
          <Image alt="chatbot" src="/images/chatbot/chatbot.jpg" fill />
        </button>
      )}

      {/* Chatbot panel */}
      {open && (
        <div className="w-[22rem] sm:w-[32rem] h-[75vh] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-primary text-white">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/20">
                <Image
                  src="/images/chatbot/chatbot.jpg"
                  alt="bot"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="font-semibold text-sm">EZBuy Chatbot</h2>
            </div>
            <button
              className="cursor-pointer"
              onClick={onClose}
              aria-label="Close"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Chat messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"
          >
            {state === "idle" && (
              <UploadBubble
                onDrop={onDrop}
                onDragOver={onDragOver}
                onPick={onPick}
                onChange={onInputChange}
                ref={inputRef}
              />
            )}

            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} />
            ))}
          </div>

          {/* Footer controls */}
          <div className="border-t bg-white px-3 py-2">
            <div className="flex items-center gap-2 justify-between">
              <div className="text-[11px] text-gray-500 hidden sm:block">
                JPG/PNG/WebP • Processed locally in your browser
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3 py-2 text-sm rounded-md bg-primary text-white disabled:opacity-50 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
            {errorMsg && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== UploadBubble (forwardRef) ===================== */

type UploadBubbleProps = {
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onPick: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const UploadBubble = forwardRef<HTMLInputElement, UploadBubbleProps>(
  ({ onDrop, onDragOver, onPick, onChange }, ref) => (
    <div className="flex items-start gap-2">
      <Avatar />
      <div className="max-w-[80%]">
        <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">
          <p className="text-sm text-gray-800">
            Drop a product image here and I’ll find similar products for you 📸
          </p>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="mt-2 border-2 border-dashed rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center text-center"
          >
            <FaImage className="mb-2" />
            <p className="text-sm text-gray-600">Drag & drop, or</p>
            <div className="mt-3 flex gap-2">
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onChange}
              />
              <button
                type="button"
                onClick={onPick}
                className="px-3 py-2 text-sm rounded-md border bg-white hover:bg-gray-100 cursor-pointer"
              >
                Choose file
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">Up to ~5MB</p>
          </div>
        </div>
      </div>
    </div>
  )
);
UploadBubble.displayName = "UploadBubble";

/* ===================== ChatBubble ===================== */

function ChatBubble({ msg }: { msg: ChatMsg }) {
  if (msg.type === "text" && msg.role === "bot") {
    return (
      <div className="flex items-start gap-2">
        <Avatar />
        <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm max-w-[80%] whitespace-pre-line text-sm text-gray-800">
          {msg.text}
        </div>
      </div>
    );
  }

  if (msg.type === "typing") {
    return (
      <div className="flex items-start gap-2">
        <Avatar />
        <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm max-w-[70%]">
          <TypingDots />
        </div>
      </div>
    );
  }

  if (msg.type === "image" && msg.role === "user") {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div className="bg-primary text-white rounded-2xl px-3 py-2 shadow-sm max-w-[80%]">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={msg.previewUrl}
              alt="user-upload"
              width={260}
              height={180}
              className="object-contain w-full max-h-56"
            />
          </div>
          <div className="mt-1 text-[11px] text-white/80 text-right">You</div>
        </div>
      </div>
    );
  }

  if (msg.type === "results" && msg.role === "bot") {
    return (
      <div className="flex items-start gap-2">
        <Avatar />
        <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm max-w-full">
          <div className="text-sm text-gray-800 mb-1">
            Here are my suggestions
            {msg.predictedCategoryName
              ? ` in ${msg.predictedCategoryName}:`
              : ":"}
          </div>
          <div className="w-[18rem] sm:w-[26rem]">
            <HScroll step={300}>
              {msg.products.map((p) => (
                <div key={p.id} className="w-64">
                  <ProductCard {...p} />
                </div>
              ))}
            </HScroll>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ===================== Avatar & TypingDots ===================== */

function Avatar() {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
      <Image
        src="/images/chatbot/chatbot.jpg"
        alt="bot"
        fill
        className="object-cover"
      />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}
