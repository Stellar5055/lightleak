import { describe, expect, it } from 'vitest';
import {
  type Prism,
  type Ray,
  type Rect,
  type Sphere,
  intersectPrimitive,
  intersectPrism,
  intersectRect,
  intersectSphere,
} from '../src/optics/primitives';
import { closestHit } from '../src/optics/trace';
import {
  add,
  cross,
  dot,
  length,
  normalize,
  reflect,
  scale,
  sub,
  vec3,
  type Vec3,
} from '../src/optics/vec3';

const ray = (origin: Vec3, direction: Vec3): Ray => ({
  origin,
  direction: normalize(direction),
});

const sphere: Sphere = {
  kind: 'sphere',
  id: 'sphere',
  center: vec3(0, 0, 0),
  radius: 1,
};

const bench: Rect = {
  kind: 'rect',
  id: 'bench',
  center: vec3(0, 0, 0),
  normal: vec3(0, 1, 0),
  right: vec3(1, 0, 0),
  up: vec3(0, 0, 1),
  halfWidth: 1.2,
  halfHeight: 0.7,
};

const screen: Rect = {
  kind: 'rect',
  id: 'screen',
  center: vec3(0, 0.19, -0.66),
  normal: vec3(0, 0, 1),
  right: vec3(1, 0, 0),
  up: vec3(0, 1, 0),
  halfWidth: 0.6,
  halfHeight: 0.19,
};

const prism: Prism = {
  kind: 'prism',
  id: 'prism',
  center: vec3(0, 0, 0),
  side: 0.26,
  height: 0.22,
  rotation: 0,
};

describe('vec3', () => {
  it('adds, subtracts and scales', () => {
    expect(add(vec3(1, 2, 3), vec3(4, 5, 6))).toEqual(vec3(5, 7, 9));
    expect(sub(vec3(1, 2, 3), vec3(4, 5, 6))).toEqual(vec3(-3, -3, -3));
    expect(scale(vec3(1, 2, 3), 2)).toEqual(vec3(2, 4, 6));
  });

  it('computes dot, cross and length', () => {
    expect(dot(vec3(1, 2, 3), vec3(4, 5, 6))).toBe(32);
    expect(cross(vec3(1, 2, 3), vec3(4, 5, 6))).toEqual(
      vec3(-3, 6, -3),
    );
    expect(length(vec3(1, 2, 3))).toBeCloseTo(Math.sqrt(14), 10);
  });

  it('normalizes and reflects', () => {
    expect(length(normalize(vec3(3, 4, 0)))).toBeCloseTo(1, 10);
    expect(reflect(vec3(1, -1, 0), vec3(0, 1, 0))).toEqual(
      vec3(1, 1, 0),
    );
  });
});

describe('sphere', () => {
  it('hits the near surface from outside', () => {
    const hit = intersectSphere(sphere, ray(vec3(-3, 0, 0), vec3(1, 0, 0)));
    expect(hit).not.toBeNull();
    expect(hit!.t).toBeCloseTo(2, 6);
    expect(hit!.point.x).toBeCloseTo(-1, 6);
    expect(hit!.normal.x).toBeCloseTo(-1, 6);
  });

  it('exits from inside', () => {
    const hit = intersectSphere(sphere, ray(vec3(0, 0, 0), vec3(1, 0, 0)));
    expect(hit).not.toBeNull();
    expect(hit!.t).toBeCloseTo(1, 6);
    expect(hit!.point.x).toBeCloseTo(1, 6);
    expect(hit!.normal.x).toBeCloseTo(1, 6);
  });

  it('misses and handles a tangent without NaN', () => {
    expect(
      intersectSphere(sphere, ray(vec3(0, 2, 0), vec3(1, 0, 0))),
    ).toBeNull();

    const tangent = intersectSphere(
      sphere,
      ray(vec3(-2, 1, 0), vec3(1, 0, 0)),
    );
    expect(tangent).not.toBeNull();
    expect(tangent!.t).toBeCloseTo(2, 6);
    expect(tangent!.point.y).toBeCloseTo(1, 6);
    expect(Number.isNaN(tangent!.normal.y)).toBe(false);
  });

  it('dispatches through the primitive union', () => {
    expect(
      intersectPrimitive(sphere, ray(vec3(-3, 0, 0), vec3(1, 0, 0))),
    ).not.toBeNull();
  });
});

describe('rectangles', () => {
  it('hits the bench plane inside its bounds', () => {
    const hit = intersectRect(bench, ray(vec3(0, 1, 0), vec3(0, -1, 0)));
    expect(hit).not.toBeNull();
    expect(hit!.t).toBeCloseTo(1, 6);
    expect(hit!.point.y).toBeCloseTo(0, 6);
    expect(hit!.normal).toEqual(vec3(0, 1, 0));
  });

  it('hits the screen inside its bounds', () => {
    const hit = intersectRect(screen, ray(vec3(0, 0.1, 0), vec3(0, 0, -1)));
    expect(hit).not.toBeNull();
    expect(hit!.point.z).toBeCloseTo(-0.66, 6);
    expect(hit!.point.y).toBeCloseTo(0.1, 6);
  });

  it('rejects a hit outside the rectangle', () => {
    expect(
      intersectRect(screen, ray(vec3(2, 0.1, 0), vec3(0, 0, -1))),
    ).toBeNull();
  });

  it('rejects a ray parallel to the plane', () => {
    expect(
      intersectRect(screen, ray(vec3(0, 0.1, 0), vec3(1, 0, 0))),
    ).toBeNull();
  });
});

describe('prism', () => {
  it('enters a side face with an outward normal', () => {
    const hit = intersectPrism(
      prism,
      ray(vec3(-1, 0.11, 0), vec3(1, 0, 0)),
    );
    expect(hit).not.toBeNull();
    expect(hit!.point.y).toBeCloseTo(0.11, 6);
    expect(dot(hit!.normal, vec3(1, 0, 0))).toBeLessThan(0);
  });

  it('exits from inside', () => {
    const hit = intersectPrism(prism, ray(vec3(0, 0.11, 0), vec3(1, 0, 0)));
    expect(hit).not.toBeNull();
    expect(dot(hit!.normal, vec3(1, 0, 0))).toBeGreaterThan(0);
  });

  it('hits the top cap from above', () => {
    const hit = intersectPrism(
      prism,
      ray(vec3(0, 0.5, 0), vec3(0, -1, 0)),
    );
    expect(hit).not.toBeNull();
    expect(hit!.point.y).toBeCloseTo(0.22, 6);
    expect(hit!.normal.y).toBeCloseTo(1, 6);
    expect(hit!.t).toBeCloseTo(0.28, 6);
  });

  it('misses a ray above the prism', () => {
    expect(
      intersectPrism(prism, ray(vec3(-1, 0.5, 0), vec3(1, 0, 0))),
    ).toBeNull();
  });
});

describe('closestHit', () => {
  const front: Sphere = {
    kind: 'sphere',
    id: 'front',
    center: vec3(0, 0, 0),
    radius: 1,
  };
  const behind: Sphere = {
    kind: 'sphere',
    id: 'behind',
    center: vec3(0, 0, 5),
    radius: 1,
  };

  it('keeps the nearest surface', () => {
    const hit = closestHit(
      [screen, front],
      ray(vec3(0, 0, 3), vec3(0, 0, -1)),
    );
    expect(hit).not.toBeNull();
    expect(hit!.kind).toBe('sphere');
    expect(hit!.objectId).toBe('front');
  });

  it('ignores a primitive behind the origin', () => {
    const hit = closestHit(
      [behind, screen],
      ray(vec3(0, 0, 3), vec3(0, 0, -1)),
    );
    expect(hit).not.toBeNull();
    expect(hit!.kind).toBe('rect');
    expect(hit!.objectId).toBe('screen');
  });

  it('returns null for an empty or missed scene', () => {
    expect(
      closestHit([], ray(vec3(0, 0, 3), vec3(0, 0, -1))),
    ).toBeNull();
    expect(
      closestHit([front], ray(vec3(0, 0, 3), vec3(0, 0, 1))),
    ).toBeNull();
  });
});
