// src/components/ui/Checkbox.jsx
const Checkbox = ({ checked = false, onChange, disabled = false }) => {
  return (
    <label className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only peer"
      />

      <div className="w-5 h-5 rounded-md border border-gray-400 flex items-center justify-center transition peer-checked:bg-[#32BB78] peer-checked:border-[#32BB78]">
        <svg
          className="w-3.5 h-3.5 text-white transition peer-checked:opacity-100 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </label>
  );
};

export default Checkbox;
