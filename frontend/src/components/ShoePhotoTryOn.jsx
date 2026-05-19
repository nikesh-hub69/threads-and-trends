import { useRef, useState, useCallback, useEffect } from "react";

export default function ShoePhotoTryOn({ shoeImage, shoeName = "Shoe", onClose }) {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [shoePos, setShoePos] = useState({ x: 150, y: 300 });
  const [shoeSize, setShoeSize] = useState(160);
  const [shoeRotation, setShoeRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setShoePos({ x: 150, y: 300 });
      setShoeSize(160);
      setShoeRotation(0);
      setIsFlipped(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    });
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setShoePos({
        x: Math.max(0, Math.min(r.width,  e.clientX - r.left - dragOffset.x)),
        y: Math.max(0, Math.min(r.height, e.clientY - r.top  - dragOffset.y)),
      });
    };
    const handleTouchMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const touch = e.touches[0];
      const r = containerRef.current.getBoundingClientRect();
      setShoePos({
        x: Math.max(0, Math.min(r.width,  touch.clientX - r.left - dragOffset.x)),
        y: Math.max(0, Math.min(r.height, touch.clientY - r.top  - dragOffset.y)),
      });
    };
    const handleUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, dragOffset]);

  const handleSave = () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const containerRect = containerRef.current.getBoundingClientRect();
      const scaleX = img.width  / containerRect.width;
      const scaleY = img.height / containerRect.height;
      const shoeImg = new Image();
      shoeImg.crossOrigin = "anonymous";
      shoeImg.src = shoeImage;
      shoeImg.onload = () => {
        ctx.save();
        ctx.translate(shoePos.x * scaleX, shoePos.y * scaleY);
        ctx.rotate((shoeRotation * Math.PI) / 180);
        ctx.scale(isFlipped ? -1 : 1, 1);
        const sw = shoeSize * scaleX;
        const sh = shoeSize * scaleY;
        ctx.drawImage(shoeImg, -sw / 2, -sh / 2, sw, sh);
        ctx.restore();
        const link = document.createElement("a");
        link.download = `threads-and-trends-${shoeName.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      };
    };
  };

  const rotateStep = (deg) => setShoeRotation(r => Math.max(-180, Math.min(180, r + deg)));

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)",
        animation: "ptFadeIn 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "min(980px, 97vw)",
        maxHeight: "95vh",
        background: "linear-gradient(145deg, #0f1117, #141821)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
            }}>🖼️</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>
                Photo Try-On
              </div>
              <div style={{ color: "#64748b", fontSize: 11, marginTop: 1 }}>{shoeName}</div>
            </div>
          </div>

          {saved && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 20, padding: "5px 14px",
              color: "#86efac", fontSize: 12, fontWeight: 600,
              animation: "ptFadeIn 0.2s ease",
            }}>
              ✓ Photo saved!
            </div>
          )}

          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", borderRadius: 10, width: 36, height: 36,
            cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >✕</button>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, overflow: "auto", padding: 18, display: "flex", gap: 16, minHeight: 0 }}>

          {!photo ? (
            <div style={{ flex: 1 }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                style={{
                  border: "2px dashed rgba(124,58,237,0.35)",
                  borderRadius: 16, padding: "64px 40px",
                  textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s",
                  background: "rgba(124,58,237,0.04)",
                  height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 14,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)";
                  e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                  e.currentTarget.style.background = "rgba(124,58,237,0.04)";
                }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(124,58,237,0.12)",
                  border: "2px solid rgba(124,58,237,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36,
                }}>📸</div>
                <div>
                  <div style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                    Upload Your Photo
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, maxWidth: 360, margin: "0 auto" }}>
                    Upload a full body photo, then drag and position the shoe on your feet. Best with a clear, well-lit photo.
                  </div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 32px", borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))",
                  border: "1px solid rgba(124,58,237,0.4)",
                  color: "#c4b5fd", fontSize: 14, fontWeight: 600,
                }}>
                  📁 Choose Photo
                </div>
                <div style={{ color: "#334155", fontSize: 12 }}>or drag & drop here</div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
              </div>
            </div>
          ) : (
            <>
              {/* Canvas */}
              <div
                ref={containerRef}
                style={{
                  flex: "1 1 0",
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  cursor: isDragging ? "grabbing" : "default",
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minHeight: 420,
                }}
              >
                <img
                  src={photo} alt="Your photo"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", userSelect: "none", pointerEvents: "none" }}
                />

                {/* Draggable shoe overlay */}
                <div
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  style={{
                    position: "absolute",
                    left: shoePos.x - shoeSize / 2,
                    top:  shoePos.y - shoeSize / 2,
                    width: shoeSize, height: shoeSize,
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none", userSelect: "none",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: -5, borderRadius: "50%",
                    border: isDragging ? "2px solid rgba(124,58,237,0.9)" : "2px dashed rgba(124,58,237,0.4)",
                    transition: "border 0.15s", pointerEvents: "none",
                  }} />
                  <img
                    src={shoeImage} alt={shoeName} draggable={false}
                    style={{
                      width: "100%", height: "100%", objectFit: "contain",
                      transform: `rotate(${shoeRotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                      filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.65))",
                      userSelect: "none", pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Hint pill */}
                <div style={{
                  position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "6px 16px",
                  color: "rgba(255,255,255,0.5)", fontSize: 11,
                  pointerEvents: "none", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  ✋ Drag the shoe onto your feet
                </div>
              </div>

              {/* Controls Panel */}
              <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>

                {/* Shoe preview */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: 12,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <img src={shoeImage} alt={shoeName} style={{
                    width: 48, height: 48, objectFit: "contain",
                    borderRadius: 8, background: "rgba(255,255,255,0.05)", padding: 4,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                      Selected Shoe
                    </div>
                    <div style={{ color: "#e2e8f0", fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {shoeName}
                    </div>
                  </div>
                </div>

                {/* Size slider */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Shoe Size</div>
                    <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700 }}>{shoeSize}px</div>
                  </div>
                  <input type="range" min="60" max="450" value={shoeSize}
                    onChange={e => setShoeSize(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ color: "#334155", fontSize: 10 }}>Small</span>
                    <span style={{ color: "#334155", fontSize: 10 }}>Large</span>
                  </div>
                </div>

                {/* Rotation */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Rotation</div>
                    <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700 }}>{shoeRotation}°</div>
                  </div>
                  <input type="range" min="-180" max="180" value={shoeRotation}
                    onChange={e => setShoeRotation(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }}
                  />
                  {/* Quick step buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginTop: 8 }}>
                    {[[-45, "↺45"], [-15, "−15"], [15, "+15"], [45, "↻45"]].map(([deg, label]) => (
                      <button key={deg} onClick={() => rotateStep(deg)} style={{
                        padding: "5px 0", borderRadius: 6, fontSize: 9, fontWeight: 600,
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        color: "#64748b", cursor: "pointer", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                      >{label}</button>
                    ))}
                  </div>
                  <button onClick={() => setShoeRotation(0)} style={{
                    width: "100%", marginTop: 6, padding: "4px 0", borderRadius: 6, fontSize: 10,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    color: "#475569", cursor: "pointer",
                  }}>Reset rotation</button>
                </div>

                {/* Flip + Reset */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setIsFlipped(f => !f)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    border: isFlipped ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: isFlipped ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.03)",
                    color: isFlipped ? "#c4b5fd" : "#64748b",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>⇄ Flip</button>
                  <button onClick={() => { setShoePos({ x: 150, y: 300 }); setShoeRotation(0); setShoeSize(160); setIsFlipped(false); }} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#64748b", cursor: "pointer",
                  }}>↺ Reset</button>
                </div>

                {/* Change photo */}
                <button onClick={() => setPhoto(null)} style={{
                  width: "100%", padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#64748b", cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  📸 Change Photo
                </button>

                <div style={{ flex: 1 }} />

                {/* Tips */}
                <div style={{
                  background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)",
                  borderRadius: 10, padding: "10px 12px",
                }}>
                  <div style={{ color: "#7c3aed", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                    Tips
                  </div>
                  <div style={{ color: "#64748b", fontSize: 10, lineHeight: 1.7 }}>
                    • Drag the shoe onto your feet<br />
                    • Slider to resize it<br />
                    • Rotate for the right angle<br />
                    • Flip for the other foot
                  </div>
                </div>

                {/* Save */}
                <button onClick={handleSave} style={{
                  width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  background: saved
                    ? "linear-gradient(135deg, #16a34a, #15803d)"
                    : "linear-gradient(135deg, #7c3aed, #9333ea)",
                  border: "none", color: "white", cursor: "pointer", transition: "all 0.3s",
                  boxShadow: saved ? "0 4px 20px rgba(22,163,74,0.4)" : "0 4px 20px rgba(124,58,237,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {saved ? "✓ Saved!" : "⬇ Save Photo"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes ptFadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
}