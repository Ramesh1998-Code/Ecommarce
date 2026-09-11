import { useState, useEffect, useRef } from "react";

// ─── Social platform config ───────────────────────────────────────────────────
function buildShareUrls(productUrl, productText) {
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(productText + " " + productUrl)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(productText)}&url=${encodeURIComponent(productUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productText)}`,
  };
}

const PLATFORMS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    sub: "Send to chat",
    iconBg: "#E8F8EE",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.054 23.447a.5.5 0 00.609.61l5.737-1.499A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.52-5.189-1.428l-.371-.22-3.851 1.006 1.027-3.743-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "Twitter / X",
    sub: "Post a tweet",
    iconBg: "#E8F0FE",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    sub: "Share on feed",
    iconBg: "#E7EFFF",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796v8.437C19.612 23.095 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: "telegram",
    name: "Telegram",
    sub: "Send message",
    iconBg: "#E6F4FB",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#229ED9">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 13.26l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.993.299z"/>
      </svg>
    ),
  },
];

// ─── ShareIcon ────────────────────────────────────────────────────────────────
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="3" r="1.5"/>
      <circle cx="4" cy="8" r="1.5"/>
      <circle cx="12" cy="13" r="1.5"/>
      <path d="M5.5 7l5-3M5.5 9l5 3"/>
    </svg>
  );
}

// ─── ShareModal ───────────────────────────────────────────────────────────────
function ShareModal({ isOpen, onClose, productUrl, productText, onShared }) {
  const [sharedPlatforms, setSharedPlatforms] = useState({});
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef(null);
  const shareUrls = buildShareUrls(productUrl, productText);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handlePlatformShare(platform) {
    if (sharedPlatforms[platform.id]) return;
    window.open(shareUrls[platform.id], "_blank", "width=600,height=500");
    setSharedPlatforms(prev => ({ ...prev, [platform.id]: true }));
    onShared?.();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(productUrl);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = productUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    onShared?.();
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "0.5px solid #e0e0e0",
        padding: 20,
        width: "100%",
        maxWidth: 360,
        fontFamily: "system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#111" }}>Share this product</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "0.5px solid #e0e0e0", background: "#f5f5f5",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#666" strokeWidth="1.5">
              <path d="M2 2l8 8M10 2l-8 8"/>
            </svg>
          </button>
        </div>

        {/* Platforms grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {PLATFORMS.map((platform) => {
            const isShared = !!sharedPlatforms[platform.id];
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformShare(platform)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: isShared ? "0.5px solid #1D9E75" : "0.5px solid #e0e0e0",
                  background: isShared ? "#E1F5EE" : "#fff",
                  cursor: isShared ? "not-allowed" : "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: isShared ? "#9FE1CB" : platform.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <platform.Icon />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isShared ? "#0F6E56" : "#111" }}>
                    {platform.name}
                  </div>
                  <div style={{ fontSize: 11, color: isShared ? "#1D9E75" : "#888" }}>
                    {isShared ? "Shared!" : platform.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "0.5px solid #f0f0f0", margin: "0 0 16px" }} />

        {/* Copy link */}
        <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Copy link</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            readOnly
            value={productUrl}
            style={{
              flex: 1,
              padding: "8px 10px",
              fontSize: 12,
              borderRadius: 6,
              border: "0.5px solid #e0e0e0",
              background: "#f8f8f8",
              color: "#888",
              outline: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: copied ? "0.5px solid #1D9E75" : "0.5px solid #ddd",
              background: copied ? "#E1F5EE" : "#fff",
              fontSize: 12,
              fontWeight: 500,
              color: copied ? "#0F6E56" : "#111",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ProductShareButton ───────────────────────────────────────────────────────
// Drop this anywhere — it renders a Share button + the modal
export function ProductShareButton({ productUrl, productText, onShared }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  function handleShared() {
    setShareCount(c => c + 1);
    onShared?.();
  }


  

  return (
    <>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            border: "0.5px solid #ddd",
            background: "#fff",
            fontSize: 13,
            fontWeight: 500,
            color: "#111",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <ShareIcon />
          Share
        </button>
       
      </div>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productUrl={productUrl}
        productText={productText}
        onShared={handleShared}
      />
    </>
  );
}

// ─── Full ProductCard with Share built in ─────────────────────────────────────
export default function ProductCard({ product,productUrl,desc,title,prices }) {

    
  const {
    name = title,
    price = prices,
    url = productUrl,
    description = desc,
  } = product || {};

  const shareText = `Check out ${name} at ${price}!${description ? " " + description : ""}`;

  return (
    <div >
      
      {/* Info */}
      <div style={{ flex: 1 }}>
        {/* <div style={{ fontSize: 15, fontWeight: 500, color: "#111", marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>{price} · In stock</div> */}
        <ProductShareButton productUrl={url} productText={shareText} />
      </div>
    </div>
  );
}