import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Room dimensions ─── */
const ROOM_W = 5;
const ROOM_D = 5;
const ROOM_H = 2.8;

/* ─── Scene state interface (shared with ThreeDEditor) ─── */
export interface SceneState {
  lighting: "morning" | "night" | "studio";
  sofaMaterial: "fabric" | "leather" | "linen";
  sofaColor: string;
  showAnnotations: boolean;
  autoRotate: boolean;
  cameraPreset: "overview" | "sofa-close" | "tv-area" | "window";
}

/* ─── Color palette ─── */
const BASE_COLORS = {
  floor: "#e8ddd3",
  wall: "#f5f0eb",
  accent: "#d4c5b2",
  sofaCushion: "#b8ad9e",
  wood: "#b8946a",
  woodDark: "#9a7b5a",
  glass: "#d4e5ec",
  metal: "#8a8a8a",
  plant: "#5a7a52",
  plantPot: "#c4a882",
  rug: "#d8cfc4",
  lamp: "#f0e8dd",
  lampLight: "#fff5e0",
  tv: "#1a1a1a",
  pillow1: "#a8b5a0",
  pillow3: "#8a9a7a",
};

/* ─── Lighting presets ─── */
const LIGHTING: Record<string, { ambient: number; ambientColor: string; dir: number; dirColor: string; lampIntensity: number }> = {
  morning: { ambient: 0.45, ambientColor: "#fff5ee", dir: 0.9, dirColor: "#fff8ee", lampIntensity: 0.3 },
  night: { ambient: 0.12, ambientColor: "#1a1520", dir: 0.15, dirColor: "#2a2030", lampIntensity: 1.2 },
  studio: { ambient: 0.6, ambientColor: "#ffffff", dir: 0.7, dirColor: "#ffffff", lampIntensity: 0.4 },
};

/* ─── Components ─── */

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[ROOM_W, ROOM_D]} />
    <meshStandardMaterial color={BASE_COLORS.floor} roughness={0.7} />
  </mesh>
);

const Walls = ({ lighting }: { lighting: string }) => {
  const wallColor = lighting === "night" ? "#e8e0d8" : BASE_COLORS.wall;
  return (
    <group>
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[ROOM_W / 2 - 0.01, ROOM_H / 2 + 0.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshStandardMaterial
          color="#f8f4ee"
          emissive={lighting === "night" ? "#1a1830" : "#fff8ee"}
          emissiveIntensity={lighting === "night" ? 0.05 : 0.3}
        />
      </mesh>
    </group>
  );
};

const Sofa = ({ color, roughness }: { color: string; roughness: number }) => {
  const cushionColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.88);
    return "#" + c.getHexString();
  }, [color]);

  return (
    <group position={[0.8, 0, 1.2]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[2.8, 0.38, 0.95]} radius={0.04} position={[0, 0.19, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[2.8, 0.55, 0.15]} radius={0.04} position={[0, 0.55, -0.4]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.45, 0.95]} radius={0.04} position={[-1.35, 0.32, 0]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.45, 0.95]} radius={0.04} position={[1.35, 0.32, 0]} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={roughness} />
      </RoundedBox>
      {[-0.7, 0, 0.7].map((x, i) => (
        <RoundedBox key={i} args={[0.65, 0.12, 0.75]} radius={0.03} position={[x, 0.44, 0.02]} castShadow>
          <meshStandardMaterial color={color} roughness={roughness + 0.05} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.35, 0.35, 0.12]} radius={0.06} position={[-0.95, 0.6, 0.15]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color={BASE_COLORS.pillow1} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.05} position={[0.9, 0.58, 0.15]} rotation={[-0.05, -0.15, -0.08]} castShadow>
        <meshStandardMaterial color={BASE_COLORS.pillow3} roughness={0.9} />
      </RoundedBox>
      {[[-1.2, 0.04, 0.35], [1.2, 0.04, 0.35], [-1.2, 0.04, -0.35], [1.2, 0.04, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.08]} />
          <meshStandardMaterial color={BASE_COLORS.metal} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const CoffeeTable = () => (
  <group position={[0.8, 0, 0]}>
    <RoundedBox args={[1.2, 0.03, 0.6]} radius={0.02} position={[0, 0.45, 0]} castShadow>
      <meshStandardMaterial color={BASE_COLORS.glass} roughness={0.1} transparent opacity={0.6} metalness={0.1} />
    </RoundedBox>
    <RoundedBox args={[1.1, 0.04, 0.5]} radius={0.01} position={[0, 0.42, 0]} castShadow>
      <meshStandardMaterial color={BASE_COLORS.wood} roughness={0.5} />
    </RoundedBox>
    {[[-0.45, 0.21, 0.18], [0.45, 0.21, 0.18], [-0.45, 0.21, -0.18], [0.45, 0.21, -0.18]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.42]} />
        <meshStandardMaterial color={BASE_COLORS.wood} roughness={0.5} />
      </mesh>
    ))}
    <RoundedBox args={[0.9, 0.02, 0.35]} radius={0.01} position={[0, 0.15, 0]}>
      <meshStandardMaterial color={BASE_COLORS.wood} roughness={0.5} />
    </RoundedBox>
  </group>
);

const TVCabinet = () => (
  <group position={[0.8, 0, -2.1]}>
    <RoundedBox args={[1.8, 0.35, 0.4]} radius={0.02} position={[0, 0.8, 0]} castShadow>
      <meshStandardMaterial color={BASE_COLORS.wood} roughness={0.6} />
    </RoundedBox>
    {[-0.45, 0, 0.45].map((x, i) => (
      <mesh key={i} position={[x, 0.8, 0.201]}>
        <planeGeometry args={[0.55, 0.28]} />
        <meshStandardMaterial color={BASE_COLORS.woodDark} roughness={0.7} />
      </mesh>
    ))}
    <RoundedBox args={[1.4, 0.8, 0.04]} radius={0.01} position={[0, 1.5, -0.05]} castShadow>
      <meshStandardMaterial color={BASE_COLORS.tv} roughness={0.3} metalness={0.5} />
    </RoundedBox>
    <mesh position={[0, 1.5, -0.02]}>
      <planeGeometry args={[1.32, 0.72]} />
      <meshStandardMaterial color="#222" roughness={0.1} metalness={0.8} />
    </mesh>
  </group>
);

const FloorLamp = ({ intensity }: { intensity: number }) => (
  <group position={[-1.5, 0, 0.8]}>
    <mesh position={[0, 0.02, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 0.03]} />
      <meshStandardMaterial color={BASE_COLORS.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.015, 0.015, 1.55]} />
      <meshStandardMaterial color={BASE_COLORS.metal} metalness={0.7} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.6, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.18, 0.28, 16, 1, true]} />
      <meshStandardMaterial color={BASE_COLORS.lamp} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[0, 1.55, 0]} intensity={intensity} color={BASE_COLORS.lampLight} distance={4} />
  </group>
);

const Plant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.15, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.1, 0.3, 8]} />
      <meshStandardMaterial color={BASE_COLORS.plantPot} roughness={0.8} />
    </mesh>
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      {[[0, 0.55, 0, 0.2], [0.1, 0.65, 0.05, 0.15], [-0.08, 0.7, -0.05, 0.13], [0.05, 0.45, 0.08, 0.12]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 8, 6]} />
          <meshStandardMaterial color={BASE_COLORS.plant} roughness={0.9} />
        </mesh>
      ))}
    </Float>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.015, 0.01, 0.2]} />
      <meshStandardMaterial color="#4a6a42" roughness={0.8} />
    </mesh>
  </group>
);

const Rug = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.005, 0.3]} receiveShadow>
    <planeGeometry args={[3, 2]} />
    <meshStandardMaterial color={BASE_COLORS.rug} roughness={0.95} />
  </mesh>
);

const WallArt = () => (
  <group position={[0.8, 1.8, -ROOM_D / 2 + 0.02]}>
    <RoundedBox args={[0.6, 0.45, 0.03]} radius={0.005} castShadow>
      <meshStandardMaterial color={BASE_COLORS.wood} roughness={0.5} />
    </RoundedBox>
    <mesh position={[0, 0, 0.016]}>
      <planeGeometry args={[0.52, 0.37]} />
      <meshStandardMaterial color="#e8ddd3" roughness={0.8} />
    </mesh>
    <mesh position={[-0.1, 0.05, 0.02]}>
      <circleGeometry args={[0.08, 16]} />
      <meshStandardMaterial color={BASE_COLORS.pillow1} roughness={0.9} />
    </mesh>
    <mesh position={[0.1, -0.03, 0.02]}>
      <circleGeometry args={[0.06, 16]} />
      <meshStandardMaterial color={BASE_COLORS.pillow3} roughness={0.9} />
    </mesh>
  </group>
);

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

/* ─── Camera rig with preset support ─── */
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
const RoomScene = ({ sceneState }: { sceneState: SceneState }) => {
  const light = LIGHTING[sceneState.lighting] || LIGHTING.morning;
  const sofaRoughness = sceneState.sofaMaterial === "leather" ? 0.4 : sceneState.sofaMaterial === "linen" ? 0.95 : 0.85;

  return (
    <>
      <ambientLight intensity={light.ambient} color={light.ambientColor} />
      <directionalLight
        position={[3, 5, 2]}
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
      <directionalLight
        position={[4, 2, 0]}
        intensity={sceneState.lighting === "night" ? 0.05 : 0.3}
        color={sceneState.lighting === "night" ? "#2a2040" : "#ffeedd"}
      />

      <Floor />
      <Walls lighting={sceneState.lighting} />
      <Rug />

      <Sofa color={sceneState.sofaColor} roughness={sofaRoughness} />
      <CoffeeTable />
      <TVCabinet />
      <FloorLamp intensity={light.lampIntensity} />
      <Plant position={[-1.8, 0, -1.5]} />
      <Plant position={[2.0, 0, 1.5]} />
      <WallArt />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.3} scale={10} blur={2} />

      {sceneState.showAnnotations && (
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
};

/* ─── Exported Viewer ─── */
interface RoomViewer3DProps {
  className?: string;
  sceneState: SceneState;
  onSceneStateChange: (state: SceneState) => void;
}

const RoomViewer3D = ({ className, sceneState, onSceneStateChange }: RoomViewer3DProps) => {
  return (
    <div className={`relative bg-[#f5f0eb] ${className ?? ""}`}>
      <Canvas
        shadows
        camera={{ position: [4, 3.5, 5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
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
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomViewer3D;
