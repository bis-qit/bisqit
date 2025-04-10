"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BlochSphereCoordinates } from '@/lib/types';

interface BlochSphereVisualizationProps {
  coordinates?: BlochSphereCoordinates;
}

export default function BlochSphereVisualization({ coordinates }: BlochSphereVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !coordinates) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create Bloch sphere wireframe
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(sphereGeometry),
      new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.3
      })
    );
    scene.add(wireframe);
    
    // Add axes
    const axesHelper = new THREE.AxesHelper(1.2);
    scene.add(axesHelper);
    
    // Add axis labels
    const addAxisLabel = (text: string, position: THREE.Vector3, color: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.font = '24px Arial';
      ctx.fillText(text, 24, 24);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(0.3, 0.15, 1);
      scene.add(sprite);
    };
    
    addAxisLabel('X', new THREE.Vector3(1.3, 0, 0), 0xff0000);
    addAxisLabel('Y', new THREE.Vector3(0, 1.3, 0), 0x00ff00);
    addAxisLabel('Z', new THREE.Vector3(0, 0, 1.3), 0x0000ff);
    
    // Add |0⟩ and |1⟩ markers
    addAxisLabel('|0⟩', new THREE.Vector3(0, 0, 1.1), 0x000000);
    addAxisLabel('|1⟩', new THREE.Vector3(0, 0, -1.1), 0x000000);
    
    // Add state vector marker
    const stateVector = new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z);
    stateVector.normalize();
    
    // Create arrow for state vector
    const arrowHelper = new THREE.ArrowHelper(
      stateVector,
      new THREE.Vector3(0, 0, 0),
      1,
      0xff00ff,
      0.1,
      0.07
    );
    scene.add(arrowHelper);
    
    // Create dot at the end of state vector
    const dotGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.copy(stateVector);
    scene.add(dot);
    
    // Handle resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, [coordinates]);
  
  return (
    <div ref={containerRef} className="w-full h-full rounded-lg shadow-inner" />
  );
}