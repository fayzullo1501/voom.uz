import React, { useState } from "react";
import { X, Search, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileChat = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("private");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-white px-6 flex flex-col">

      {/* ===== Top bar ===== */}
      <div className="container-wide flex items-center justify-between py-6">
        <h1 className="text-[24px] sm:text-[28px] font-semibold">
          Чат мессенджер
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Закрыть"
        >
          <X size={24} className="text-gray-700" />
        </button>
      </div>

      {/* ===== Chat wrapper (KEY FIX) ===== */}
      <div className="flex-1 flex justify-center pb-6">
        <div className="w-full max-w-[1400px] border border-gray-200 rounded-2xl overflow-hidden flex bg-white">

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="w-[340px] border-r border-gray-200 flex flex-col">

            {/* Search */}
            <div className="px-4 pt-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Поиск"
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-100 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-4 mt-4">
              <button
                onClick={() => setActiveTab("private")}
                className={`flex-1 py-2 rounded-lg text-sm transition ${
                  activeTab === "private"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Личные
              </button>
              <button
                onClick={() => setActiveTab("group")}
                className={`flex-1 py-2 rounded-lg text-sm transition ${
                  activeTab === "group"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Группы
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 mt-4">
              <div className="px-3 py-3 rounded-xl bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">БСА</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      UKA qale ketayapti hayot
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">11:52</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= CHAT AREA ================= */}
          <section className="flex-1 flex flex-col">

            {/* Chat header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="font-semibold">БСА</div>
              <div className="text-xs text-gray-500 mt-0.5">
                5 участников
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              {/* Date */}
              <div className="flex justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  27.10.2025
                </span>
              </div>

              {/* Incoming */}
              <div className="max-w-[460px]">
                <div className="text-xs text-gray-500 mb-1">
                  Dilshod Xudayberdiyev
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm inline-block">
                  Va alaykum assalom
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  12:03
                </div>
              </div>

              {/* Incoming */}
              <div className="max-w-[460px]">
                <div className="text-xs text-gray-500 mb-1">
                  Abbosxon Xodjayev
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm inline-block">
                  Hammaga hurmatli hamkasblar
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  14:59
                </div>
              </div>

              {/* Outgoing */}
              <div className="flex justify-end">
                <div className="max-w-[460px] text-right">
                  <div className="bg-[#6C63FF] text-white rounded-2xl px-4 py-2 text-sm inline-block">
                    Xa, hozircha kelishib olamiz 🙂
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    16:01
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите свое сообщение..."
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
              <button className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition">
                <Send size={18} className="text-white" />
              </button>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileChat;
