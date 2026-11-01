"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Torus, Sphere, Color } from "ogl";

// Vertex shader for the glowing particle field
const particleVertex = /* glsl */ `
  attribute vec3 position;
  attribute float aSize;
  attribute float aPhase;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uPulse;

  varying float vPhase;

  void main() {
    vPhase = aPhase;
    vec3 pos = position;
    // subtle organic floating drift
    pos.x += sin(uTime * 0.8 + aPhase * 6.28) * 0.08;
    pos.y += cos(uTime * 0.7 + aPhase * 6.28) * 0.08;
    pos.z += sin(uTime * 0.9 + aPhase * 3.14) * 0.08;

    // shockwave expansion on click
    pos += normalize(position) * (uPulse * 0.45);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * 1.4 + sin(uTime * 2.0 + aPhase * 6.28) * 0.6) * (24.0 / -mvPosition.z);
  }
`;

// Fragment shader for smooth circular glowing particles with luminous core
const particleFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, dist);
    float core = smoothstep(0.2, 0.0, dist);
    vec3 col = mix(uColor, uAccent, step(0.65, vPhase));
    col = mix(col, vec3(1.0), core * 0.65);
    gl_FragColor = vec4(col, alpha * 0.95);
  }
`;

// Shaders for the faceted neural core
const coreVertex = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;

  varying vec3 vNormal;
  varying vec3 vEye;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vEye = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const coreFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  uniform float uTime;
  uniform float uAlpha;
  varying vec3 vNormal;
  varying vec3 vEye;

  void main() {
    vec3 eye = normalize(vEye);
    float rim = 1.0 - max(0.0, dot(eye, vNormal));
    rim = pow(rim, 2.8);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.5);
    vec3 color = mix(uColor, uRimColor, rim + pulse * 0.25);
    gl_FragColor = vec4(color, uAlpha + rim * 0.4);
  }
`;

// Shader for the technical wireframe lines / rings
const lineFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uAlpha;

  void main() {
    gl_FragColor = vec4(uColor, uAlpha);
  }
`;

export function InteractiveHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0, fps: 60, status: "ONLINE" });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect theme
    const getTheme = () => document.documentElement.getAttribute("data-theme") || "dark";
    let isDark = getTheme() === "dark";

    const getPalette = (dark: boolean) => ({
      coreColor: dark ? new Color(0.07, 0.22, 0.6) : new Color(0.2, 0.45, 0.95),
      coreRim: dark ? new Color(0.3, 0.65, 1.0) : new Color(0.08, 0.25, 0.8),
      wireColor: dark ? new Color(0.25, 0.55, 1.0) : new Color(0.12, 0.35, 0.85),
      ringColor: dark ? new Color(0.2, 0.6, 1.0) : new Color(0.15, 0.4, 0.9),
      particleMain: dark ? new Color(0.4, 0.7, 1.0) : new Color(0.1, 0.3, 0.8),
      particleAccent: dark ? new Color(0.3, 0.95, 0.65) : new Color(0.05, 0.75, 0.55),
      coreAlpha: dark ? 0.45 : 0.65,
      wireAlpha: dark ? 0.35 : 0.5,
    });

    let palette = getPalette(isDark);

    // Setup Renderer
    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Setup Camera
    const camera = new Camera(gl, { fov: 42 });
    camera.position.set(0, 0, 6.2);

    // Setup Scene Hierarchy
    const scene = new Transform();
    const pivot = new Transform();
    pivot.setParent(scene);

    // 1. Faceted Icosahedron Core (Sphere with low segments gives a beautiful geodesic polyhedral crystal)
    const coreGeo = new Sphere(gl, { radius: 1.35, widthSegments: 10, heightSegments: 8 });
    const coreProg = new Program(gl, {
      vertex: coreVertex,
      fragment: coreFragment,
      uniforms: {
        uColor: { value: palette.coreColor },
        uRimColor: { value: palette.coreRim },
        uTime: { value: 0 },
        uAlpha: { value: palette.coreAlpha },
      },
      transparent: true,
      cullFace: false,
    });
    const coreMesh = new Mesh(gl, { geometry: coreGeo, program: coreProg });
    coreMesh.setParent(pivot);

    // 2. Outer Wireframe Geodesic Cage (slightly larger)
    const wireGeo = new Sphere(gl, { radius: 1.55, widthSegments: 10, heightSegments: 8 });
    const wireProg = new Program(gl, {
      vertex: coreVertex,
      fragment: lineFragment,
      uniforms: {
        uColor: { value: palette.wireColor },
        uAlpha: { value: palette.wireAlpha },
      },
      transparent: true,
      cullFace: false,
    });
    const wireMesh = new Mesh(gl, { geometry: wireGeo, program: wireProg, mode: gl.LINES });
    wireMesh.setParent(pivot);

    // 3. Dual Gyroscopic Orbital Data Rings
    const ringGeo1 = new Torus(gl, { radius: 2.15, tube: 0.018, radialSegments: 6, tubularSegments: 80 });
    const ringProg1 = new Program(gl, {
      vertex: coreVertex,
      fragment: lineFragment,
      uniforms: {
        uColor: { value: palette.ringColor },
        uAlpha: { value: palette.wireAlpha * 0.9 },
      },
      transparent: true,
    });
    const ringMesh1 = new Mesh(gl, { geometry: ringGeo1, program: ringProg1 });
    ringMesh1.setParent(pivot);
    ringMesh1.rotation.x = Math.PI * 0.35;
    ringMesh1.rotation.y = Math.PI * 0.15;

    const ringGeo2 = new Torus(gl, { radius: 2.55, tube: 0.014, radialSegments: 6, tubularSegments: 80 });
    const ringProg2 = new Program(gl, {
      vertex: coreVertex,
      fragment: lineFragment,
      uniforms: {
        uColor: { value: palette.ringColor },
        uAlpha: { value: palette.wireAlpha * 0.75 },
      },
      transparent: true,
    });
    const ringMesh2 = new Mesh(gl, { geometry: ringGeo2, program: ringProg2 });
    ringMesh2.setParent(pivot);
    ringMesh2.rotation.x = -Math.PI * 0.3;
    ringMesh2.rotation.z = Math.PI * 0.25;

    // 4. Interactive 3D Neural Constellation Points
    const numPoints = 220;
    const positions = new Float32Array(numPoints * 3);
    const sizes = new Float32Array(numPoints);
    const phases = new Float32Array(numPoints);

    for (let i = 0; i < numPoints; i++) {
      // Golden spiral distribution on sphere with random radii for depth
      const theta = Math.acos(1 - 2 * (i / numPoints));
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.7 + Math.random() * 1.5;

      positions[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);

      sizes[i] = Math.random() * 1.5 + 0.6;
      phases[i] = Math.random();
    }

    const particleGeo = new Geometry(gl, {
      position: { size: 3, data: positions },
      aSize: { size: 1, data: sizes },
      aPhase: { size: 1, data: phases },
    });

    const particleProg = new Program(gl, {
      vertex: particleVertex,
      fragment: particleFragment,
      uniforms: {
        uColor: { value: palette.particleMain },
        uAccent: { value: palette.particleAccent },
        uTime: { value: 0 },
        uPulse: { value: 0 },
      },
      transparent: true,
    });

    const particleMesh = new Mesh(gl, { geometry: particleGeo, program: particleProg, mode: gl.POINTS });
    particleMesh.setParent(pivot);

    // Responsive Resize Handler
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Pointer Interaction with Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let pulseEnergy = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = Math.max(-1, Math.min(1, normX));
      mouseY = Math.max(-1, Math.min(1, normY));

      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      } else {
        targetRotY = mouseX * 0.6;
        targetRotX = -mouseY * 0.45;
      }

      setTelemetry((prev) => ({
        ...prev,
        x: Number(mouseX.toFixed(2)),
        y: Number(mouseY.toFixed(2)),
      }));
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      setIsInteracting(true);
      pulseEnergy = 1.0; // Trigger resonant expansion wave
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // Theme Change Listener
    const handleThemeChange = (e?: Event) => {
      const customEvent = e as CustomEvent<{ theme: "dark" | "light" }>;
      const nextTheme = customEvent?.detail?.theme || getTheme();
      const dark = nextTheme === "dark";
      palette = getPalette(dark);

      coreProg.uniforms.uColor.value = palette.coreColor;
      coreProg.uniforms.uRimColor.value = palette.coreRim;
      coreProg.uniforms.uAlpha.value = palette.coreAlpha;
      wireProg.uniforms.uColor.value = palette.wireColor;
      wireProg.uniforms.uAlpha.value = palette.wireAlpha;
      ringProg1.uniforms.uColor.value = palette.ringColor;
      ringProg1.uniforms.uAlpha.value = palette.wireAlpha * 0.9;
      ringProg2.uniforms.uColor.value = palette.ringColor;
      ringProg2.uniforms.uAlpha.value = palette.wireAlpha * 0.75;
      particleProg.uniforms.uColor.value = palette.particleMain;
      particleProg.uniforms.uAccent.value = palette.particleAccent;
    };

    window.addEventListener("portfolio-theme-change", handleThemeChange);
    const observer = new MutationObserver(() => handleThemeChange());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Animation Loop
    let animId = 0;
    let lastTime = 0;
    let frameCount = 0;
    let fpsTimer = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (lastTime === 0) lastTime = time;
      if (fpsTimer === 0) fpsTimer = time;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Track FPS
      frameCount++;
      if (time - fpsTimer >= 1000) {
        const measuredFps = Math.min(60, Math.max(1, Math.round((frameCount * 1000) / (time - fpsTimer))));
        setTelemetry((prev) => ({
          ...prev,
          fps: isNaN(measuredFps) ? 60 : measuredFps,
        }));
        frameCount = 0;
        fpsTimer = time;
      }

      // Smooth damping / inertia
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      const t = time * 0.001;
      const speed = reducedMotion ? 0.05 : 0.45;

      // Base gentle rotation
      pivot.rotation.x = currentRotX + Math.sin(t * 0.3) * 0.1;
      pivot.rotation.y = currentRotY + t * speed * 0.5;

      // Independent counter-rotation for orbital rings
      ringMesh1.rotation.z += delta * 0.6 * (1 + pulseEnergy * 1.5);
      ringMesh2.rotation.y -= delta * 0.45 * (1 + pulseEnergy * 1.5);
      wireMesh.rotation.y += delta * 0.2;

      // Decay click pulse energy
      pulseEnergy *= 0.94;
      if (pulseEnergy < 0.001) pulseEnergy = 0;

      // Update uniforms
      coreProg.uniforms.uTime.value = t;
      particleProg.uniforms.uTime.value = t;
      particleProg.uniforms.uPulse.value = pulseEnergy;

      renderer.render({ scene, camera });
    };

    animId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("portfolio-theme-change", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-3d-wrapper" ref={containerRef} aria-label="Interactive 3D Neural Constellation Visual">
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="hero-3d-canvas" />

      {/* Cybernetic HUD Overlays */}
      <div className="hero-3d-hud" aria-hidden="true">
        <div className="hud-corner top-left">
          <span className="hud-tag">
            <i className={`hud-beacon ${isInteracting ? "active" : ""}`} />
            SYS.CORE // INTELLIGENCE
          </span>
          <span className="hud-sub">3D_LATTICE · OGL_V2</span>
        </div>

        <div className="hud-corner top-right">
          <span className="hud-metric">{telemetry.fps} FPS</span>
          <span className="hud-sub">60HZ_OPT</span>
        </div>

        <div className="hud-corner bottom-left">
          <span className="hud-coords">
            POS: [{telemetry.x >= 0 ? `+${telemetry.x}` : telemetry.x},{" "}
            {telemetry.y >= 0 ? `+${telemetry.y}` : telemetry.y}]
          </span>
          <span className="hud-sub">VECTOR_INERTIA</span>
        </div>

        <div className="hud-corner bottom-right">
          <span className="hud-action">{isInteracting ? "ENGAGED" : "DRAG / TILT 3D"}</span>
          <span className="hud-sub">RESONANT_CORE</span>
        </div>

        {/* Framing Crosshairs */}
        <div className="hud-crosshair ch-tl">+</div>
        <div className="hud-crosshair ch-tr">+</div>
        <div className="hud-crosshair ch-bl">+</div>
        <div className="hud-crosshair ch-br">+</div>
      </div>
    </div>
  );
}
