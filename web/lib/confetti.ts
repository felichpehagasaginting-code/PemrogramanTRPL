const isLowEndDevice = () =>
  typeof navigator !== "undefined" &&
  ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 6);

const THROTTLE_MS = isLowEndDevice() ? 66 : 16; // ~15fps on low-end, ~60fps on high-end

let lastCall = 0;

export async function fireConfetti(options?: Record<string, unknown>) {
  const now = Date.now();
  if (now - lastCall < THROTTLE_MS) return;
  lastCall = now;

  const confetti = (await import("canvas-confetti")).default;
  confetti(options || { particleCount: 80, spread: 60, origin: { y: 0.6 } });
}

export async function fireConfettiBurst(duration = 2000) {
  const now = Date.now();
  if (now - lastCall < 100) return;
  lastCall = now;

  const confetti = (await import("canvas-confetti")).default;
  const end = Date.now() + duration;
  const colors = ["#FF6B00", "#FF9D00", "#FFB347"];

  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
