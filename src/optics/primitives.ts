import { Vec3, add, dot, normalize, scale, sub, vec3 } from './vec3';

export type Ray = {
  origin: Vec3;
  direction: Vec3;
};

export type HitKind = 'sphere' | 'rect' | 'prism';

export type Hit = {
  t: number;
  point: Vec3;
  /** Outward surface normal. */
  normal: Vec3;
  objectId: string;
  kind: HitKind;
};

export type Sphere = {
  kind: 'sphere';
  id: string;
  center: Vec3;
  radius: number;
};

/**
 * A finite rectangle on a plane. The bench and screen are rectangles; a plane
 * is just a rectangle with bounds large enough to ignore.
 */
export type Rect = {
  kind: 'rect';
  id: string;
  center: Vec3;
  normal: Vec3;
  right: Vec3;
  up: Vec3;
  halfWidth: number;
  halfHeight: number;
};

/**
 * Equilateral triangular prism. `center` is the centre of the base on the
 * bench (y = 0); the prism rises to `center.y + height`. The triangle's
 * circumradius is side / sqrt(3); its face normals sit at 60/180/300 degrees,
 * plus the rotation around Y.
 */
export type Prism = {
  kind: 'prism';
  id: string;
  center: Vec3;
  side: number;
  height: number;
  rotation: number;
};

export type Primitive = Sphere | Rect | Prism;

const EPS = 1e-6;

export function intersectSphere(sphere: Sphere, ray: Ray): Hit | null {
  const oc = sub(ray.origin, sphere.center);
  const a = dot(ray.direction, ray.direction);
  if (a < 1e-12) return null;

  const b = 2 * dot(oc, ray.direction);
  const c = dot(oc, oc) - sphere.radius * sphere.radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;

  const root = Math.sqrt(discriminant);
  const t0 = (-b - root) / (2 * a);
  const t1 = (-b + root) / (2 * a);

  let t = t0;
  if (t <= EPS) t = t1;
  if (t <= EPS) return null;

  const point = add(ray.origin, scale(ray.direction, t));
  return {
    t,
    point,
    normal: normalize(sub(point, sphere.center)),
    objectId: sphere.id,
    kind: 'sphere',
  };
}

export function intersectRect(rect: Rect, ray: Ray): Hit | null {
  const denom = dot(rect.normal, ray.direction);
  if (Math.abs(denom) < 1e-9) return null;

  const t = dot(sub(rect.center, ray.origin), rect.normal) / denom;
  if (t <= EPS) return null;

  const point = add(ray.origin, scale(ray.direction, t));
  const local = sub(point, rect.center);
  const u = dot(local, rect.right);
  const v = dot(local, rect.up);

  if (Math.abs(u) > rect.halfWidth || Math.abs(v) > rect.halfHeight) {
    return null;
  }

  return {
    t,
    point,
    normal: rect.normal,
    objectId: rect.id,
    kind: 'rect',
  };
}

type Plane = { n: Vec3; d: number };

function prismPlanes(prism: Prism): Plane[] {
  const circumradius = prism.side / Math.sqrt(3);
  const inradius = circumradius / 2;

  // The mesh is a 3-sided CylinderGeometry: vertices at 0/120/240 degrees,
  // faces at 60/180/300 degrees. Add the rotation around Y.
  const planes: Plane[] = [60, 180, 300].map((degrees) => {
    const phi = (degrees * Math.PI) / 180 + prism.rotation;
    return {
      n: vec3(Math.sin(phi), 0, Math.cos(phi)),
      d: inradius,
    };
  });

  planes.push({ n: vec3(0, -1, 0), d: 0 });
  planes.push({ n: vec3(0, 1, 0), d: prism.height });
  return planes;
}

export function intersectPrism(prism: Prism, ray: Ray): Hit | null {
  const origin = sub(ray.origin, prism.center);
  let tMin = -Infinity;
  let tMax = Infinity;
  let normalMin: Vec3 | null = null;
  let normalMax: Vec3 | null = null;

  for (const plane of prismPlanes(prism)) {
    const denom = dot(plane.n, ray.direction);
    const distance = plane.d - dot(plane.n, origin);

    if (Math.abs(denom) < 1e-9) {
      if (distance < 0) return null;
      continue;
    }

    const t = distance / denom;
    if (denom < 0) {
      if (t > tMin) {
        tMin = t;
        normalMin = plane.n;
      }
    } else if (t < tMax) {
      tMax = t;
      normalMax = plane.n;
    }
  }

  if (tMax < EPS || tMin >= tMax) return null;

  const t = tMin > EPS ? tMin : tMax;
  const normal = tMin > EPS ? normalMin : normalMax;
  if (!normal) return null;

  return {
    t,
    point: add(ray.origin, scale(ray.direction, t)),
    normal,
    objectId: prism.id,
    kind: 'prism',
  };
}

export function intersectPrimitive(
  primitive: Primitive,
  ray: Ray,
): Hit | null {
  switch (primitive.kind) {
    case 'sphere':
      return intersectSphere(primitive, ray);
    case 'rect':
      return intersectRect(primitive, ray);
    case 'prism':
      return intersectPrism(primitive, ray);
  }
}
