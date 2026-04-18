const toneClasses = {
  error: "bg-[#FFF1EE] text-[#A13A2C]",
  success: "bg-[#EEF6E7] text-[#0F4A12]",
  info: "bg-[#EFF5FF] text-[#24508B]",
  neutral: "bg-[#F6F1E7] text-[#4F4A3E]",
};

const AuthNotice = ({ type = "neutral", message, children }) => {
  if (!message && !children) {
    return null;
  }

  return (
    <div className={`rounded-2xl px-4 py-3 text-sm ${toneClasses[type] || toneClasses.neutral}`}>
      {message ? <p>{message}</p> : null}
      {children ? <div className={message ? "mt-3" : ""}>{children}</div> : null}
    </div>
  );
};

export default AuthNotice;
