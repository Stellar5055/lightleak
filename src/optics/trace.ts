import { Hit, Primitive, Ray, intersectPrimitive } from './primitives';

/**
 * Nearest forward surface hit. The epsilon rejects the surface the ray just
 * left, and any primitive behind the origin.
 */
export function closestHit(
  primitives: readonly Primitive[],
  ray: Ray,
  epsilon = 1e-4,
): Hit | null {
  let best: Hit | null = null;

  for (const primitive of primitives) {
    const hit = intersectPrimitive(primitive, ray);
    if (!hit || hit.t <= epsilon) continue;
    if (!best || hit.t < best.t) best = hit;
  }

  return best;
}
