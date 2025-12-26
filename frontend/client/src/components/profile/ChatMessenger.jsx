import React, { useState } from "react";
import { X, Search, Plus, Smile, Paperclip, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar-placeholder.svg";
import privateIcon from "../../assets/user.svg";
import groupIcon from "../../assets/users.svg";

const ChatMessenger = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("private");

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 pt-6 pb-6 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end">
          <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      <h1 className="text-[28px] sm:text-[36px] font-semibold text-center mt-4 mb-6">Чат мессенджер</h1>

      <div className="flex flex-1 border border-gray-200 rounded-2xl overflow-hidden flex-col lg:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
          <div className="p-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 h-[40px] px-3 rounded-lg flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="Поиск" className="bg-transparent outline-none text-[14px] w-full" />
            </div>
            <button className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-4 mb-3">
            <div className="bg-gray-100 rounded-lg p-[2px] flex gap-[2px] h-[40px]">
              <button onClick={() => setTab("private")} className={`flex-1 h-full rounded-md flex items-center justify-center gap-2 text-[15px] font-semibold transition ${tab === "private" ? "bg-white text-black" : "text-gray-400"}`}>
                <img src={privateIcon} alt="" className={`w-5 h-5 ${tab === "private" ? "" : "opacity-40"}`} />
                Личные
              </button>
              <button onClick={() => setTab("group")} className={`flex-1 h-full rounded-md flex items-center justify-center gap-2 text-[15px] font-semibold transition ${tab === "group" ? "bg-white text-black" : "text-gray-400"}`}>
                <img src={groupIcon} alt="" className={`w-5 h-5 ${tab === "group" ? "" : "opacity-40"}`} />
                Группы
              </button>
            </div>
          </div>

          <div className="px-2">
            <div className="px-3 py-3 flex items-center gap-3 rounded-xl hover:bg-gray-100 cursor-pointer transition">
              <div className="relative">
                <img src={avatar} alt="" className="w-10 h-10 rounded-full" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#32BB78] border-2 border-white rounded-full" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium">Fayzullo Abdulazizov</div>
                <div className="text-[12px] text-gray-400">Че там...</div>
              </div>
              <div className="text-[12px] text-gray-400">11:52</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="relative">
              <img src={avatar} alt="" className="w-10 h-10 rounded-full" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#32BB78] border-2 border-white rounded-full" />
            </div>
            <span className="text-[16px] font-semibold">Fayzullo Abdulazizov</span>
          </div>

          <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto flex flex-col gap-4">
            <div className="flex items-end gap-2">
              <img src={avatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 rounded-[18px] rounded-bl-[6px] px-4 py-2 text-[14px] max-w-[320px]">Привет</div>
              <span className="text-[12px] text-gray-400">17:35</span>
            </div>

            <div className="flex items-end gap-2 justify-end">
              <span className="text-[12px] text-gray-400">17:35</span>
              <div className="bg-[#32BB78] text-white rounded-[18px] rounded-br-[6px] px-4 py-2 text-[14px] max-w-[320px]">Че там? все ок?</div>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-3">
            <input type="text" placeholder="Введите свое сообщение..." className="flex-1 h-[44px] px-4 rounded-xl border border-gray-200 text-[14px] outline-none" />
            <button className="w-10 h-10 flex items-center justify-center text-gray-400">
              <Smile className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-400">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="w-11 h-11 rounded-xl bg-[#32BB78] flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessenger;
