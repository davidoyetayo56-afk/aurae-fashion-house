import { Suspense, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { byId, MANNEQUIN_MODEL } from "../data/products";

// Checks the .glb really exists (Vite/GitHub Pages return an HTML page for missing files).
const cache = {};
function useExists(url) {
  const [ok, setOk] = useState(cache[url]);
  useEffect(() => {
    if (cache[url] !== undefined) return;
    fetch(url, { method: "HEAD" }).then((r) => { cache[url] = r.ok && !(r.headers.get("content-type") || "").includes("text/html"); setOk(cache[url]); }).catch(() => { cache[url] = false; setOk(false); });
  }, [url]);
  return ok;
}
function Glb({ url }) { const { scene } = useGLTF(url); return <primitive object={scene.clone()} />; }

const Dark = () => <meshPhysicalMaterial color="#09090a" metalness={0.95} roughness={0.18} clearcoat={1} envMapIntensity={1.4} />;

function Body() {
  return (<group>
    <mesh position={[0, 1.78, 0]}><sphereGeometry args={[0.17, 32, 32]} /><Dark /></mesh>
    <mesh position={[0, 1.58, 0]}><cylinderGeometry args={[0.06, 0.07, 0.15]} /><Dark /></mesh>
    <mesh position={[0, 1.2, 0]} scale={[1.35, 1, 0.75]}><capsuleGeometry args={[0.26, 0.5, 8, 20]} /><Dark /></mesh>
    {[-1, 1].map((s) => (<group key={s}>
      <mesh position={[s * 0.5, 1.15, 0]} rotation={[0, 0, s * 0.08]}><capsuleGeometry args={[0.07, 0.75, 8, 12]} /><Dark /></mesh>
      <mesh position={[s * 0.17, 0.45, 0]}><capsuleGeometry args={[0.1, 0.8, 8, 12]} /><Dark /></mesh>
      <mesh position={[s * 0.17, 0.04, 0.06]} scale={[1, 0.5, 1.6]}><sphereGeometry args={[0.1, 16, 16]} /><Dark /></mesh>
    </group>))}
    <mesh position={[0, 0.82, 0]}><boxGeometry args={[0.5, 0.2, 0.28]} /><Dark /></mesh>
  </group>);
}

function Piece({ p }) {
  const mat = <meshStandardMaterial color={p.color} roughness={0.95} />;
  if (p.slot === "top") return (<group>
    <mesh position={[0, 1.2, 0]}><boxGeometry args={[0.98, 0.78, 0.46]} />{mat}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.56, 1.2, 0]} rotation={[0, 0, s * -0.15]}><boxGeometry args={[0.26, 0.5, 0.34]} />{mat}</mesh>)}
  </group>);
  if (p.slot === "bottom") return (<group>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.19, 0.42, 0]}><cylinderGeometry args={[0.17, 0.2, 0.9, 20]} />{mat}</mesh>)}
    <mesh position={[0, 0.85, 0]}><boxGeometry args={[0.6, 0.25, 0.36]} />{mat}</mesh></group>);
  return <mesh position={[0, 1.86, 0]}><sphereGeometry args={[0.19, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{mat}</mesh>;
}
function Garment({ p }) {
  const ok = useExists(p.model);
  if (ok === undefined) return null;
  // REAL MODEL: drop the .glb at p.model (see data/products.js) — it replaces the placeholder automatically.
  return ok ? <Suspense fallback={null}><Glb url={p.model} /></Suspense> : <Piece p={p} />;
}
export default function Mannequin({ outfit }) {
  const ok = useExists(MANNEQUIN_MODEL); // /public/models/mannequin.glb
  return (<group>
    {ok === undefined ? null : ok ? <Suspense fallback={null}><Glb url={MANNEQUIN_MODEL} /></Suspense> : <Body />}
    {Object.values(outfit).filter(Boolean).map((id) => <Garment key={id} p={byId[id]} />)}
  </group>);
}
