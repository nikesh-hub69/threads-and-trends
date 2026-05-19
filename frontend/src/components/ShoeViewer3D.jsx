import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";

// Preload the model as soon as URL is known
function ShoeModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  const cloned = scene.clone(true);
  return <primitive object={cloned} scale={4.5} position={[0, -0.4, 0]} />;
}

function Loader() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", gap: "16px",
      background: "#0a0f1e",
    }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid rgba(56,189,248,0.15)",
          borderTop: "2px solid #38bdf8",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 8,
          border: "2px solid rgba(139,92,246,0.15)",
          borderTop: "2px solid #8b5cf6",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite reverse",
        }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
          Loading 3D Model
        </div>
        <div style={{ color: "#475569", fontSize: 12 }}>Preparing your experience...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorFallback({ onRetry }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", gap: "16px",
      background: "#0a0f1e", padding: "24px", textAlign: "center",
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>
        Could not load 3D model
      </div>
      <div style={{ color: "#475569", fontSize: 12, maxWidth: 260, lineHeight: 1.6 }}>
        The model file may be missing or unsupported. Make sure a .glb file is uploaded for this product.
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: "rgba(56,189,248,0.12)",
          border: "1px solid rgba(56,189,248,0.3)",
          color: "#38bdf8", cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// ✅ FIXED: Accept autoRotate prop and pass it to OrbitControls
function Scene({ modelUrl, autoRotate }) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", background: "#0a0f1e" }}
      camera={{ position: [0, 0.8, 2.8], fov: 40 }}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0f1e", 1);
      }}
    >
      <color attach="background" args={["#0a0f1e"]} />
      <ambientLight intensity={0.8} />
      <spotLight position={[6, 6, 6]} intensity={1.8} castShadow />
      <spotLight position={[-6, 4, -4]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, -2, 4]} intensity={0.3} color="#38bdf8" />
      <Suspense fallback={null}>
        <ShoeModel modelUrl={modelUrl} />
        <Environment preset="warehouse" background={false} />
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.7} scale={14} blur={3} far={2}
        />
      </Suspense>
      {/* ✅ FIXED: autoRotate is now controlled by the prop */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={5}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}

export default function ShoeViewer3D({ modelUrl = "/models/shoe.glb", onClose, shoeName = "Shoe" }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasError, setHasError]     = useState(false);
  const [key, setKey]               = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  // Small delay before mounting Canvas — prevents context loss from rapid mount
  useEffect(() => {
    const t = setTimeout(() => setCanvasReady(true), 80);
    return () => clearTimeout(t);
  }, [key]);

  // Preload the model URL
  useEffect(() => {
    if (modelUrl) {
      try { useGLTF.preload(modelUrl); } catch (_) {}
    }
  }, [modelUrl]);

  const handleRetry = () => {
    setHasError(false);
    setCanvasReady(false);
    setKey(k => k + 1);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "min(820px, 96vw)",
        height: "min(600px, 92vh)",
        background: "#0a0f1e",
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,189,248,0.05)",
        display: "flex", flexDirection: "column",
      }}>

        {/* TOP BAR */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>◈</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                3D View
              </div>
              <div style={{ color: "#475569", fontSize: 11 }}>{shoeName}</div>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 20, padding: "4px 12px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ color: "#86efac", fontSize: 11, fontWeight: 500 }}>100% Authentic</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", borderRadius: 10,
              width: 36, height: 36, cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* CANVAS AREA */}
        <div
          key={key}
          style={{ flex: 1, position: "relative", background: "#0a0f1e" }}
          onError={() => setHasError(true)}
        >
          {hasError ? (
            <ErrorFallback onRetry={handleRetry} />
          ) : !canvasReady ? (
            <Loader />
          ) : (
            <Suspense fallback={<Loader />}>
              {/* ✅ FIXED: Pass autoRotate to Scene */}
              <Scene modelUrl={modelUrl} autoRotate={autoRotate} />
            </Suspense>
          )}

          {/* Hint pill */}
          {!hasError && canvasReady && (
            <div style={{
              position: "absolute", bottom: 16, left: "50%",
              transform: "translateX(-50%)", pointerEvents: "none",
              display: "flex", gap: 20,
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "8px 20px",
              backdropFilter: "blur(8px)", whiteSpace: "nowrap",
            }}>
              {[["↻", "Drag to rotate"], ["⊕", "Scroll to zoom"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#38bdf8", fontSize: 14 }}>{icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          flexShrink: 0,
        }}>
          <span style={{ color: "#475569", fontSize: 12 }}>
            Click and drag to inspect every angle
          </span>
          <button
            onClick={() => setAutoRotate(r => !r)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 8, fontSize: 12,
              border: autoRotate
                ? "1px solid rgba(139,92,246,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              background: autoRotate
                ? "rgba(139,92,246,0.12)"
                : "rgba(255,255,255,0.03)",
              color: autoRotate ? "#a78bfa" : "#64748b",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 15 }}>⟳</span>
            {autoRotate ? "Stop rotation" : "Auto-rotate"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin   { to   { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}