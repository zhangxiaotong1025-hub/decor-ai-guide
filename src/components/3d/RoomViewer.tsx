import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Room dimensions (5m × 5m × 2.8m = 25㎡) ─── */
const ROOM_W = 5;
const ROOM_D = 5;
const ROOM_H = 2.8;

/* ─── Color palette ─── */
const COLORS = {
  floor: "#e8ddd3",       // warm wood
  wall: "#f5f0eb",        // warm white
  accent: "#d4c5b2",      // muted beige
  sofa: "#c9bfb0",        // oat color
  sofaCushion: "#b8ad9e",
  wood: "#b8946a",        // warm wood furniture
  woodDark: "#9a7b5a",
  glass: "#d4e5ec",
  metal: "#8a8a8a",
  plant: "#5a7a52",
  plantPot: "#c4a882",
  rug: "#d8cfc4",
  lamp: "#f0e8dd",
  lampLight: "#fff5e0",
  tv: "#1a1a1a",
  pillow1: "#a8b5a0",     // sage green
  pillow2: "#c9bfb0",     // matching
  pillow3: "#8a9a7a",     // deeper green
};

/* ─── Furniture Components ─── */

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[ROOM_W, ROOM_D]} />
    <meshStandardMaterial color={COLORS.floor} roughness={0.7} />
  </mesh>
);

const Walls = () => {
  const wallMat = useMemo(() => (
    <meshStandardMaterial color={COLORS.wall} roughness={0.9} side={THREE.DoubleSide} />
  ), []);

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        {wallMat}
      </mesh>
      {/* Left wall */}
      <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        {wallMat}
      </mesh>
      {/* Right wall (with window effect) */}
      <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color={COLORS.wall} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Window light panel (right wall) */}
      <mesh position={[ROOM_W / 2 - 0.01, ROOM_H / 2 + 0.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshStandardMaterial color="#f8f4ee" emissive="#fff8ee" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

const Sofa = () => (
  <group position={[0.8, 0, 1.2]} rotation={[0, Math.PI, 0]}>
    {/* Base */}
    <RoundedBox args={[2.8, 0.38, 0.95]} radius={0.04} position={[0, 0.19, 0]} castShadow>
      <meshStandardMaterial color={COLORS.sofa} roughness={0.85} />
    </RoundedBox>
    {/* Back */}
    <RoundedBox args={[2.8, 0.55, 0.15]} radius={0.04} position={[0, 0.55, -0.4]} castShadow>
      <meshStandardMaterial color={COLORS.sofaCushion} roughness={0.85} />
    </RoundedBox>
    {/* Armrest left */}
    <RoundedBox args={[0.15, 0.45, 0.95]} radius={0.04} position={[-1.35, 0.32, 0]} castShadow>
      <meshStandardMaterial color={COLORS.sofaCushion} roughness={0.85} />
    </RoundedBox>
    {/* Armrest right */}
    <RoundedBox args={[0.15, 0.45, 0.95]} radius={0.04} position={[1.35, 0.32, 0]} castShadow>
      <meshStandardMaterial color={COLORS.sofaCushion} roughness={0.85} />
    </RoundedBox>
    {/* Cushions */}
    {[-0.7, 0, 0.7].map((x, i) => (
      <RoundedBox key={i} args={[0.65, 0.12, 0.75]} radius={0.03} position={[x, 0.44, 0.02]} castShadow>
        <meshStandardMaterial color={COLORS.sofa} roughness={0.9} />
      </RoundedBox>
    ))}
    {/* Throw pillows */}
    <RoundedBox args={[0.35, 0.35, 0.12]} radius={0.06} position={[-0.95, 0.6, 0.15]} rotation={[0.1, 0.2, 0.1]} castShadow>
      <meshStandardMaterial color={COLORS.pillow1} roughness={0.9} />
    </RoundedBox>
    <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.05} position={[0.9, 0.58, 0.15]} rotation={[-0.05, -0.15, -0.08]} castShadow>
      <meshStandardMaterial color={COLORS.pillow3} roughness={0.9} />
    </RoundedBox>
    {/* Legs */}
    {[[-1.2, 0.04, 0.35], [1.2, 0.04, 0.35], [-1.2, 0.04, -0.35], [1.2, 0.04, -0.35]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.6} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

const CoffeeTable = () => (
  <group position={[0.8, 0, 0]}>
    {/* Top - glass */}
    <RoundedBox args={[1.2, 0.03, 0.6]} radius={0.02} position={[0, 0.45, 0]} castShadow>
      <meshStandardMaterial color={COLORS.glass} roughness={0.1} transparent opacity={0.6} metalness={0.1} />
    </RoundedBox>
    {/* Frame */}
    <RoundedBox args={[1.1, 0.04, 0.5]} radius={0.01} position={[0, 0.42, 0]} castShadow>
      <meshStandardMaterial color={COLORS.wood} roughness={0.5} />
    </RoundedBox>
    {/* Legs */}
    {[[-0.45, 0.21, 0.18], [0.45, 0.21, 0.18], [-0.45, 0.21, -0.18], [0.45, 0.21, -0.18]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.42]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.5} />
      </mesh>
    ))}
    {/* Lower shelf */}
    <RoundedBox args={[0.9, 0.02, 0.35]} radius={0.01} position={[0, 0.15, 0]}>
      <meshStandardMaterial color={COLORS.wood} roughness={0.5} />
    </RoundedBox>
  </group>
);

const TVCabinet = () => (
  <group position={[0.8, 0, -2.1]}>
    {/* Main body - floating */}
    <RoundedBox args={[1.8, 0.35, 0.4]} radius={0.02} position={[0, 0.8, 0]} castShadow>
      <meshStandardMaterial color={COLORS.wood} roughness={0.6} />
    </RoundedBox>
    {/* Drawer lines */}
    {[-0.45, 0, 0.45].map((x, i) => (
      <mesh key={i} position={[x, 0.8, 0.201]}>
        <planeGeometry args={[0.55, 0.28]} />
        <meshStandardMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>
    ))}
    {/* TV */}
    <RoundedBox args={[1.4, 0.8, 0.04]} radius={0.01} position={[0, 1.5, -0.05]} castShadow>
      <meshStandardMaterial color={COLORS.tv} roughness={0.3} metalness={0.5} />
    </RoundedBox>
    {/* TV screen */}
    <mesh position={[0, 1.5, -0.02]}>
      <planeGeometry args={[1.32, 0.72]} />
      <meshStandardMaterial color="#222" roughness={0.1} metalness={0.8} />
    </mesh>
  </group>
);

const FloorLamp = () => (
  <group position={[-1.5, 0, 0.8]}>
    {/* Base */}
    <mesh position={[0, 0.02, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 0.03]} />
      <meshStandardMaterial color={COLORS.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Pole */}
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.015, 0.015, 1.55]} />
      <meshStandardMaterial color={COLORS.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Shade */}
    <mesh position={[0, 1.6, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.18, 0.28, 16, 1, true]} />
      <meshStandardMaterial color={COLORS.lamp} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    {/* Light */}
    <pointLight position={[0, 1.55, 0]} intensity={0.5} color={COLORS.lampLight} distance={3} />
  </group>
);

const Plant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pot */}
    <mesh position={[0, 0.15, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.1, 0.3, 8]} />
      <meshStandardMaterial color={COLORS.plantPot} roughness={0.8} />
    </mesh>
    {/* Leaves - simple sphere clusters */}
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      {[
        [0, 0.55, 0, 0.2],
        [0.1, 0.65, 0.05, 0.15],
        [-0.08, 0.7, -0.05, 0.13],
        [0.05, 0.45, 0.08, 0.12],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 8, 6]} />
          <meshStandardMaterial color={COLORS.plant} roughness={0.9} />
        </mesh>
      ))}
    </Float>
    {/* Stem */}
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.015, 0.01, 0.2]} />
      <meshStandardMaterial color="#4a6a42" roughness={0.8} />
    </mesh>
  </group>
);

const Rug = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.005, 0.3]} receiveShadow>
    <planeGeometry args={[3, 2]} />
    <meshStandardMaterial color={COLORS.rug} roughness={0.95} />
  </mesh>
);

const WallArt = () => (
  <group position={[0.8, 1.8, -ROOM_D / 2 + 0.02]}>
    {/* Frame */}
    <RoundedBox args={[0.6, 0.45, 0.03]} radius={0.005} castShadow>
      <meshStandardMaterial color={COLORS.wood} roughness={0.5} />
    </RoundedBox>
    {/* Canvas */}
    <mesh position={[0, 0, 0.016]}>
      <planeGeometry args={[0.52, 0.37]} />
      <meshStandardMaterial color="#e8ddd3" roughness={0.8} />
    </mesh>
    {/* Abstract shapes */}
    <mesh position={[-0.1, 0.05, 0.02]}>
      <circleGeometry args={[0.08, 16]} />
      <meshStandardMaterial color={COLORS.pillow1} roughness={0.9} />
    </mesh>
    <mesh position={[0.1, -0.03, 0.02]}>
      <circleGeometry args={[0.06, 16]} />
      <meshStandardMaterial color={COLORS.pillow3} roughness={0.9} />
    </mesh>
  </group>
);

/* ─── Annotations ─── */
const Annotation = ({ position, label }: { position: [number, number, number]; label: string }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
    </mesh>
    <Text
      position={[0, 0.12, 0]}
      fontSize={0.08}
      color="#3b82f6"
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.005}
      outlineColor="#ffffff"
    >
      {label}
    </Text>
  </group>
);

/* ─── Camera auto-rotate ─── */
const CameraRig = ({ autoRotate }: { autoRotate: boolean }) => {
  const { camera } = useThree();
  const angle = useRef(0);

  useFrame((_, delta) => {
    if (!autoRotate) return;
    angle.current += delta * 0.15;
    const radius = 6;
    camera.position.x = Math.sin(angle.current) * radius;
    camera.position.z = Math.cos(angle.current) * radius;
    camera.position.y = 3;
    camera.lookAt(0.5, 0.5, 0);
  });

  return null;
};

/* ─── Main Scene ─── */
const RoomScene = ({ showAnnotations }: { showAnnotations: boolean }) => (
  <>
    {/* Lighting */}
    <ambientLight intensity={0.4} color="#fff5ee" />
    <directionalLight
      position={[3, 5, 2]}
      intensity={0.8}
      color="#fff8ee"
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-far={20}
      shadow-camera-left={-5}
      shadow-camera-right={5}
      shadow-camera-top={5}
      shadow-camera-bottom={-5}
    />
    {/* Warm fill from window side */}
    <directionalLight position={[4, 2, 0]} intensity={0.3} color="#ffeedd" />

    {/* Room */}
    <Floor />
    <Walls />
    <Rug />

    {/* Furniture */}
    <Sofa />
    <CoffeeTable />
    <TVCabinet />
    <FloorLamp />
    <Plant position={[-1.8, 0, -1.5]} />
    <Plant position={[2.0, 0, 1.5]} />
    <WallArt />

    {/* Contact shadows for grounding */}
    <ContactShadows position={[0, 0.001, 0]} opacity={0.3} scale={10} blur={2} />

    {/* Annotations */}
    {showAnnotations && (
      <>
        <Annotation position={[0.8, 0.9, 1.2]} label="沙发 ¥4,280" />
        <Annotation position={[0.8, 0.6, 0]} label="茶几 ¥1,680" />
        <Annotation position={[0.8, 1.2, -2.1]} label="电视柜 ¥2,560" />
        <Annotation position={[-1.5, 1.7, 0.8]} label="灯具 ¥2,300" />
        <Annotation position={[-1.8, 0.8, -1.5]} label="绿植" />
      </>
    )}
  </>
);

/* ─── Exported Viewer Component ─── */
interface RoomViewerProps {
  className?: string;
}

const RoomViewer = ({ className }: RoomViewerProps) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className={`relative bg-[#f5f0eb] ${className ?? ""}`}>
      <Canvas
        shadows
        camera={{ position: [4, 3.5, 5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <RoomScene showAnnotations={showAnnotations} />
          <CameraRig autoRotate={autoRotate} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={0.3}
            target={[0.5, 0.5, 0]}
            onStart={() => setAutoRotate(false)}
          />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium backdrop-blur-md transition-all ${
              showAnnotations
                ? "bg-primary/90 text-primary-foreground"
                : "bg-background/60 text-foreground/80"
            }`}
          >
            {showAnnotations ? "🏷️ 标注" : "🏷️ 标注"}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium backdrop-blur-md transition-all ${
              autoRotate
                ? "bg-primary/90 text-primary-foreground"
                : "bg-background/60 text-foreground/80"
            }`}
          >
            {autoRotate ? "⏸️ 暂停" : "▶️ 漫游"}
          </button>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-background/60 backdrop-blur-md text-[10px] text-foreground/70">
          手指拖动旋转 · 捏合缩放
        </div>
      </div>
    </div>
  );
};

export default RoomViewer;
