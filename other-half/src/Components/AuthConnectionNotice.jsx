const TONE_BY_STATE = {
  checking: {
    title: "Checking connection",
    containerClassName: "bg-[#F4EFE3] text-[#625D51]",
    buttonClassName: "border-[#D7CEBA] text-[#625D51]",
  },
  connected: {
    title: "Backend connected",
    containerClassName: "bg-[#EEF6E7] text-[#0F4A12]",
    buttonClassName: "border-[#C9DEB8] text-[#0F4A12]",
  },
  error: {
    title: "Backend unavailable",
    containerClassName: "bg-[#FFF1EE] text-[#A13A2C]",
    buttonClassName: "border-[#E6B7AD] text-[#A13A2C]",
  },
};

const AuthConnectionNotice = ({ status, onRetry, compact = false }) => {
  const tone = TONE_BY_STATE[status?.state] || TONE_BY_STATE.checking;

  return (
    <div
      className={`rounded-2xl px-4 py-3 ${
        compact ? "text-xs" : "text-sm"
      } ${tone.containerClassName}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{tone.title}</p>
          <p className={`${compact ? "mt-1 leading-5" : "mt-1 leading-6"}`}>
            {status?.message || "Checking backend connection..."}
          </p>
        </div>

        {status?.state === "error" ? (
          <button
            type="button"
            onClick={onRetry}
            className={`shrink-0 rounded-full border px-3 py-1.5 font-semibold transition hover:opacity-80 ${tone.buttonClassName}`}
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AuthConnectionNotice;
