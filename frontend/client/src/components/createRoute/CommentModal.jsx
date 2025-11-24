import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const CommentModal = ({ isOpen, onClose, onSave, initialValue = "" }) => {
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setComment(initialValue || "");
      setTimeout(() => autoResize(), 20);
    }
  }, [isOpen, initialValue]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-[rgba(0,0,0,0.45)]
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-[22px] shadow-xl
          w-[90%] max-w-[650px]
          p-6 
          flex flex-col gap-4
          animate-[fadeIn_.2s_ease]

          max-h-[90vh] overflow-y-auto
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[20px] font-semibold">Комментарий к маршруту</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* TEXTAREA — авто-рост + ручной resize */}
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            autoResize();
          }}
          placeholder="Напишите комментарии попутчикам… например, не курить и т.д."
          className="
            w-full 
            bg-gray-100 rounded-xl
            px-4 py-3
            text-[15px] outline-none
            leading-relaxed

            min-h-[150px]
            resize-y             /* РУЧНОЙ РЕСАЙЗ */
            overflow-auto        /* разрешаем прокрутку при уменьшении */
          "
        />

        {/* BUTTON — НЕ на всю ширину */}
        <button
          onClick={() => {
            onSave(comment);
            onClose();
          }}
          className="
            bg-[#32BB78] text-white rounded-xl
            h-[48px] px-8 
            text-[16px] font-semibold
            hover:bg-[#2aa86e]
            self-start        /* фиксированная ширина — НЕ full */
            mt-2
          "
        >
          Сохранить
        </button>

        {/* ANIMATION */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CommentModal;
