import { Suspense, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import Mannequin from "./Mannequin.jsx";
const ThreeDViewer = forwardRef(function ThreeDViewer({ outfit }, ref) {
  const c = useRef();
  useImperativeHandle(ref, () => ({
    front() { c.current.setAzimuthalAngle(0); c.current.update(); },
    back() { c.current.setAzimuthalAngle(Math.PI); c.current.update(); },
    reset() { c.current.reset(); },
    zoom(f) { c.current.object.position.multiplyScalar(f); c.current.update(); },
  }));
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.2, 4.2], fov: 32 }}>
      <color attach="background" args={["#070707"]} />
      <fog attach="fog" args={["#070707", 6, 12]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[2.5, 5, 3]} angle={0.4} penumbra={1} intensity={60} castShadow />
      <pointLight position={[-2.5, 1.5, -2]} intensity={6} color="#c9a45c" />
      <Suspense fallback={null}>
        <Environment resolution={256}><Lightformer form="rect" intensity={3} position={[0, 4, -3]} scale={[8, 2, 1]} /><Lightformer form="rect" intensity={1.5} position={[-4, 1, 2]} scale={[2, 6, 1]} color="#c9a45c" /></Environment>
        <group position={[0, -0.1, 0]}><Mannequin outfit={outfit} /></group>
        <ContactShadows position={[0, -0.1, 0]} opacity={0.7} scale={6} blur={2.4} far={2} />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.101, 0]}><circleGeometry args={[3, 64]} /><meshStandardMaterial color="#0c0c0d" metalness={0.8} roughness={0.35} /></mesh>
      <OrbitControls ref={c} target={[0, 1, 0]} enablePan={false} enableDamping dampingFactor={0.07} minDistance={1.8} maxDistance={7} minPolarAngle={0.6} maxPolarAngle={1.7} autoRotate autoRotateSpeed={0.6} />
    </Canvas>);
});
export default ThreeDViewer;
