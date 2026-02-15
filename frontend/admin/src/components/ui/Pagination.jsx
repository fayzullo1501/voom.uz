const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const delta = 2;
  const pages = [];

  const start = Math.max(2, page - delta);
  const end = Math.min(totalPages - 1, page + delta);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        onClick={() => onChange(1)}
        disabled={page === 1}
        className="p-2 hover:text-[#32BB78] disabled:opacity-30"
      >
        &laquo;
      </button>

      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 hover:text-[#32BB78] disabled:opacity-30"
      >
        &lsaquo;
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 rounded-xl text-[14px] transition ${
              page === p
                ? "bg-[#32BB78] text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 hover:text-[#32BB78] disabled:opacity-30"
      >
        &rsaquo;
      </button>

      <button
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className="p-2 hover:text-[#32BB78] disabled:opacity-30"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
