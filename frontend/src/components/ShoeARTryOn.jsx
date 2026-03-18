import { useEffect, useRef, useState, useCallback } from "react";

const STATUS = { IDLE: "idle", LOADING: "loading", READY: "ready", ERROR: "error" };

// ── QR Code generator using qrcode.js CDN ──────────────────────────────────
function QRModal({ url, shoeName, shoeImage, onClose, onOpenCamera }) {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = "";
        new window.QRCode(qrRef.current, {
          text: url,
          width: 180,
          height: 180,
          colorDark: "#ffffff",
          colorLight: "#0a0f1e",
          correctLevel: window.QRCode.CorrectLevel.M,
        });
      }
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch (_) {} };
  }, [url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.90)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(10px)",
      animation: "fadeIn 0.2s ease",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "min(520px, 94vw)",
        background: "#0a0f1e",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #f97316, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>👟</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>AR Try-On</div>
              <div style={{ color: "#475569", fontSize: 11 }}>{shoeName}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", borderRadius: 10, width: 36, height: 36,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 24px", textAlign: "center" }}>

          {/* Shoe thumbnail */}
          {shoeImage && (
            <div style={{
              width: 80, height: 80, borderRadius: 16, overflow: "hidden",
              margin: "0 auto 20px", border: "2px solid rgba(249,115,22,0.3)",
              background: "#111827",
            }}>
              <img src={shoeImage} alt={shoeName} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
            </div>
          )}

          <div style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
            Try on from your phone
          </div>
          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
            Scan the QR code with your phone camera to open AR try-on and see how the shoe looks on your feet.
          </div>

          {/* QR Code */}
          <div style={{
            display: "inline-block",
            padding: 16,
            background: "#0a0f1e",
            borderRadius: 16,
            border: "2px solid rgba(249,115,22,0.25)",
            marginBottom: 20,
            boxShadow: "0 0 30px rgba(249,115,22,0.08)",
          }}>
            <div ref={qrRef} style={{ lineHeight: 0 }} />
          </div>

          {/* Steps */}
          <div style={{
            display: "flex", gap: 12, marginBottom: 24, justifyContent: "center",
          }}>
            {[["1", "Open phone camera"], ["2", "Scan QR code"], ["3", "Allow camera access"]].map(([num, label]) => (
              <div key={num} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, maxWidth: 120,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fb923c", fontSize: 12, fontWeight: 700,
                }}>{num}</div>
                <div style={{ color: "#64748b", fontSize: 11, textAlign: "center", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#334155", fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Copy link */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b", fontSize: 12,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              textAlign: "left",
            }}>{url}</div>
            <button onClick={handleCopy} style={{
              padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)"}`,
              color: copied ? "#86efac" : "#fb923c",
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              {copied ? "✓ Copied" : "Copy link"}
            </button>
          </div>

          {/* Use on this device */}
          <button onClick={onOpenCamera} style={{
            width: "100%", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#f1f5f9"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            Use camera on this device instead
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
}

// ── Main AR Camera component ────────────────────────────────────────────────
function ARCamera({ shoeImage, shoeName, onClose }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const detectorRef = useRef(null);
  const imgRef      = useRef(null);

  const [status, setStatus]         = useState(STATUS.LOADING);
  const [errorMsg, setErrorMsg]     = useState("");
  const [footFound, setFootFound]   = useState(false);
  const [shoeSize, setShoeSize]     = useState(1.0);
  const [shoeOffset, setShoeOffset] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped]   = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = shoeImage;
    img.onload = () => { imgRef.current = img; };
    return () => { img.onload = null; };
  }, [shoeImage]);

  useEffect(() => {
    let cancelled = false;
    const loadScript = (src) => new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });

    const init = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js");
        if (cancelled) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;

        const video = videoRef.current;
        video.srcObject = stream;
        await new Promise(r => { video.onloadedmetadata = r; });
        await video.play();
        if (cancelled) return;

        const canvas = canvasRef.current;
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 480;

        const Pose = window.Pose;
        if (!Pose) throw new Error("MediaPipe not loaded");

        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.3,  // lower = easier to detect
  minTrackingConfidence: 0.3,   // lower = easier to track
});
        pose.onResults(onResults);
        detectorRef.current = pose;

        if (cancelled) return;
        setStatus(STATUS.READY);
        startLoop();
      } catch (err) {
        if (cancelled) return;
        if (err.name === "NotAllowedError") setErrorMsg("Camera permission denied. Please allow camera access.");
        else if (err.name === "NotFoundError") setErrorMsg("No camera found on this device.");
        else setErrorMsg("Could not start AR. " + err.message);
        setStatus(STATUS.ERROR);
      }
    };

    init();
    return () => { cancelled = true; stopAll(); };
  }, []);

  const startLoop = useCallback(() => {
    const loop = async () => {
      const video = videoRef.current, pose = detectorRef.current;
      if (!video || !pose || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop); return;
      }
      try { await pose.send({ image: video }); } catch (_) {}
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const onResults = useCallback((results) => {
    const canvas = canvasRef.current, video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.save();
    ctx.scale(-1, 1); ctx.translate(-W, 0);
    ctx.drawImage(video, 0, 0, W, H);
    ctx.restore();

    const lm = results.poseLandmarks;
    if (!lm) { setFootFound(false); return; }
    setFootFound(true);

    const feet = [];
    if (lm[27]?.visibility > 0.2) feet.push({ ankle: lm[27], heel: lm[29], toe: lm[31], side: "left" });
    if (lm[28]?.visibility > 0.2) feet.push({ ankle: lm[28], heel: lm[30], toe: lm[32], side: "right" });
    if (!feet.length) { setFootFound(false); return; }

    feet.forEach(({ ankle, heel, toe, side }) => {
      if (!ankle || !heel) return;
      const ax = (1 - ankle.x) * W, ay = ankle.y * H;
      const hx = (1 - heel.x)  * W, hy = heel.y * H;
      const tx = toe ? (1 - toe.x) * W : ax, ty = toe ? toe.y * H : ay;
      const footLen = Math.hypot(tx - hx, ty - hy) || 80;
      const shoeW = footLen * 2.2 * shoeSize;
      const shoeH = shoeW * 0.5;
      const angle = Math.atan2(ty - hy, tx - hx);
      const cx = ax + Math.cos(angle) * footLen * 0.3 + shoeOffset.x * (W / 100);
      const cy = ay + Math.sin(angle) * footLen * 0.3 + shoeOffset.y * (H / 100);

      if (imgRef.current) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + (isFlipped ? Math.PI : 0));
        if (side === "right") ctx.scale(1, -1);
        ctx.globalAlpha = 0.92;
        ctx.drawImage(imgRef.current, -shoeW / 2, -shoeH, shoeW, shoeH);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    });
  }, [shoeSize, shoeOffset, isFlipped]);

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (detectorRef.current) try { detectorRef.current.close(); } catch (_) {}
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.90)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(10px)", animation: "fadeIn 0.25s ease",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) { stopAll(); onClose(); } }}
    >
      <div style={{
        width: "min(860px, 97vw)", height: "min(640px, 95vh)",
        background: "#0a0f1e", borderRadius: 24, overflow: "hidden",
        display: "flex", flexDirection: "column",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
      }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #f97316, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>👟</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>AR Try-On</div>
              <div style={{ color: "#475569", fontSize: 11 }}>{shoeName}</div>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: footFound ? "rgba(34,197,94,0.1)" : status === STATUS.READY ? "rgba(251,191,36,0.1)" : "rgba(100,116,139,0.1)",
            border: `1px solid ${footFound ? "rgba(34,197,94,0.3)" : status === STATUS.READY ? "rgba(251,191,36,0.3)" : "rgba(100,116,139,0.2)"}`,
            borderRadius: 20, padding: "5px 14px", transition: "all 0.3s",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: footFound ? "#22c55e" : status === STATUS.READY ? "#fbbf24" : "#64748b",
              boxShadow: footFound ? "0 0 6px #22c55e" : "none",
            }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: footFound ? "#86efac" : status === STATUS.READY ? "#fde68a" : "#94a3b8" }}>
              {status === STATUS.LOADING ? "Starting camera..." :
               status === STATUS.ERROR   ? "Camera error" :
               footFound ? "Foot detected ✓" : "Point camera at your feet"}
            </span>
          </div>

          <button onClick={() => { stopAll(); onClose(); }} style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", borderRadius: 10, width: 36, height: 36,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: "relative", background: "#000", overflow: "hidden" }}>
          <video ref={videoRef} style={{ display: "none" }} playsInline muted autoPlay />
          <canvas ref={canvasRef} style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: status === STATUS.READY ? "block" : "none",
          }} />

          {status === STATUS.LOADING && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 56, height: 56 }}>
                <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(249,115,22,0.2)", borderTop: "2px solid #f97316", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ position: "absolute", inset: 8, border: "2px solid rgba(236,72,153,0.2)", borderTop: "2px solid #ec4899", borderRadius: "50%", animation: "spin 0.7s linear infinite reverse" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Starting AR Camera</div>
                <div style={{ color: "#475569", fontSize: 12 }}>Loading foot detection model...</div>
              </div>
            </div>
          )}

          {status === STATUS.ERROR && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48 }}>📷</div>
              <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600 }}>Camera Unavailable</div>
              <div style={{ color: "#64748b", fontSize: 13, maxWidth: 300, lineHeight: 1.7 }}>{errorMsg}</div>
            </div>
          )}

          {status === STATUS.READY && !footFound && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 80 }}>
              <div style={{
                background: "rgba(0,0,0,0.6)", border: "1px solid rgba(249,115,22,0.3)",
                borderRadius: 16, padding: "12px 24px", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>👣</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Point your camera at your feet</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", gap: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)", flexShrink: 0, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}>Shoe size</span>
            <input type="range" min="0.5" max="2.0" step="0.05" value={shoeSize}
              onChange={e => setShoeSize(parseFloat(e.target.value))}
              style={{ width: 100, accentColor: "#f97316" }} />
            <span style={{ color: "#94a3b8", fontSize: 12, minWidth: 28 }}>{shoeSize.toFixed(1)}×</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#475569", fontSize: 12 }}>Position</span>
            {[["↑", 0, -2], ["↓", 0, 2], ["←", -2, 0], ["→", 2, 0]].map(([label, dx, dy]) => (
              <button key={label} onClick={() => setShoeOffset(o => ({ x: o.x + dx, y: o.y + dy }))} style={{
                width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "pointer", fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{label}</button>
            ))}
            <button onClick={() => setShoeOffset({ x: 0, y: 0 })} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b", cursor: "pointer",
            }}>Reset</button>
          </div>
          <button onClick={() => setIsFlipped(f => !f)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            borderRadius: 8, fontSize: 12,
            border: isFlipped ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.08)",
            background: isFlipped ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)",
            color: isFlipped ? "#fb923c" : "#64748b", cursor: "pointer",
          }}>⇄ Flip shoe</button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes spin   { to   { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

// ── Main export: shows QR first, then camera if "use this device" ───────────
export default function ShoeARTryOn({ shoeImage, shoeName = "Shoe", onClose }) {
  const [showCamera, setShowCamera] = useState(false);

  // Build the AR URL — current page URL with ?ar=1 param
  const arUrl = typeof window !== "undefined"
  ? `${import.meta.env.VITE_NETWORK_URL || window.location.origin}${window.location.pathname}?ar=1`
  : "";

  // If opened on mobile (via QR), skip QR and go straight to camera
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ar") === "1") setShowCamera(true);
  }, []);

  if (showCamera) {
    return <ARCamera shoeImage={shoeImage} shoeName={shoeName} onClose={onClose} />;
  }

  return (
    <QRModal
      url={arUrl}
      shoeName={shoeName}
      shoeImage={shoeImage}
      onClose={onClose}
      onOpenCamera={() => setShowCamera(true)}
    />
  );
}