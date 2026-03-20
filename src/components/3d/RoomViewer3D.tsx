import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Scene state interface ─── */
export interface SceneState {
  lighting: "morning" | "night" | "studio";
  sofaMaterial: "fabric" | "leather" | "linen";
  sofaColor: string;
  showAnnotations: boolean;
  autoRotate: boolean;
  cameraPreset: "overview" | "sofa-close" | "tv-area" | "window";
  layoutStyle: "standard" | "open" | "cozy";
  designStyle: "modern-minimal" | "japanese-wabi" | "nordic-warm";
}

const WALL_H = 2.8;
const ROOM_W = 6;
const ROOM_D = 5;

const PAL = {
  floor: "#f0ebe4",
  wall: "#faf8f5",
  wood: "#c9a87c",
  woodDark: "#a68b6b",
  glass: "#e2eef4",
  metal: "#b0b0b0",
  plant: "#6b8f60",
  plantPot: "#d4bf9a",
  rug: "#e8e0d5",
  lamp: "#f5efe6",
  lampGlow: "#fff8ed",
  tv: "#1a1a1a",
  pillow1: "#bcc8b4",
  pillow3: "#9aac8e",
  cushion: "#e0d5c6",
};

const STYLE_PALETTES: Record<string, Partial<typeof PAL>> = {
  "modern-minimal": {},
  "japanese-wabi": { floor: "#e6ddd0", wall: "#f5f0e8", wood: "#b8946a", rug: "#ddd4c4", pillow1: "#c4b8a0", pillow3: "#a09478" },
  "nordic-warm": { floor: "#f2ece4", wall: "#fdfbf8", wood: "#d4b896", rug: "#ece4d8", pillow1: "#a8bcc0", pillow3: "#8aaa9e" },
};

const LIGHTING: Record<string, { ambient: number; ambientColor: string; dir: number; dirColor: string; dirPos: [number, number, number]; lampInt: number; envInt: number }> = {
  morning: { ambient: 0.5, ambientColor: "#fff8f0", dir: 1.0, dirColor: "#fff6e8", dirPos: [4, 6, 3], lampInt: 0.2, envInt: 0.6 },
  night:   { ambient: 0.15, ambientColor: "#1a1824", dir: 0.1, dirColor: "#2a2040", dirPos: [2, 4, 1], lampInt: 1.2, envInt: 0.2 },
  studio:  { ambient: 0.65, ambientColor: "#ffffff", dir: 0.8, dirColor: "#ffffff", dirPos: [4, 6, 4], lampInt: 0.3, envInt: 0.8 },
};

/* ─── Simple furniture ─── */

const Sofa = ({ color, roughness }: { color: string; roughness: number }) => {
  const darker = useMemo(() => { const c = new THREE.Color(color); c.multiplyScalar(0.88); return "#" + c.getHexString(); }, [color]);
  return (
    <group position={[0, 0, 1.2]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[2.4, 0.36, 0.9]} radius={0.04} position={[0, 0.18, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[2.4, 0.5, 0.12]} radius={0.04} position={[0, 0.52, -0.39]} castShadow>
        <meshStandardMaterial color={darker} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.38, 0.9]} radius={0.03} position={[-1.2, 0.28, 0]} castShadow>
        <meshStandardMaterial color={darker} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.38, 0.9]} radius={0.03} position={[1.2, 0.28, 0]} castShadow>
        <meshStandardMaterial color={darker} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.32, 0.3, 0.1]} radius={0.06} position={[-0.85, 0.55, 0.1]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color={PAL.pillow1} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.26, 0.09]} radius={0.05} position={[0.8, 0.52, 0.1]} rotation={[-0.05, -0.15, -0.08]} castShadow>
        <meshStandardMaterial color={PAL.pillow3} roughness={0.9} />
      </RoundedBox>
    </group>
  );
};

const CoffeeTable = () => (
  <group position={[0, 0, 0]}>
    <RoundedBox args={[1.0, 0.025, 0.5]} radius={0.015} position={[0, 0.42, 0]} castShadow>
      <meshStandardMaterial color={PAL.glass} roughness={0.08} transparent opacity={0.5} metalness={0.15} />
    </RoundedBox>
    <RoundedBox args={[0.9, 0.03, 0.42]} radius={0.01} position={[0, 0.4, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.45} />
    </RoundedBox>
    {[[-0.35, 0.2, 0.15], [0.35, 0.2, 0.15], [-0.35, 0.2, -0.15], [0.35, 0.2, -0.15]].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.018, 0.015, 0.4]} />
        <meshStandardMaterial color={PAL.wood} roughness={0.45} />
      </mesh>
    ))}
  </group>
);

const TVWall = () => (
  <group position={[0, 0, -2]}>
    <RoundedBox args={[1.6, 0.3, 0.35]} radius={0.02} position={[0, 0.6, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.55} />
    </RoundedBox>
    <RoundedBox args={[1.3, 0.72, 0.03]} radius={0.01} position={[0, 1.35, 0]} castShadow>
      <meshStandardMaterial color={PAL.tv} roughness={0.25} metalness={0.6} />
    </RoundedBox>
    <mesh position={[0, 1.35, 0.02]}>
      <planeGeometry args={[1.24, 0.66]} />
      <meshStandardMaterial color="#1e1e1e" roughness={0.08} metalness={0.85} />
    </mesh>
  </group>
);

const FloorLamp = ({ intensity }: { intensity: number }) => (
  <group position={[-2.2, 0, 0.8]}>
    <mesh position={[0, 0.012, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.02]} />
      <meshStandardMaterial color={PAL.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.75, 0]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 1.45]} />
      <meshStandardMaterial color={PAL.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.14, 0.24, 12, 1, true]} />
      <meshStandardMaterial color={PAL.lamp} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[0, 1.45, 0]} intensity={intensity} color={PAL.lampGlow} distance={4} decay={2} />
  </group>
);

const Plant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.14, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.08, 0.28, 8]} />
      <meshStandardMaterial color={PAL.plantPot} roughness={0.75} />
    </mesh>
    <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.06}>
      {[[0, 0.5, 0, 0.15], [0.08, 0.6, 0.04, 0.12], [-0.06, 0.65, -0.04, 0.1]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 8, 6]} />
          <meshStandardMaterial color={PAL.plant} roughness={0.88} />
        </mesh>
      ))}
    </Float>
  </group>
);

const Annotation = ({ position, label }: { position: [number, number, number]; label: string }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
    </mesh>
    <Text position={[0, 0.12, 0]} fontSize={0.075} color="#3b82f6" anchorX="center" anchorY="bottom" outlineWidth={0.005} outlineColor="#ffffff">
      {label}
    </Text>
  </group>
);

const CameraRig = ({ autoRotate }: { autoRotate: boolean }) => {
  const { camera } = useThree();
  const angle = useRef(0);
  useFrame((_, delta) => {
    if (!autoRotate) return;
    angle.current += delta * 0.12;
    const r = 7;
    camera.position.x = Math.sin(angle.current) * r;
    camera.position.z = Math.cos(angle.current) * r;
    camera.position.y = 4;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
};

/* ─── Main scene: single living room ─── */
const RoomScene = ({ sceneState }: { sceneState: SceneState }) => {
  const light = LIGHTING[sceneState.lighting] || LIGHTING.morning;
  const sofaRoughness = sceneState.sofaMaterial === "leather" ? 0.35 : sceneState.sofaMaterial === "linen" ? 0.95 : 0.82;
  const stylePal = { ...PAL, ...(STYLE_PALETTES[sceneState.designStyle] || {}) };

  return (
    <>
      <ambientLight intensity={light.ambient} color={light.ambientColor} />
      <directionalLight
        position={light.dirPos} intensity={light.dir} color={light.dirColor}
        castShadow shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15} shadow-camera-left={-5} shadow-camera-right={5}
        shadow-camera-top={5} shadow-camera-bottom={-5}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color={stylePal.floor} roughness={0.65} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.3]} receiveShadow>
        <planeGeometry args={[3, 2.2]} />
        <meshStandardMaterial color={stylePal.rug} roughness={0.95} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, WALL_H / 2, -ROOM_D / 2]} receiveShadow>
        <planeGeometry args={[ROOM_W, WALL_H]} />
        <meshStandardMaterial color={stylePal.wall} roughness={0.9} />
      </mesh>
      <mesh position={[-ROOM_W / 2, WALL_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, WALL_H]} />
        <meshStandardMaterial color={stylePal.wall} roughness={0.9} />
      </mesh>
      <mesh position={[ROOM_W / 2, WALL_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, WALL_H]} />
        <meshStandardMaterial color={stylePal.wall} roughness={0.9} />
      </mesh>

      {/* Window light */}
      <mesh position={[ROOM_W / 2 - 0.01, WALL_H / 2 + 0.2, -0.3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshStandardMaterial color="#faf8f4" emissive={sceneState.lighting === "night" ? "#0a0818" : "#fff8ee"} emissiveIntensity={sceneState.lighting === "night" ? 0.02 : 0.35} />
      </mesh>

      {/* Furniture */}
      <Sofa color={sceneState.sofaColor} roughness={sofaRoughness} />
      <CoffeeTable />
      <TVWall />
      <FloorLamp intensity={light.lampInt} />
      <Plant position={[2.2, 0, 1.5]} />
      <Plant position={[-2.2, 0, -1.5]} />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.25} scale={10} blur={2} />

      {sceneState.showAnnotations && (
        <>
          <Annotation position={[0, 0.9, 1.2]} label="沙发 ¥4,280" />
          <Annotation position={[0, 0.6, 0]} label="茶几 ¥1,680" />
          <Annotation position={[0, 1.2, -2]} label="电视柜 ¥2,560" />
          <Annotation position={[-2.2, 1.7, 0.8]} label="落地灯 ¥2,300" />
        </>
      )}
    </>
  );
};

/* ─── Exported Viewer ─── */
interface RoomViewer3DProps {
  className?: string;
  sceneState: SceneState;
  onSceneStateChange: (state: SceneState) => void;
}

const RoomViewer3D = ({ className, sceneState, onSceneStateChange }: RoomViewer3DProps) => (
  <div className={`relative ${className ?? ""}`} style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #efebe6 100%)" }}>
    <Canvas
      shadows
      camera={{ position: [5, 4, 6], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#f8f6f3"]} />
      <fog attach="fog" args={["#f8f6f3", 12, 25]} />
      <Suspense fallback={null}>
        <RoomScene sceneState={sceneState} />
        <CameraRig autoRotate={sceneState.autoRotate} />
        <OrbitControls
          enablePan
          enableZoom
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.2}
          target={[0, 0.5, 0]}
          onStart={() => onSceneStateChange({ ...sceneState, autoRotate: false })}
        />
        <Environment preset="apartment" environmentIntensity={light?.envInt ?? 0.6} />
      </Suspense>
    </Canvas>
  </div>
);

// Need light in scope for the component — use a fallback
const light = LIGHTING.morning;

export default RoomViewer3D;
