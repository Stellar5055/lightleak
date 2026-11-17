import {
  Vec3,
  add,
  dot,
  normalize,
  reflect,
  scale,
} from './vec3';

export const RAY_EPSILON = 1e-4;

export type SurfaceResponse = {
  entering: boolean;
  /** Normal facing against the incoming ray. */
  normal: Vec3;
  n1: number;
  n2: number;
  reflected: Vec3;
  transmitted: Vec3 | null;
  reflectance: number;
  transmittance: number;
  tir: boolean;
};

/** Schlick approximation. `cosI` is the cosine of the incidence angle. */
export function fresnelReflectance(
  n1: number,
  n2: number,
  cosI: number,
): number {
  const r0 = ((n1 - n2) / (n1 + n2)) ** 2;
  const c = clamp01(cosI);
  return clamp01(r0 + (1 - r0) * (1 - c) ** 5);
}

/** Critical angle in radians, or null when TIR is impossible (n1 <= n2). */
export function criticalAngle(n1: number, n2: number): number | null {
  if (n1 <= 0 || n2 <= 0 || n1 <= n2) return null;
  return Math.asin(n2 / n1);
}

export function criticalAngleDegrees(
  n1: number,
  n2: number,
): number | null {
  const angle = criticalAngle(n1, n2);
  return angle === null ? null : (angle * 180) / Math.PI;
}

/**
 * Vector Snell's law. `n` must face against `d`. Returns null on total
 * internal reflection or a degenerate direction.
 */
export function refractDirection(
  d: Vec3,
  n: Vec3,
  n1: number,
  n2: number,
): Vec3 | null {
  if (n1 <= 0 || n2 <= 0) return null;

  const cosI = clamp01(-dot(d, n));
  const eta = n1 / n2;
  const sin2T = eta * eta * (1 - cosI * cosI);
  if (sin2T > 1) return null;

  const cosT = Math.sqrt(Math.max(0, 1 - sin2T));
  const out = normalize(
    add(scale(d, eta), scale(n, eta * cosI - cosT)),
  );

  if (
    !Number.isFinite(out.x) ||
    !Number.isFinite(out.y) ||
    !Number.isFinite(out.z) ||
    (out.x === 0 && out.y === 0 && out.z === 0)
  ) {
    return null;
  }
  return out;
}

/**
 * Track the medium at a boundary. `outwardNormal` comes from the object;
 * `outsideIor` is air (or another host medium), `insideIor` is the object.
 */
export function interactWithSurface(
  d: Vec3,
  outwardNormal: Vec3,
  outsideIor: number,
  insideIor: number,
): SurfaceResponse {
  const entering = dot(d, outwardNormal) < 0;
  const normal = entering ? outwardNormal : scale(outwardNormal, -1);
  const n1 = entering ? outsideIor : insideIor;
  const n2 = entering ? insideIor : outsideIor;

  const cosI = clamp01(-dot(d, normal));
  const reflected = normalize(reflect(d, normal));
  const transmitted = refractDirection(d, normal, n1, n2);

  if (!transmitted) {
    return {
      entering,
      normal,
      n1,
      n2,
      reflected,
      transmitted: null,
      reflectance: 1,
      transmittance: 0,
      tir: true,
    };
  }

  const reflectance = fresnelReflectance(n1, n2, cosI);
  return {
    entering,
    normal,
    n1,
    n2,
    reflected,
    transmitted,
    reflectance,
    transmittance: 1 - reflectance,
    tir: false,
  };
}

/** Offset along a normalized direction so the next ray does not self-hit. */
export function offsetOrigin(
  point: Vec3,
  direction: Vec3,
  epsilon = RAY_EPSILON,
): Vec3 {
  return add(point, scale(direction, epsilon));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
