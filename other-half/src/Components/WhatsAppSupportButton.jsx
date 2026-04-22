import { FaWhatsapp } from "react-icons/fa";

const rawWhatsappPhone = String(import.meta.env.VITE_WHATSAPP_PHONE || "");
const whatsappPhone = rawWhatsappPhone.replace(/\D/g, "");
const whatsappMessage = encodeURIComponent(
  String(
    import.meta.env.VITE_WHATSAPP_MESSAGE ||
      "Hi PetPlus, I have a question about dosage, ingredients, or picking the right routine for my dog."
  )
);

const WhatsAppSupportButton = () => {
  if (!whatsappPhone) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with PetPlus on WhatsApp"
      className="fixed bottom-5 left-4 z-[85] inline-flex items-center gap-3 rounded-full border border-[#CDE3BF] bg-white px-4 py-3 text-[#1A1A1A] shadow-[0_24px_80px_rgba(34,30,18,0.16)] transition hover:-translate-y-0.5 md:bottom-6 md:left-6"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1FAF38] text-white">
        <FaWhatsapp size={24} />
      </span>
      <span className="hidden sm:block">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4A12]">
          Quick support
        </span>
        <span className="block text-sm font-semibold">Chat on WhatsApp</span>
      </span>
    </a>
  );
};

export default WhatsAppSupportButton;

