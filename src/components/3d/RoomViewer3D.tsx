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

/* ══════════════════════════════════════════════════════════════
   3室2厅1卫 户型尺寸 (约 120㎡)
   整体外框: 12m × 10m
   ══════════════════════════════════════════════════════════════ */
const WALL_H = 2.8;
const WALL_T = 0.12;

/* ─── Palette ─── */
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
  tile: "#e4e0dc",
  tileDark: "#c8c2bb",
  kitchen: "#d5cec4",
  bed: "#ece6de",
  bedsheet: "#f5f0ea",
  duvet: "#e0d8ce",
  desk: "#c9a87c",
  chair: "#8a8a8a",
  bath: "#f0ece8",
  mirror: "#d8e4ec",
  door: "#ddd5ca",
};

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
  morning: { ambient: 0.5, ambientColor: "#fff8f0", dir: 1.0, dirColor: "#fff6e8", dirPos: [6, 8, 4], lampIntensity: 0.2, envIntensity: 0.6 },
  night: { ambient: 0.15, ambientColor: "#1a1824", dir: 0.1, dirColor: "#2a2040", dirPos: [3, 5, 2], lampIntensity: 1.4, envIntensity: 0.2 },
  studio: { ambient: 0.65, ambientColor: "#ffffff", dir: 0.8, dirColor: "#fff", dirPos: [5, 7, 5], lampIntensity: 0.3, envIntensity: 0.8 },
};

/* ═══════════════════════════════════
   Reusable furniture components
   ═══════════════════════════════════ */

const Wall = ({ pos, size, color }: { pos: [number, number, number]; size: [number, number, number]; color: string }) => (
  <mesh position={pos} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.92} />
  </mesh>
);

const DoorOpening = ({ pos, rotation = 0, width = 0.9 }: { pos: [number, number, number]; rotation?: number; width?: number }) => (
  <group position={pos} rotation={[0, rotation, 0]}>
    {/* Door frame */}
    <mesh position={[0, 2.1 / 2, 0]}>
      <boxGeometry args={[width + 0.06, 2.1, WALL_T + 0.02]} />
      <meshStandardMaterial color={PAL.door} roughness={0.6} />
    </mesh>
    {/* Door panel (slightly ajar) */}
    <group position={[-width / 2, 0, 0]} rotation={[0, 0.4, 0]}>
      <mesh position={[width / 2, 1.05, 0]}>
        <boxGeometry args={[width, 2.1, 0.04]} />
        <meshStandardMaterial color={PAL.door} roughness={0.55} />
      </mesh>
      {/* Handle */}
      <mesh position={[width * 0.8, 1.0, 0.03]}>
        <boxGeometry args={[0.08, 0.02, 0.04]} />
        <meshStandardMaterial color={PAL.metal} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  </group>
);

const Floor = ({ pos, size, color, isTile = false }: { pos: [number, number, number]; size: [number, number]; color: string; isTile?: boolean }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.001, pos[2]]} receiveShadow>
    <planeGeometry args={size} />
    <meshStandardMaterial color={color} roughness={isTile ? 0.4 : 0.65} metalness={isTile ? 0.05 : 0.02} />
  </mesh>
);

/* ─── Sofa (3-seat) ─── */
const Sofa = ({ pos, rot = 0, color, roughness }: { pos: [number, number, number]; rot?: number; color: string; roughness: number }) => {
  const darker = useMemo(() => { const c = new THREE.Color(color); c.multiplyScalar(0.88); return "#" + c.getHexString(); }, [color]);
  return (
    <group position={pos} rotation={[0, rot, 0]}>
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
      {/* Pillows */}
      <RoundedBox args={[0.32, 0.3, 0.1]} radius={0.06} position={[-0.85, 0.55, 0.1]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color={PAL.pillow1} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.26, 0.09]} radius={0.05} position={[0.8, 0.52, 0.1]} rotation={[-0.05, -0.15, -0.08]} castShadow>
        <meshStandardMaterial color={PAL.pillow3} roughness={0.9} />
      </RoundedBox>
      {/* Legs */}
      {[[-1.0, 0.04, 0.32], [1.0, 0.04, 0.32], [-1.0, 0.04, -0.32], [1.0, 0.04, -0.32]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.08]} />
          <meshStandardMaterial color={PAL.metal} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Coffee Table ─── */
const CoffeeTable = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
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

/* ─── TV Wall ─── */
const TVWall = ({ pos, rot = 0 }: { pos: [number, number, number]; rot?: number }) => (
  <group position={pos} rotation={[0, rot, 0]}>
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

/* ─── Dining Table ─── */
const DiningTable = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <RoundedBox args={[1.4, 0.04, 0.8]} radius={0.015} position={[0, 0.74, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.4} />
    </RoundedBox>
    {[[-0.55, 0.37, 0.28], [0.55, 0.37, 0.28], [-0.55, 0.37, -0.28], [0.55, 0.37, -0.28]].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.74]} />
        <meshStandardMaterial color={PAL.woodDark} roughness={0.45} />
      </mesh>
    ))}
    {/* Chairs */}
    {[[-0.55, 0, 0.65], [0.55, 0, 0.65], [-0.55, 0, -0.65], [0.55, 0, -0.65]].map((p, i) => (
      <group key={`chair${i}`} position={p as [number, number, number]} rotation={[0, i > 1 ? Math.PI : 0, 0]}>
        <RoundedBox args={[0.4, 0.03, 0.4]} radius={0.01} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color={PAL.cushion} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.4, 0.03]} radius={0.01} position={[0, 0.7, -0.18]} castShadow>
          <meshStandardMaterial color={PAL.cushion} roughness={0.85} />
        </RoundedBox>
        {[[-0.16, 0.22, 0.16], [0.16, 0.22, 0.16], [-0.16, 0.22, -0.16], [0.16, 0.22, -0.16]].map((l, j) => (
          <mesh key={j} position={l as [number, number, number]}>
            <cylinderGeometry args={[0.012, 0.012, 0.44]} />
            <meshStandardMaterial color={PAL.metal} metalness={0.7} roughness={0.25} />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

/* ─── Bed (double) ─── */
const Bed = ({ pos, rot = 0, width = 1.8 }: { pos: [number, number, number]; rot?: number; width?: number }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {/* Frame */}
    <RoundedBox args={[width, 0.3, 2.0]} radius={0.03} position={[0, 0.15, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.5} />
    </RoundedBox>
    {/* Mattress */}
    <RoundedBox args={[width - 0.06, 0.18, 1.9]} radius={0.04} position={[0, 0.39, 0]} castShadow>
      <meshStandardMaterial color={PAL.bedsheet} roughness={0.9} />
    </RoundedBox>
    {/* Duvet */}
    <RoundedBox args={[width - 0.1, 0.08, 1.3]} radius={0.03} position={[0, 0.52, 0.2]} castShadow>
      <meshStandardMaterial color={PAL.duvet} roughness={0.92} />
    </RoundedBox>
    {/* Headboard */}
    <RoundedBox args={[width, 0.8, 0.08]} radius={0.02} position={[0, 0.7, -0.96]} castShadow>
      <meshStandardMaterial color={PAL.woodDark} roughness={0.55} />
    </RoundedBox>
    {/* Pillows */}
    <RoundedBox args={[0.5, 0.12, 0.35]} radius={0.05} position={[-0.35, 0.55, -0.6]} castShadow>
      <meshStandardMaterial color={PAL.bedsheet} roughness={0.92} />
    </RoundedBox>
    <RoundedBox args={[0.5, 0.12, 0.35]} radius={0.05} position={[0.35, 0.55, -0.6]} castShadow>
      <meshStandardMaterial color={PAL.bedsheet} roughness={0.92} />
    </RoundedBox>
  </group>
);

/* ─── Nightstand ─── */
const Nightstand = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <RoundedBox args={[0.45, 0.45, 0.4]} radius={0.02} position={[0, 0.225, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.5} />
    </RoundedBox>
    {/* Lamp on top */}
    <mesh position={[0, 0.52, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 0.18, 12]} />
      <meshStandardMaterial color={PAL.lamp} roughness={0.9} />
    </mesh>
    <pointLight position={[0, 0.7, 0]} intensity={0.15} color={PAL.lampGlow} distance={2.5} decay={2} />
  </group>
);

/* ─── Desk ─── */
const Desk = ({ pos, rot = 0 }: { pos: [number, number, number]; rot?: number }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <RoundedBox args={[1.2, 0.03, 0.6]} radius={0.01} position={[0, 0.74, 0]} castShadow>
      <meshStandardMaterial color={PAL.desk} roughness={0.4} />
    </RoundedBox>
    {[[-0.5, 0.37, 0.22], [0.5, 0.37, 0.22], [-0.5, 0.37, -0.22], [0.5, 0.37, -0.22]].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]}>
        <cylinderGeometry args={[0.02, 0.02, 0.74]} />
        <meshStandardMaterial color={PAL.metalDark} metalness={0.7} roughness={0.3} />
      </mesh>
    ))}
    {/* Monitor */}
    <RoundedBox args={[0.55, 0.35, 0.02]} radius={0.008} position={[0, 1.1, -0.15]} castShadow>
      <meshStandardMaterial color={PAL.tv} roughness={0.2} metalness={0.6} />
    </RoundedBox>
    <mesh position={[0, 0.77, -0.15]}>
      <cylinderGeometry args={[0.025, 0.04, 0.06]} />
      <meshStandardMaterial color={PAL.metalDark} metalness={0.7} roughness={0.3} />
    </mesh>
  </group>
);

/* ─── Wardrobe ─── */
const Wardrobe = ({ pos, rot = 0, width = 1.6 }: { pos: [number, number, number]; rot?: number; width?: number }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <RoundedBox args={[width, 2.2, 0.55]} radius={0.02} position={[0, 1.1, 0]} castShadow>
      <meshStandardMaterial color={PAL.wood} roughness={0.5} />
    </RoundedBox>
    {/* Door lines */}
    <mesh position={[0, 1.1, 0.28]}>
      <boxGeometry args={[0.01, 2.1, 0.01]} />
      <meshStandardMaterial color={PAL.woodDark} roughness={0.5} />
    </mesh>
    {/* Handles */}
    {[-0.08, 0.08].map((x, i) => (
      <mesh key={i} position={[x, 1.1, 0.285]}>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color={PAL.metal} metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
  </group>
);

/* ─── Kitchen counter ─── */
const KitchenCounter = ({ pos, rot = 0 }: { pos: [number, number, number]; rot?: number }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {/* L-shaped counter */}
    <RoundedBox args={[2.4, 0.86, 0.6]} radius={0.02} position={[0, 0.43, 0]} castShadow>
      <meshStandardMaterial color={PAL.kitchen} roughness={0.4} />
    </RoundedBox>
    {/* Countertop */}
    <RoundedBox args={[2.5, 0.03, 0.65]} radius={0.01} position={[0, 0.87, 0]} castShadow>
      <meshStandardMaterial color="#f0ece6" roughness={0.2} metalness={0.05} />
    </RoundedBox>
    {/* Sink */}
    <mesh position={[-0.4, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.5, 0.35]} />
      <meshStandardMaterial color={PAL.metal} metalness={0.8} roughness={0.15} />
    </mesh>
    {/* Upper cabinets */}
    <RoundedBox args={[2.4, 0.6, 0.32]} radius={0.02} position={[0, 1.9, 0.14]} castShadow>
      <meshStandardMaterial color={PAL.kitchen} roughness={0.4} />
    </RoundedBox>
  </group>
);

/* ─── Bathroom ─── */
const Bathroom = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    {/* Toilet */}
    <group position={[0.5, 0, 0.3]}>
      <RoundedBox args={[0.38, 0.38, 0.55]} radius={0.06} position={[0, 0.19, 0]} castShadow>
        <meshStandardMaterial color={PAL.bath} roughness={0.2} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.02, 0.36]} radius={0.05} position={[0, 0.39, 0.05]} castShadow>
        <meshStandardMaterial color={PAL.bath} roughness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.25, 0.06]} radius={0.03} position={[0, 0.42, -0.22]} castShadow>
        <meshStandardMaterial color={PAL.bath} roughness={0.2} />
      </RoundedBox>
    </group>
    {/* Vanity */}
    <group position={[-0.5, 0, -0.5]}>
      <RoundedBox args={[0.8, 0.6, 0.45]} radius={0.02} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color={PAL.wood} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.03, 0.5]} radius={0.01} position={[0, 0.62, 0]} castShadow>
        <meshStandardMaterial color="#f0ece6" roughness={0.15} metalness={0.05} />
      </RoundedBox>
      {/* Mirror */}
      <RoundedBox args={[0.6, 0.7, 0.02]} radius={0.01} position={[0, 1.3, -0.22]} castShadow>
        <meshStandardMaterial color={PAL.mirror} roughness={0.05} metalness={0.4} />
      </RoundedBox>
    </group>
    {/* Shower area */}
    <group position={[-0.5, 0, 0.6]}>
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial color={PAL.metal} metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Glass partition */}
      <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 2.0, 0.8]} />
        <meshStandardMaterial color={PAL.glass} transparent opacity={0.2} roughness={0.05} />
      </mesh>
    </group>
  </group>
);

/* ─── Rug ─── */
const Rug = ({ pos, size, color }: { pos: [number, number, number]; size: [number, number]; color: string }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.004, pos[2]]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.003, pos[2]]}>
      <planeGeometry args={[size[0] + 0.06, size[1] + 0.06]} />
      <meshStandardMaterial color={PAL.rugBorder} roughness={0.95} />
    </mesh>
  </group>
);

/* ─── Plant ─── */
const Plant = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <mesh position={[0, 0.14, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.08, 0.28, 8]} />
      <meshStandardMaterial color={PAL.plantPot} roughness={0.75} />
    </mesh>
    <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.06}>
      {[[0, 0.5, 0, 0.15], [0.08, 0.6, 0.04, 0.12], [-0.06, 0.65, -0.04, 0.1]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 8, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? PAL.plant : PAL.plantDark} roughness={0.88} />
        </mesh>
      ))}
    </Float>
  </group>
);

/* ─── Floor lamp ─── */
const FloorLamp = ({ pos, intensity }: { pos: [number, number, number]; intensity: number }) => (
  <group position={pos}>
    <mesh position={[0, 0.012, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.02]} />
      <meshStandardMaterial color={PAL.metalDark} metalness={0.75} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.75, 0]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 1.45]} />
      <meshStandardMaterial color={PAL.metal} metalness={0.75} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.14, 0.24, 16, 1, true]} />
      <meshStandardMaterial color={PAL.lamp} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
    <pointLight position={[0, 1.45, 0]} intensity={intensity} color={PAL.lampGlow} distance={4} decay={2} />
  </group>
);

/* ─── Annotation ─── */
const Annotation = ({ position, label }: { position: [number, number, number]; label: string }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
    </mesh>
    <Text position={[0, 0.12, 0]} fontSize={0.075} color="#3b82f6" anchorX="center" anchorY="bottom" outlineWidth={0.006} outlineColor="#ffffff">
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
    angle.current += delta * 0.08;
    const radius = 14;
    camera.position.x = Math.sin(angle.current) * radius;
    camera.position.z = Math.cos(angle.current) * radius;
    camera.position.y = 8;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
};

/* ═══════════════════════════════════════════════════════════════
   MAIN SCENE: 3室2厅1卫 (3BR / 2LR / 1BA) ~120㎡
   
   Layout (top-down, Z- is north):
   
   ┌──────────────────────────────┐
   │  Master BR    │  Kitchen     │  North
   │  (-4, *, -3)  │  (3, *, -3)  │
   ├───────┬───────┤──────────────┤
   │ BR2   │ Bath  │              │
   │(-4,*,0)│(-1,*,0) │ Living Room │
   ├───────┴───────┤  (3, *, 0)   │
   │  Bedroom 3    │              │
   │  (-4, *, 3)   ├──────────────┤
   │               │ Dining Room  │
   │               │  (3, *, 3)   │
   └───────────────┴──────────────┘
                                    South
   ═══════════════════════════════════════════════════════════════ */

const RoomScene = ({ sceneState }: { sceneState: SceneState }) => {
  const light = LIGHTING[sceneState.lighting] || LIGHTING.morning;
  const sofaRoughness = sceneState.sofaMaterial === "leather" ? 0.35 : sceneState.sofaMaterial === "linen" ? 0.95 : 0.82;
  const stylePal = { ...PAL, ...(STYLE_PALETTES[sceneState.designStyle] || {}) };

  return (
    <>
      {/* ─── Lighting ─── */}
      <ambientLight intensity={light.ambient} color={light.ambientColor} />
      <directionalLight position={light.dirPos} intensity={light.dir} color={light.dirColor} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={30} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
      <directionalLight position={[-5, 3, 2]} intensity={sceneState.lighting === "night" ? 0.03 : 0.2} color={sceneState.lighting === "night" ? "#1a1830" : "#f0e8dd"} />

      {/* ═══ FLOORS ═══ */}
      {/* Living room */}
      <Floor pos={[3, 0, 0]} size={[5, 5]} color={stylePal.floor} />
      {/* Dining room */}
      <Floor pos={[3, 0, 3.5]} size={[5, 2.5]} color={stylePal.floorAlt} />
      {/* Master bedroom */}
      <Floor pos={[-3.5, 0, -3]} size={[4.5, 4]} color={stylePal.floor} />
      {/* Bedroom 2 */}
      <Floor pos={[-4, 0, 0.5]} size={[3.5, 2.5]} color={stylePal.floor} />
      {/* Bedroom 3 */}
      <Floor pos={[-3.5, 0, 3]} size={[4.5, 3]} color={stylePal.floor} />
      {/* Kitchen */}
      <Floor pos={[3, 0, -3.5]} size={[5, 2.5]} color={stylePal.tile} isTile />
      {/* Bathroom */}
      <Floor pos={[-1.2, 0, 0.5]} size={[2, 2.5]} color={stylePal.tile} isTile />
      {/* Hallway/corridor */}
      <Floor pos={[-0.5, 0, -1]} size={[2, 2]} color={stylePal.floorAlt} />
      <Floor pos={[-0.5, 0, 1.5]} size={[2, 1.5]} color={stylePal.floorAlt} />

      {/* ═══ OUTER WALLS ═══ */}
      {/* North wall */}
      <Wall pos={[0, WALL_H / 2, -5]} size={[12, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* South wall */}
      <Wall pos={[0, WALL_H / 2, 4.8]} size={[12, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* West wall */}
      <Wall pos={[-5.8, WALL_H / 2, 0]} size={[WALL_T, WALL_H, 10]} color={stylePal.wall} />
      {/* East wall */}
      <Wall pos={[5.5, WALL_H / 2, 0]} size={[WALL_T, WALL_H, 10]} color={stylePal.wall} />

      {/* ═══ INTERIOR WALLS ═══ */}
      {/* Divide west bedrooms from east living/kitchen — long N-S wall */}
      <Wall pos={[-1.5, WALL_H / 2, -3]} size={[WALL_T, WALL_H, 4]} color={stylePal.wall} />
      <Wall pos={[-1.5, WALL_H / 2, 3]} size={[WALL_T, WALL_H, 3.5]} color={stylePal.wall} />
      {/* Living / Kitchen divider (E-W) */}
      <Wall pos={[3, WALL_H / 2, -2.2]} size={[5, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* Living / Dining partial wall */}
      <Wall pos={[4.2, WALL_H / 2, 2.2]} size={[2.5, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* Master BR / BR2 divider (E-W) */}
      <Wall pos={[-3.8, WALL_H / 2, -1]} size={[4, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* BR2 / BR3 divider (E-W) */}
      <Wall pos={[-3.8, WALL_H / 2, 1.5]} size={[4, WALL_H, WALL_T]} color={stylePal.wall} />
      {/* Bathroom walls */}
      <Wall pos={[-1.5, WALL_H / 2, 0.5]} size={[WALL_T, WALL_H, 2.5]} color={stylePal.wall} />
      <Wall pos={[-0.2, WALL_H / 2, -0.5]} size={[2.5, WALL_H, WALL_T]} color={stylePal.wall} />
      <Wall pos={[-0.2, WALL_H / 2, 1.8]} size={[2.5, WALL_H, WALL_T]} color={stylePal.wall} />

      {/* ═══ DOOR OPENINGS ═══ */}
      <DoorOpening pos={[-1.5, 0, -3]} rotation={0} />
      <DoorOpening pos={[-1.5, 0, 0]} rotation={0} />
      <DoorOpening pos={[-3, 0, 1.5]} rotation={Math.PI / 2} />
      <DoorOpening pos={[-0.2, 0, 0.5]} rotation={0} />
      <DoorOpening pos={[1, 0, -2.2]} rotation={Math.PI / 2} />

      {/* ═══ WINDOWS (light panels on outer walls) ═══ */}
      {/* Living room east windows */}
      <mesh position={[5.49, WALL_H / 2 + 0.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.0, 1.6]} />
        <meshStandardMaterial color="#faf8f4" emissive={sceneState.lighting === "night" ? "#0a0818" : "#fff8ee"} emissiveIntensity={sceneState.lighting === "night" ? 0.02 : 0.4} transparent opacity={0.95} />
      </mesh>
      <mesh position={[5.49, WALL_H / 2 + 0.2, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.6]} />
        <meshStandardMaterial color="#faf8f4" emissive={sceneState.lighting === "night" ? "#0a0818" : "#fff8ee"} emissiveIntensity={sceneState.lighting === "night" ? 0.02 : 0.35} transparent opacity={0.95} />
      </mesh>
      {/* Master BR north window */}
      <mesh position={[-3.5, WALL_H / 2 + 0.2, -4.99]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshStandardMaterial color="#faf8f4" emissive={sceneState.lighting === "night" ? "#0a0818" : "#fff8ee"} emissiveIntensity={sceneState.lighting === "night" ? 0.02 : 0.35} transparent opacity={0.95} />
      </mesh>
      {/* BR3 south window */}
      <mesh position={[-3.5, WALL_H / 2 + 0.2, 4.79]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshStandardMaterial color="#faf8f4" emissive={sceneState.lighting === "night" ? "#0a0818" : "#fff8ee"} emissiveIntensity={sceneState.lighting === "night" ? 0.02 : 0.3} transparent opacity={0.95} />
      </mesh>

      {/* ═══════════════════════
          LIVING ROOM FURNITURE
          ═══════════════════════ */}
      <Sofa pos={[3, 0, 1]} rot={Math.PI} color={sceneState.sofaColor} roughness={sofaRoughness} />
      <CoffeeTable pos={[3, 0, -0.2]} />
      <TVWall pos={[3, 0, -1.8]} />
      <Rug pos={[3, 0, 0.3]} size={[3.2, 2.4]} color={stylePal.rug} />
      <FloorLamp pos={[1.2, 0, 0.8]} intensity={light.lampIntensity} />
      <Plant pos={[5, 0, 1.5]} />

      {/* ═══════════════════════
          DINING ROOM FURNITURE
          ═══════════════════════ */}
      <DiningTable pos={[3, 0, 3.5]} />
      <Plant pos={[5, 0, 4]} />

      {/* ═══════════════════════
          KITCHEN
          ═══════════════════════ */}
      <KitchenCounter pos={[3.5, 0, -3.5]} />

      {/* ═══════════════════════
          MASTER BEDROOM
          ═══════════════════════ */}
      <Bed pos={[-3.5, 0, -3.2]} rot={0} width={1.8} />
      <Nightstand pos={[-4.8, 0, -3.2]} />
      <Nightstand pos={[-2.2, 0, -3.2]} />
      <Wardrobe pos={[-5.2, 0, -4.2]} rot={Math.PI / 2} width={1.8} />

      {/* ═══════════════════════
          BEDROOM 2 (Study/Guest)
          ═══════════════════════ */}
      <Bed pos={[-4.2, 0, 0.3]} rot={0} width={1.2} />
      <Desk pos={[-3, 0, -0.5]} rot={Math.PI} />
      <Wardrobe pos={[-5.2, 0, 0.3]} rot={Math.PI / 2} width={1.2} />

      {/* ═══════════════════════
          BEDROOM 3 (Kids)
          ═══════════════════════ */}
      <Bed pos={[-3.5, 0, 3.2]} rot={0} width={1.5} />
      <Nightstand pos={[-5, 0, 3.2]} />
      <Desk pos={[-2.5, 0, 2.2]} rot={0} />
      <Wardrobe pos={[-5.2, 0, 4]} rot={Math.PI / 2} width={1.4} />

      {/* ═══════════════════════
          BATHROOM
          ═══════════════════════ */}
      <Bathroom pos={[-1.2, 0, 0.5]} />

      {/* ═══ SHADOWS ═══ */}
      <ContactShadows position={[0, 0.001, 0]} opacity={0.2} scale={20} blur={3} far={5} />

      {/* ═══ ANNOTATIONS ═══ */}
      {sceneState.showAnnotations && (
        <>
          <Annotation position={[3, 1.5, 0]} label="客厅 Living Room" />
          <Annotation position={[3, 1.5, 3.5]} label="餐厅 Dining" />
          <Annotation position={[3.5, 1.5, -3.5]} label="厨房 Kitchen" />
          <Annotation position={[-3.5, 1.5, -3.2]} label="主卧 Master BR" />
          <Annotation position={[-4, 1.5, 0.3]} label="次卧 Bedroom 2" />
          <Annotation position={[-3.5, 1.5, 3.2]} label="儿童房 Bedroom 3" />
          <Annotation position={[-1.2, 1.5, 0.5]} label="卫生间 Bathroom" />
          <Annotation position={[3, 0.9, 1]} label="沙发 ¥4,280" />
          <Annotation position={[3, 0.6, -0.2]} label="茶几 ¥1,680" />
        </>
      )}
    </>
  );
};

/* ═══ Exported Viewer ═══ */
interface RoomViewer3DProps {
  className?: string;
  sceneState: SceneState;
  onSceneStateChange: (state: SceneState) => void;
}

const RoomViewer3D = ({ className, sceneState, onSceneStateChange }: RoomViewer3DProps) => (
  <div className={`relative ${className ?? ""}`} style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #efebe6 100%)" }}>
    <Canvas
      shadows
      camera={{ position: [10, 9, 12], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#f8f6f3"]} />
      <fog attach="fog" args={["#f8f6f3", 20, 40]} />
      <Suspense fallback={null}>
        <RoomScene sceneState={sceneState} />
        <CameraRig autoRotate={sceneState.autoRotate} />
        <OrbitControls
          enablePan
          enableZoom
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.2}
          target={[0, 0.5, 0]}
          onStart={() => onSceneStateChange({ ...sceneState, autoRotate: false })}
        />
        <Environment preset="apartment" environmentIntensity={LIGHTING[sceneState.lighting]?.envIntensity ?? 0.6} />
      </Suspense>
    </Canvas>
  </div>
);

export default RoomViewer3D;
