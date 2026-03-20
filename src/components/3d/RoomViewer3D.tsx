import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Room dimensions ─── */
const ROOM_W = 5;
const ROOM_D = 5;
const ROOM_H = 2.8;

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

/* ─── Palette — bright, airy, premium ─── */
const PAL = {
  floor: "#f0ebe4",
  floorAlt: "#e8e0d5",
  wall: "#faf8f5",
  wallAccent: "#f5f1ec",
  wood: "#c9a87c",
  woodDark: "#a68b6b",
  glass: "#e2eef4",
  metal: "#b0b0b0",
  metalDark: "#8a8a8a",
  plant: "#6b8f60",
  plantDark: "#4a6a42",
  plantPot: "#d4bf9a",
  rug: "#e8e0d5",
  rugBorder: "#d8cfc0",
  lamp: "#f5efe6",
  lampGlow: "#fff8ed",
  tv: "#1a1a1a",
  pillow1: "#bcc8b4",
  pillow2: "#d4c4aa",
  pillow3: "#9aac8e",
  cushion: "#e0d5c6",
};

/* ─── Style palettes ─── */
const STYLE_PALETTES: Record<string, Partial<typeof PAL>> = {
  "modern-minimal": {},
  "japanese-wabi": {
    floor: "#e6ddd0", wall: "#f5f0e8", wood: "#b8946a", rug: "#ddd4c4",
    pillow1: "#c4b8a0", pillow3: "#a09478",
  },
  "nordic-warm": {
    floor: "#f2ece4", wall: "#fdfbf8", wood: "#d4b896", rug: "#ece4d8",
    pillow1: "#a8bcc0", pillow3: "#8aaa9e",
  },
};

/* ─── Lighting presets ─── */
const LIGHTING: Record<string, { ambient: number; ambientColor: string; dir: number; dirColor: string; dirPos: [number, number, number]; lampIntensity: number; envIntensity: number }> = {
  morning: { ambient: 0.5, ambientColor: "#fff8f0", dir: 1.0, dirColor: "#fff6e8", dirPos: [4, 6, 3], lampIntensity: 0.2, envIntensity: 0.6 },
  night: { ambient: 0.15, ambientColor: "#1a1824", dir: 0.1, dirColor: "#2a2040", dirPos: [2, 4, 1], lampIntensity: 1.4, envIntensity: 0.2 },
  studio: { ambient: 0.65, ambientColor: "#ffffff", dir: 0.8, dirColor: "#fff", dirPos: [3, 5, 4], lampIntensity: 0.3, envIntensity: 0.8 },
};

/* ─── Layout configs ─── */
const LAYOUTS: Record<string, { sofa: [number, number, number]; sofaRot: number; table: [number, number, number]; lamp: [number, number, number]; plant1: [number, number, number]; plant2: [number, number, number] }> = {
  standard: { sofa: [0.8, 0, 1.2], sofaRot: Math.PI, table: [0.8, 0, 0], lamp: [-1.5, 0, 0.8], plant1: [-1.8, 0, -1.5], plant2: [2.0, 0, 1.5] },
  open: { sofa: [0, 0, 1.5], sofaRot: Math.PI, table: [0, 0, 0.2], lamp: [-2.0, 0, 0.2], plant1: [-2.0, 0, -1.8], plant2: [2.2, 0, 1.8] },
  cozy: { sofa: [0.5, 0, 0.8], sofaRot: Math.PI * 0.92, table: [0.3, 0, -0.2], lamp: [-1.2, 0, 0.4], plant1: [-1.5, 0, -1.2], plant2: [1.8, 0, 1.2] },
};

/* ─── Components ─── */

const Floor = ({ color }: { color: string }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[ROOM_W, ROOM_D]} />
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.02} />
    </mesh>
    {/* Subtle floor border lines */}
    {[-2, -1, 0, 1, 2].map((x) => (
      <mesh key={`fx${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]}>
        <planeGeometry args={[0.005, ROOM_D]} />
        <meshStandardMaterial color="#d8d0c5" roughness={0.8} transparent opacity={0.3} />
      </mesh>
    ))}
  </group>
);

const Walls = ({ color, accentColor, lighting }: { color: string; accentColor: string; lighting: string }) => (
  <group>
    {/* Back wall */}
    <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} receiveShadow>
      <planeGeometry args={[ROOM_W, ROOM_H]} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
    {/* Left wall */}
    <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[ROOM_D, ROOM_H]} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
    {/* Right wall */}
    <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[ROOM_D, ROOM_H]} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
    {/* Window on right wall */}
    <mesh position={[ROOM_W / 2 - 0.01, ROOM_H / 2 + 0.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[1.8, 1.5]} />
      <meshStandardMaterial
        color="#faf8f4"
        emissive={lighting === "night" ? "#0a0818" : "#fff8ee"}
        emissiveIntensity={lighting === "night" ? 0.02 : 0.4}
        transparent
        opacity={0.95}
      />
    </mesh>
    {/* Baseboard */}
    <mesh position={[0, 0.04, -ROOM_D / 2 + 0.01]}>
      <boxGeometry args={[ROOM_W, 0.08, 0.02]} />
      <meshStandardMaterial color={accentColor} roughness={0.7} />
    </mesh>
  </group>
);

const Sofa = ({ color, roughness, position, rotation }: { color: string; roughness: number; position: [number, number, number]; rotation: number }) => {
  const cushionColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.9);
    return "#" + c.getHexString();
  }, [color]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <RoundedBox args={[2.8, 0.38, 0.95]} radius={0.05} position={[0, 0.19, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={roughness} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[2.8, 0.55, 0.15]} radius={0.05} position={[0, 0.55, -0.4]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      {/* Arms */}
      <RoundedBox args={[0.15, 0.42, 0.95]} radius={0.04} position={[-1.35, 0.3, 0]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.42, 0.95]} radius={0.04} position={[1.35, 0.3, 0]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      {/* Seat cushions */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <RoundedBox key={i} args={[0.65, 0.12, 0.72]} radius={0.04} position={[x, 0.44, 0.02]} castShadow>
          <meshStandardMaterial color={color} roughness={roughness + 0.05} />
        </RoundedBox>
      ))}
      {/* Pillows */}
      <RoundedBox args={[0.35, 0.35, 0.12]} radius={0.07} position={[-0.95, 0.6, 0.15]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color={PAL.pillow1} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.06} position={[0.9, 0.58, 0.15]} rotation={[-0.05, -0.15, -0.08]} castShadow>
        <meshStandardMaterial color={PAL.pillow3} roughness={0.9} />
      </RoundedBox>
      {/* Legs */}
      {[[-1.2, 0.04, 0.35], [1.2, 0.04, 0.35], [-1.2, 0.04, -0.35], [1.2, 0.04, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.08]} />
          <meshStandardMaterial color={PAL.metal} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
};

const CoffeeTable = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <RoundedBox args={[1.2, 0.025, 0.6]} radius={0.02} position={[0, 0.45, 0]} castShadow>
      <meshStandardMaterial color={PAL.glass} roughness={0.08} transparent opacity={0.55} metalness={0.15} />
    </RoundedBox>
    <RoundedBox args={[1.1, 0.035, 0.5]} radius={0.015} position={[0, 0.42, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.45} />
    </RoundedBox>
    {[[-0.45, 0.21, 0.18], [0.45, 0.21, 0.18], [-0.45, 0.21, -0.18], [0.45, 0.21, -0.18]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.022, 0.018, 0.42]} />
        <meshStandardMaterial color={PAL.wood} roughness={0.45} />
      </mesh>
    ))}
    <RoundedBox args={[0.9, 0.018, 0.35]} radius={0.01} position={[0, 0.15, 0]}>
      <meshStandardMaterial color={PAL.wood} roughness={0.5} />
    </RoundedBox>
    {/* Books on table */}
    <RoundedBox args={[0.2, 0.04, 0.15]} radius={0.005} position={[-0.25, 0.47, 0.1]} castShadow>
      <meshStandardMaterial color="#e0d5c8" roughness={0.9} />
    </RoundedBox>
    <RoundedBox args={[0.18, 0.03, 0.13]} radius={0.005} position={[-0.24, 0.5, 0.11]} rotation={[0, 0.1, 0]} castShadow>
      <meshStandardMaterial color={PAL.pillow3} roughness={0.9} />
    </RoundedBox>
  </group>
);

const TVCabinet = () => (
  <group position={[0.8, 0, -2.1]}>
    <RoundedBox args={[1.8, 0.32, 0.38]} radius={0.025} position={[0, 0.8, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.55} />
    </RoundedBox>
    {[-0.45, 0, 0.45].map((x, i) => (
      <mesh key={i} position={[x, 0.8, 0.201]}>
        <planeGeometry args={[0.52, 0.26]} />
        <meshStandardMaterial color={PAL.woodDark} roughness={0.65} />
      </mesh>
    ))}
    <RoundedBox args={[1.4, 0.8, 0.035]} radius={0.012} position={[0, 1.5, -0.05]} castShadow>
      <meshStandardMaterial color={PAL.tv} roughness={0.25} metalness={0.6} />
    </RoundedBox>
    <mesh position={[0, 1.5, -0.02]}>
      <planeGeometry args={[1.32, 0.72]} />
      <meshStandardMaterial color="#1e1e1e" roughness={0.08} metalness={0.85} />
    </mesh>
  </group>
);

const FloorLamp = ({ intensity, position }: { intensity: number; position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.015, 0]} castShadow>
      <cylinderGeometry args={[0.14, 0.14, 0.025]} />
      <meshStandardMaterial color={PAL.metalDark} metalness={0.75} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 1.55]} />
      <meshStandardMaterial color={PAL.metal} metalness={0.75} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.6, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.16, 0.26, 16, 1, true]} />
      <meshStandardMaterial color={PAL.lamp} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
    <pointLight position={[0, 1.55, 0]} intensity={intensity} color={PAL.lampGlow} distance={4.5} decay={2} />
  </group>
);

const Plant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.15, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.1, 0.3, 8]} />
      <meshStandardMaterial color={PAL.plantPot} roughness={0.75} />
    </mesh>
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.08}>
      {[[0, 0.55, 0, 0.18], [0.1, 0.65, 0.05, 0.14], [-0.08, 0.7, -0.05, 0.12], [0.05, 0.45, 0.08, 0.11]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 8, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? PAL.plant : PAL.plantDark} roughness={0.88} />
        </mesh>
      ))}
    </Float>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.012, 0.008, 0.2]} />
      <meshStandardMaterial color={PAL.plantDark} roughness={0.8} />
    </mesh>
  </group>
);

const Rug = ({ color }: { color: string }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.004, 0.3]} receiveShadow>
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
    {/* Rug border */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.003, 0.3]}>
      <planeGeometry args={[3.08, 2.08]} />
      <meshStandardMaterial color={PAL.rugBorder} roughness={0.95} />
    </mesh>
  </group>
);

const WallArt = () => (
  <group position={[0.8, 1.8, -ROOM_D / 2 + 0.02]}>
    <RoundedBox args={[0.6, 0.45, 0.025]} radius={0.006} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.5} />
    </RoundedBox>
    <mesh position={[0, 0, 0.014]}>
      <planeGeometry args={[0.52, 0.37]} />
      <meshStandardMaterial color="#f0ebe4" roughness={0.8} />
    </mesh>
    <mesh position={[-0.1, 0.05, 0.016]}>
      <circleGeometry args={[0.08, 24]} />
      <meshStandardMaterial color={PAL.pillow1} roughness={0.85} />
    </mesh>
    <mesh position={[0.1, -0.03, 0.016]}>
      <circleGeometry args={[0.06, 24]} />
      <meshStandardMaterial color={PAL.pillow3} roughness={0.85} />
    </mesh>
  </group>
);

const Annotation = ({ position, label }: { position: [number, number, number]; label: string }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
    </mesh>
    <Text
      position={[0, 0.12, 0]}
      fontSize={0.075}
      color="#3b82f6"
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.006}
      outlineColor="#ffffff"
    >
      {label}
    </Text>
  </group>
);

/* ─── Camera rig ─── */
const CameraRig = ({ autoRotate }: { autoRotate: boolean }) => {
  const { camera } = useThree();
  const angle = useRef(0);

  useFrame((_, delta) => {
    if (!autoRotate) return;
    angle.current += delta * 0.12;
    const radius = 6;
    camera.position.x = Math.sin(angle.current) * radius;
    camera.position.z = Math.cos(angle.current) * radius;
    camera.position.y = 3.2;
    camera.lookAt(0.5, 0.5, 0);
  });

  return null;
};

/* ─── Main Scene ─── */
const RoomScene = ({ sceneState }: { sceneState: SceneState }) => {
  const light = LIGHTING[sceneState.lighting] || LIGHTING.morning;
  const sofaRoughness = sceneState.sofaMaterial === "leather" ? 0.35 : sceneState.sofaMaterial === "linen" ? 0.95 : 0.82;
  const layout = LAYOUTS[sceneState.layoutStyle] || LAYOUTS.standard;
  const stylePal = { ...PAL, ...(STYLE_PALETTES[sceneState.designStyle] || {}) };

  return (
    <>
      <ambientLight intensity={light.ambient} color={light.ambientColor} />
      <directionalLight
        position={light.dirPos}
        intensity={light.dir}
        color={light.dirColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      {/* Fill light */}
      <directionalLight
        position={[-3, 2, 1]}
        intensity={sceneState.lighting === "night" ? 0.03 : 0.25}
        color={sceneState.lighting === "night" ? "#1a1830" : "#f0e8dd"}
      />
      {/* Rim light for depth */}
      <directionalLight
        position={[0, 4, 5]}
        intensity={0.15}
        color="#ffffff"
      />

      <Floor color={stylePal.floor} />
      <Walls color={stylePal.wall} accentColor={stylePal.wallAccent} lighting={sceneState.lighting} />
      <Rug color={stylePal.rug} />

      <Sofa color={sceneState.sofaColor} roughness={sofaRoughness} position={layout.sofa} rotation={layout.sofaRot} />
      <CoffeeTable position={layout.table} />
      <TVCabinet />
      <FloorLamp intensity={light.lampIntensity} position={layout.lamp} />
      <Plant position={layout.plant1} />
      <Plant position={layout.plant2} />
      <WallArt />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.25} scale={12} blur={2.5} far={4} />

      {sceneState.showAnnotations && (
        <>
          <Annotation position={[layout.sofa[0], 0.9, layout.sofa[2]]} label="沙发 ¥4,280" />
          <Annotation position={[layout.table[0], 0.6, layout.table[2]]} label="茶几 ¥1,680" />
          <Annotation position={[0.8, 1.2, -2.1]} label="电视柜 ¥2,560" />
          <Annotation position={[layout.lamp[0], 1.7, layout.lamp[2]]} label="灯具 ¥2,300" />
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

const RoomViewer3D = ({ className, sceneState, onSceneStateChange }: RoomViewer3DProps) => {
  return (
    <div className={`relative ${className ?? ""}`} style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #efebe6 100%)" }}>
      <Canvas
        shadows
        camera={{ position: [4.5, 3.5, 5.5], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#f8f6f3"]} />
        <fog attach="fog" args={["#f8f6f3", 12, 22]} />
        <Suspense fallback={null}>
          <RoomScene sceneState={sceneState} />
          <CameraRig autoRotate={sceneState.autoRotate} />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={3}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={0.3}
            target={[0.5, 0.5, 0]}
            onStart={() => onSceneStateChange({ ...sceneState, autoRotate: false })}
          />
          <Environment preset="apartment" environmentIntensity={LIGHTING[sceneState.lighting]?.envIntensity ?? 0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomViewer3D;
