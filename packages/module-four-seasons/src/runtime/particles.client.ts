import { defineNuxtPlugin, useRuntimeConfig } from '#app';

type ParticleType = 'snow' | 'leaves' | 'blossom' | 'sunflower';

// Autumn leaf tones — leaves look wrong in a single flat color, so each leaf
// picks one of these at random instead of using the configured `color`.
const LEAF_COLORS = ['#c9772e', '#a13d2a', '#d99a2b', '#8a5a2b', '#b5451b', '#e0b23c'];
// Cherry blossom tones for the spring 'blossom' particle type.
const BLOSSOM_COLORS = ['#ffd1dc', '#ffb3c6', '#ff8fab', '#f6a5c0', '#fcdfe8'];
// Sunflower petal tones for the summer 'sunflower' particle type.
const SUNFLOWER_COLORS = ['#ffcc00', '#ffb703', '#f4a900', '#e8a33d', '#fdd835'];
// Dark seed-head color at the center of each sunflower.
const SUNFLOWER_CENTER_COLOR = '#5b3a1e';

// Particle types that flutter side to side as they fall, like a real petal or
// leaf, rather than drifting steadily like snow.
const FLUTTERING_TYPES: ParticleType[] = ['leaves', 'blossom', 'sunflower'];

const DEFAULT_FLAKE_COUNT = 60;
const MIN_FLAKE_COUNT = 0;
const MAX_FLAKE_COUNT = 500;

const clampFlakeCount = (flakeCount: number): number => {
  if (!Number.isFinite(flakeCount)) {
    return DEFAULT_FLAKE_COUNT;
  }

  return Math.min(MAX_FLAKE_COUNT, Math.max(MIN_FLAKE_COUNT, Math.trunc(flakeCount)));
};

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  swayPhase: number;
  swayAmplitude: number;
  color: string;
}

export default defineNuxtPlugin(() => {
  // Flat keys, not a nested object — the editor's ParticleType.vue setting
  // writes to these same keys via useSiteSettings(), so a live merchant
  // override is picked up here without a rebuild.
  const publicConfig = useRuntimeConfig().public as {
    fourSeasonsParticleType?: ParticleType;
    fourSeasonsFlakeCount?: number;
    fourSeasonsColor?: string;
  };

  const canvas = document.createElement('canvas');
  canvas.setAttribute('data-testid', 'four-seasons-canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2147483647';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const particleType = publicConfig.fourSeasonsParticleType ?? 'leaves';
  const particleCount = clampFlakeCount(publicConfig.fourSeasonsFlakeCount ?? DEFAULT_FLAKE_COUNT);
  const snowColor = publicConfig.fourSeasonsColor ?? '#ffffff';
  const flutters = FLUTTERING_TYPES.includes(particleType);

  const randomFrom = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

  const randomParticleColor = () => {
    switch (particleType) {
      case 'leaves':
        return randomFrom(LEAF_COLORS);
      case 'blossom':
        return randomFrom(BLOSSOM_COLORS);
      case 'sunflower':
        return randomFrom(SUNFLOWER_COLORS);
      default:
        return snowColor;
    }
  };

  const particles: Particle[] = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5,
    drift: Math.random() * 1 - 0.5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: Math.random() * 0.04 - 0.02,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmplitude: Math.random() * 0.6 + 0.2,
    color: randomParticleColor(),
  }));

  let frame = 0;

  const drawSnowflake = (particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  // A pointed, almond-shaped blade with a center vein — reads as a leaf at a
  // glance, unlike a plain circle or ellipse.
  const drawLeaf = (particle: Particle) => {
    const size = particle.radius * 2.4;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.8, size * 0.5, 0, size);
    ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.9);
    ctx.lineTo(0, size * 0.9);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = Math.max(0.5, size * 0.08);
    ctx.stroke();

    ctx.restore();
  };

  // A single rounded petal shape for the 'blossom' particle type.
  const drawPetal = (particle: Particle) => {
    const size = particle.radius * 2.2;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.55, size, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // A tiny flower: a ring of petals radiating from a dark seed-head center —
  // reads as a sunflower at a glance, unlike a single flat petal.
  const drawSunflower = (particle: Particle) => {
    const size = particle.radius * 1.8;
    const petalCount = 8;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = particle.color;
    for (let i = 0; i < petalCount; i += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / petalCount);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.6, size * 0.28, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = SUNFLOWER_CENTER_COLOR;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 1;

    for (const particle of particles) {
      switch (particleType) {
        case 'leaves':
          drawLeaf(particle);
          break;
        case 'blossom':
          drawPetal(particle);
          break;
        case 'sunflower':
          drawSunflower(particle);
          break;
        default:
          drawSnowflake(particle);
      }

      particle.y += particle.speed;
      particle.rotation += particle.rotationSpeed;

      if (flutters) {
        // Leaves and petals flutter side to side as they fall; snow drifts more steadily.
        particle.x += particle.drift + Math.sin(frame * 0.02 + particle.swayPhase) * particle.swayAmplitude;
      } else {
        particle.x += particle.drift;
      }

      if (particle.y > canvas.height) {
        particle.y = -particle.radius;
        particle.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(draw);
  };
  draw();
});
