import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/layout/Header";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import ColorPlugin from "editorjs-text-color-plugin";
import Undo from "editorjs-undo";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const NewsCreate = () => {
  const instanceRef = useRef(null);
  const navigate = useNavigate();

  const [lang, setLang] = useState("ru");

    const [content, setContent] = useState({
        ru: null,
        uz: null,
        en: null
    });

    const [title, setTitle] = useState({
        ru: "",
        uz: "",
        en: ""
    });

  const changeLanguage = async (newLang) => {
    if (!instanceRef.current) return;

    const data = await instanceRef.current.save();

    const updatedContent = {
      ...content,
      [lang]: data
    };

    setContent(updatedContent);
    setLang(newLang);

    const newData = updatedContent[newLang];

    if (newData) {
      instanceRef.current.render(newData);
    } else {
      instanceRef.current.clear();
    }
  };

  useEffect(() => {
    if (instanceRef.current) return;

    const editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        placeholder: "Начните писать новость...",
        minHeight: 200,
        defaultBlock: "paragraph",

      onReady: () => {
        new Undo({ editor });
      },

      tools: {

        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2
          }
        },

        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
                preserveBlank: true
            }
        },

        list: List,

        checkList: {
          class: Checklist,
          inlineToolbar: true
        },

        image: {
          class: ImageTool,
          config: {
            uploader: {

              async uploadByFile(file) {

                const formData = new FormData();
                formData.append("image", file);

                const res = await fetch(`${API_URL}/api/admin/news/upload`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: formData
                });

                const data = await res.json();

                return data;

              },

              uploadByUrl(url) {
                return {
                  success: 1,
                  file: { url }
                };
              }

            }
          }
        },

        embed: Embed,

        table: Table,

        code: CodeTool,

        quote: Quote,

        delimiter: Delimiter,

        marker: Marker,

        inlineCode: InlineCode,

        textColor: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#000000",
              "#EF4444",
              "#F59E0B",
              "#10B981",
              "#3B82F6"
            ],
            defaultColor: "#000000",
            type: "text"
          }
        },

        backgroundColor: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#FEF3C7",
              "#DBEAFE",
              "#DCFCE7",
              "#FEE2E2"
            ],
            type: "background"
          }
        }

      }
    });

    instanceRef.current = editor;

    return () => {
      if (instanceRef.current && instanceRef.current.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };

  }, []);

  const handleSave = async () => {
    if (!title.ru && !title.uz && !title.en) {
      alert("Введите заголовок новости");
      return;
    }

    let data;

    try {
      data = await instanceRef.current.save();
    } catch (err) {
      alert("Ошибка редактора");
      return;
    }

    const finalContent = {
      ...content,
      [lang]: data
    };

    try {

      const res = await fetch(`${API_URL}/api/admin/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title,
          content: finalContent
        })
      });

      if (!res.ok) {
        throw new Error("Create failed");
      }

      const created = await res.json();

      console.log("CREATED NEWS", created);

      alert("Новость сохранена как черновик");

      navigate("/news");

    } catch (err) {

      console.error("CREATE NEWS ERROR", err);
      alert("Ошибка сохранения");

    }
  };

  return (
    <>
      <PageHeader title="Создание новости" />

      <div className="bg-white px-10 pt-8 pb-16 overflow-y-auto h-[calc(100vh-72px)]">

        <div className="flex items-center justify-between mb-6">

          <div className="flex gap-2">

            <button
              onClick={() => changeLanguage("ru")}
              className={`px-4 h-[36px] rounded-lg text-[14px] ${
                lang === "ru"
                  ? "bg-[#32BB78] text-white"
                  : "border border-gray-300"
              }`}
            >
              RU
            </button>

            <button
              onClick={() => changeLanguage("uz")}
              className={`px-4 h-[36px] rounded-lg text-[14px] ${
                lang === "uz"
                  ? "bg-[#32BB78] text-white"
                  : "border border-gray-300"
              }`}
            >
              UZ
            </button>

            <button
              onClick={() => changeLanguage("en")}
              className={`px-4 h-[36px] rounded-lg text-[14px] ${
                lang === "en"
                  ? "bg-[#32BB78] text-white"
                  : "border border-gray-300"
              }`}
            >
              EN
            </button>

          </div>

          <button
            onClick={handleSave}
            className="h-[40px] px-6 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition"
          >
            Сохранить
          </button>

        </div>

        <div className="max-w-[900px]">

            <input
                value={title[lang]}
                onChange={(e) =>
                setTitle(prev => ({
                    ...prev,
                    [lang]: e.target.value
                }))
                }
                placeholder="Введите заголовок новости..."
                className="w-full text-[32px] font-bold mb-6 outline-none border-b border-gray-200 pb-3 focus:border-[#32BB78]"
            />

            <div id="editorjs"></div>

        </div>

      </div>
    </>
  );
};

export default NewsCreate;