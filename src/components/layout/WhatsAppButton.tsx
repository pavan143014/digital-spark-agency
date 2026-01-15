import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "919346884544";
  const message = "Hi! I'm interested in your digital marketing services. Can you help me?";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-xl animate-pulse-slow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      
      {/* Ping animation */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366]"></span>
      </span>
    </button>
  );
};

export default WhatsAppButton;
