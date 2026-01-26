// src/components/users/UserFilesTab.jsx
import { useState } from "react";
import { FileText, EyeIcon, Check, X } from "lucide-react";
import { API_URL } from "../../config/api";

/* ===== ЛОАДЕР ===== */
const Loader = () => (
  <div className="h-[260px] flex flex-col items-center justify-center text-gray-500 gap-3">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    <div className="text-[15px]">Загрузка</div>
  </div>
);

/* ===== МОДАЛКА ОТКЛОНЕНИЯ ===== */
const ModalReject = ({ onClose, onSubmit }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-6">
        <div className="text-[18px] font-semibold mb-4">Отклонить файл</div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
          className="w-full h-[120px] border border-gray-300 rounded-lg p-3 text-[14px] resize-none"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="h-[40px] px-4 rounded-lg border">
            Отмена
          </button>
          <button
            onClick={() => onSubmit(comment)}
            className="h-[40px] px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
};

const UserFilesTab = ({ userId, files, loading, onRefresh }) => {
  const [rejectFile, setRejectFile] = useState(null);

  /* ===== ПОДТВЕРДИТЬ ===== */
  const approveFile = async () => {
    await fetch(`${API_URL}/api/admin/users/${userId}/photo/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    onRefresh();
  };

  /* ===== ОТКЛОНИТЬ ===== */
  const rejectFileSubmit = async (comment) => {
    await fetch(`${API_URL}/api/admin/users/${userId}/photo/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: comment,
      }),
    });
    setRejectFile(null);
    onRefresh();
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-2xl p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <div className="text-[18px] font-semibold flex items-center gap-2 mb-6">
        <FileText size={18} />
        Файлы пользователя
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-[50px]">№</th>
              <th className="px-4 py-3 text-left">Название</th>
              <th className="px-4 py-3 text-left w-[140px]">Статус</th>
              <th className="px-4 py-3 text-left w-[160px]">Дата</th>
              <th className="px-4 py-3 w-[120px]"></th>
            </tr>
          </thead>

          <tbody>
            {files?.length ? (
              files.map((f, i) => (
                <tr key={f._id} className="border-t">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{f.name}</td>

                  <td className="px-4 py-3">
                    {f.status === "approved" && (
                      <span className="text-green-600 font-medium">Подтверждён</span>
                    )}

                    {f.status === "pending" && (
                      <span className="text-orange-500 font-medium">На проверке</span>
                    )}

                    {f.status === "rejected" && (
                      <div className="text-red-600 font-medium">
                        Отклонён
                        {f.rejectionReason && (
                          <div className="text-[12px] text-red-500 mt-1">
                            Причина: {f.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>


                  <td className="px-4 py-3">
                    {new Date(f.createdAt).toLocaleDateString("ru-RU")}
                  </td>

                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                      <EyeIcon size={16} />
                    </a>

                    {f.status === "pending" && (
                      <>
                        <button
                          onClick={approveFile}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-green-600"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={() => setRejectFile(f)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  Файлы не загружены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rejectFile && (
        <ModalReject
          onClose={() => setRejectFile(null)}
          onSubmit={rejectFileSubmit}
        />
      )}
    </div>
  );
};

export default UserFilesTab;
