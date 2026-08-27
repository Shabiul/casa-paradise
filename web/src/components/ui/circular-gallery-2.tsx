"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------
* Types
----------------------------------- */
export interface GalleryItem {
  image: string;
  text?: string;
}

interface CircularGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An array of image and text objects for the gallery.
   */
  items?: GalleryItem[];
  /**
   * The amount of curvature. Higher values create a stronger bend.
   * @default 1.6
   */
  bend?: number;
  /**
   * The border radius for the images, as a percentage (0.0 to 0.5).
   * @default 0.05
   */
  borderRadius?: number;
  /**
   * Multiplier for scroll interaction speed.
   * @default 2.2
   */
  scrollSpeed?: number;
  /**
   * Easing factor for the scroll animation (lower is smoother).
   * @default 0.04
   */
  scrollEase?: number;
  /**
   * Optional class name to override the default font (e.g., from Next/font).
   */
  fontClassName?: string;
}

/* --------------------------------
* OGL Helper Utilities
----------------------------------- */
function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof (instance as any)[key] === "function") {
      (instance as any)[key] = (instance as any)[key].bind(instance);
    }
  });
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font: string,
  color: string,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

/* --------------------------------
* OGL Classes
----------------------------------- */
class Title {
  gl: OGLRenderingContext;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor,
    font,
  }: {
    gl: OGLRenderingContext;
    plane: Mesh;
    renderer: Renderer;
    text: string;
    textColor: string;
    font: string;
  }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    if (this.text && this.text.trim().length > 0) {
      this.createMesh();
    }
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.12;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.08;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  gl: OGLRenderingContext;
  geometry: Plane;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  extra: number = 0;
  widthTotal: number = 0;
  width: number = 0;
  x: number = 0;
  scale: number = 1;
  padding: number = 2;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0.05,
    font,
  }: {
    geometry: Plane;
    gl: OGLRenderingContext;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.2 + cos(p.y * 2.0 + uTime) * 1.2) * (0.05 + uSpeed * 0.3);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.003;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: { current: number; last: number },
    _direction: "left" | "right",
  ) {
    if (!this.widthTotal || this.widthTotal <= 0) return;

    // Continuous centered modulo wrapping:
    // Ensures cards are seamlessly arranged around center (x=0) within [-widthTotal/2, widthTotal/2]
    let currentX = (this.x - scroll.current) % this.widthTotal;
    if (currentX > this.widthTotal / 2) {
      currentX -= this.widthTotal;
    } else if (currentX < -this.widthTotal / 2) {
      currentX += this.widthTotal;
    }

    this.plane.position.x = currentX;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H * 1.3);
      const arc = R - Math.sqrt(Math.max(0, R * R - effectiveX * effectiveX));

      // With positive bend: center card is highest, ends curve down smoothly
      const yOffset = this.bend > 0 ? (B_abs * 0.18) : -(B_abs * 0.18);
      if (this.bend > 0) {
        this.plane.position.y = yOffset - arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      } else {
        this.plane.position.y = yOffset + arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;
  }

  onResize(
    {
      screen,
      viewport,
    }: {
      screen?: { width: number; height: number };
      viewport?: { width: number; height: number };
    } = {},
  ) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if ((this.plane.program.uniforms as any).uViewportSizes) {
        (
          this.plane.program.uniforms as any
        ).uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }

    const screenWidth = this.screen?.width || (typeof window !== "undefined" ? window.innerWidth : 1200);
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;

    // Portrait aspect ratio for cards: 0.74 (width / height)
    const cardAspect = 0.74;

    // Display exactly 5 cards tiled across the screen on desktop with tight, gapless spacing
    const cardsPerScreen = isMobile ? 1.75 : isTablet ? 3.2 : 4.8;
    const targetStep = this.viewport.width / cardsPerScreen;

    // Card width takes 90% of the step, leaving only a 10% elegant gap
    let cardWidth = targetStep * 0.90;
    let cardHeight = cardWidth / cardAspect;

    const maxCardHeight = this.viewport.height * (isMobile ? 0.84 : 0.88);
    if (cardHeight > maxCardHeight) {
      cardHeight = maxCardHeight;
      cardWidth = cardHeight * cardAspect;
    }

    this.plane.scale.set(cardWidth, cardHeight, 1);
    this.program.uniforms.uPlaneSizes.value = [
      cardWidth,
      cardHeight,
    ];

    this.padding = targetStep - cardWidth;
    this.width = targetStep;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scrollEase: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  mediasImages!: GalleryItem[];
  medias!: Media[];
  isDown: boolean = false;
  startX: number = 0;
  lastX: number = 0;
  velocity: number = 0;
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf!: number;
  resizeObserver?: ResizeObserver;
  wheelTimeout?: NodeJS.Timeout;

  boundOnResize!: () => void;
  boundOnWheel!: (e: WheelEvent) => void;
  boundOnDown!: (e: MouseEvent | TouchEvent | PointerEvent) => void;
  boundOnMove!: (e: MouseEvent | TouchEvent | PointerEvent) => void;
  boundOnUp!: (e: MouseEvent | TouchEvent | PointerEvent) => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    }: {
      items?: GalleryItem[];
      bend: number;
      textColor: string;
      borderRadius: number;
      font: string;
      scrollSpeed: number;
      scrollEase: number;
    },
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scrollEase = scrollEase;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };

    autoBind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.onResize();
    this.update();
    this.addEventListeners();

    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        this.onResize();
      });
      setTimeout(() => {
        this.onResize();
      }, 100);
    }
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    const canvas = this.gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    this.container.appendChild(canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
  ) {
    const defaultItems: GalleryItem[] = [
      { image: '/assets/wa-photo-10.jpeg', text: 'Heritage Villa' },
      { image: '/assets/WhatsApp Image 2026-08-07 at 4.34.56 PM.jpeg', text: 'Classic Suite' },
      { image: '/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg', text: 'Fontainhas Heritage' },
      { image: '/assets/ChatGPT Image Aug 7, 2026, 06_03_51 PM.png', text: 'Heritage Room' },
      { image: '/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg', text: 'Panjim Church' },
    ];

    const galleryItems = items && items.length > 0 ? items : defaultItems;
    // Duplicate 3 times for a seamless continuous loop
    this.mediasImages = [...galleryItems, ...galleryItems, ...galleryItems];
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen || { width: 1200, height: 600 },
        text: data.text || '',
        viewport: this.viewport || { width: 30, height: 16.5 },
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  getClientX(e: MouseEvent | TouchEvent | PointerEvent): number {
    if ("touches" in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return (e as MouseEvent | PointerEvent).clientX;
  }

  onDown(e: MouseEvent | TouchEvent | PointerEvent) {
    if ("button" in e && e.button !== 0) return;
    this.isDown = true;
    const clientX = this.getClientX(e);
    this.startX = clientX;
    this.lastX = clientX;
    this.velocity = 0;
    this.scroll.position = this.scroll.current;
    this.scroll.target = this.scroll.current;
    this.scroll.ease = 0.35; // Immediate tactile follow-through during drag
    this.container.style.cursor = "grabbing";
    if (typeof document !== "undefined") {
      document.body.style.userSelect = "none";
    }
  }

  onMove(e: MouseEvent | TouchEvent | PointerEvent) {
    if (!this.isDown) return;
    const clientX = this.getClientX(e);
    const pixelTo3D = (this.viewport && this.screen && this.screen.width > 0)
      ? (this.viewport.width / this.screen.width)
      : 0.024;
    const deltaX = this.startX - clientX;
    this.velocity = (this.lastX - clientX) * pixelTo3D;
    this.lastX = clientX;

    // Direct 1:1 rotation mapping:
    // Dragging right -> rotate clockwise
    // Dragging left  -> rotate counter-clockwise
    this.scroll.target = (this.scroll.position || 0) + deltaX * pixelTo3D * 1.35;
  }

  onUp() {
    if (!this.isDown) return;
    this.isDown = false;
    this.scroll.ease = this.scrollEase || 0.04;
    this.scroll.target += this.velocity * 5; // Inertia throw
    this.container.style.cursor = "grab";
    if (typeof document !== "undefined") {
      document.body.style.userSelect = "";
    }
    this.snapToNearestCard();
  }

  snapToNearestCard() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    if (width <= 0) return;
    const targetIndex = Math.round(this.scroll.target / width);
    this.scroll.target = targetIndex * width;
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const pixelTo3D = (this.viewport && this.screen && this.screen.width > 0)
      ? (this.viewport.width / this.screen.width)
      : 0.024;
    this.scroll.target += (delta > 0 ? 1 : -1) * this.scrollSpeed * 10 * pixelTo3D;
    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    this.wheelTimeout = setTimeout(() => {
      this.snapToNearestCard();
    }, 250);
  }

  onResize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || this.container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
    const height = rect.height || this.container.clientHeight || 650;

    this.screen = { width, height };
    this.renderer.setSize(width, height);
    this.camera.perspective({
      aspect: width / height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const vHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const vWidth = vHeight * this.camera.aspect;
    this.viewport = { width: vWidth, height: vHeight };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }

  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  }

  addEventListeners() {
    this.boundOnResize = this.onResize;
    this.boundOnWheel = this.onWheel;
    this.boundOnDown = this.onDown;
    this.boundOnMove = this.onMove;
    this.boundOnUp = this.onUp;

    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel, { passive: true });

    // Primary: Pointer Events
    this.container.addEventListener("pointerdown", this.boundOnDown);
    window.addEventListener("pointermove", this.boundOnMove);
    window.addEventListener("pointerup", this.boundOnUp);
    window.addEventListener("pointercancel", this.boundOnUp);

    // Fallback: Mouse Events
    this.container.addEventListener("mousedown", this.boundOnDown);
    window.addEventListener("mousemove", this.boundOnMove);
    window.addEventListener("mouseup", this.boundOnUp);

    // Fallback: Touch Events
    this.container.addEventListener("touchstart", this.boundOnDown, { passive: true });
    window.addEventListener("touchmove", this.boundOnMove, { passive: true });
    window.addEventListener("touchend", this.boundOnUp);

    if (typeof ResizeObserver !== "undefined" && this.container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.onResize();
      });
      this.resizeObserver.observe(this.container);
    }
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.container) {
      this.container.removeEventListener("wheel", this.boundOnWheel);
      this.container.removeEventListener("pointerdown", this.boundOnDown);
      this.container.removeEventListener("mousedown", this.boundOnDown);
      this.container.removeEventListener("touchstart", this.boundOnDown);
    }
    window.removeEventListener("pointermove", this.boundOnMove);
    window.removeEventListener("pointerup", this.boundOnUp);
    window.removeEventListener("pointercancel", this.boundOnUp);
    window.removeEventListener("mousemove", this.boundOnMove);
    window.removeEventListener("mouseup", this.boundOnUp);
    window.removeEventListener("touchmove", this.boundOnMove);
    window.removeEventListener("touchend", this.boundOnUp);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

/* --------------------------------
* React Component
----------------------------------- */
const CircularGallery = ({
  items,
  bend = 1.6,
  borderRadius = 0.05,
  scrollSpeed = 2.2,
  scrollEase = 0.04,
  className,
  fontClassName,
  ...props
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get computed styles for theme-adaptive text
    const computedStyle = getComputedStyle(containerRef.current);
    const computedColor = computedStyle.color || "#059669";
    const computedFontWeight = computedStyle.fontWeight || "600";
    const computedFontSize = computedStyle.fontSize || "20px";
    const computedFontFamily = computedStyle.fontFamily || "'Plus Jakarta Sans', sans-serif";

    const computedFont = `${computedFontWeight} ${computedFontSize} ${computedFontFamily}`;

    const app = new App(containerRef.current, {
      items,
      bend,
      textColor: computedColor,
      borderRadius,
      font: computedFont,
      scrollSpeed,
      scrollEase,
    });

    return () => {
      app.destroy();
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, fontClassName]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[500px] overflow-hidden cursor-grab active:cursor-grabbing select-none",
        "font-bold text-[20px]",
        fontClassName,
        className,
      )}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "grab",
      }}
      {...props}
    />
  );
};

export { CircularGallery };
export default CircularGallery;
