import { describe, expect, it } from 'vitest';
import {
  RAY_EPSILON,
  criticalAngle,
  criticalAngleDegrees,
  fresnelReflectance,
  interactWithSurface,
  offsetOrigin,
  refractDirection,
} from '../src/optics/surface';
import { dot, length, normalize, vec3 } from '../src/optics/vec3';

const surfaceNormal = vec3(0, 0, 1);
const degrees = (radians: number) => (radians * 180) / Math.PI;

describe('Snell', () => {
  it('passes straight through at normal incidence', () => {
    const incoming = vec3(0, 0, -1);
    const response = interactWithSurface(incoming, surfaceNormal, 1, 1.52);

    expect(response.entering).toBe(true);
    expect(response.transmitted).not.toBeNull();
    expect(dot(response.transmitted!, incoming)).toBeCloseTo(1, 6);
    expect(response.reflectance + response.transmittance).toBeCloseTo(1, 10);
    expect(response.reflected).toEqual(vec3(0, 0, 1));
  });

  it('refracts air to glass at 30 degrees to about 19.2 degrees', () => {
    const incoming = normalize(
      vec3(Math.sin(Math.PI / 6), 0, -Math.cos(Math.PI / 6)),
    );
    const outgoing = refractDirection(incoming, surfaceNormal, 1, 1.52);

    expect(outgoing).not.toBeNull();
    const angle = degrees(Math.acos(Math.abs(outgoing!.z)));
    expect(angle).toBeCloseTo(19.2, 1);
  });

  it('totally internally reflects glass to air at 45 degrees', () => {
    const incoming = normalize(vec3(1, 0, 1));
    const response = interactWithSurface(incoming, surfaceNormal, 1, 1.52);

    expect(response.entering).toBe(false);
    expect(response.tir).toBe(true);
    expect(response.transmitted).toBeNull();
    expect(response.reflectance).toBe(1);
    expect(response.transmittance).toBe(0);
    expect(length(response.reflected)).toBeCloseTo(1, 6);
    expect(Math.abs(response.reflected.z)).toBeCloseTo(Math.SQRT1_2, 6);
  });
});

describe('critical angle', () => {
  it('is 41.1 degrees for glass to air', () => {
    expect(criticalAngleDegrees(1.52, 1)).toBeCloseTo(41.1, 1);
  });

  it('does not exist when entering a denser medium', () => {
    expect(criticalAngle(1, 1.52)).toBeNull();
    expect(criticalAngleDegrees(1, 1.52)).toBeNull();
  });
});

describe('Fresnel', () => {
  it('reflects about 4.3 percent at normal incidence', () => {
    expect(fresnelReflectance(1, 1.52, 1)).toBeCloseTo(0.0426, 3);
  });

  it('reflects more toward grazing incidence', () => {
    expect(fresnelReflectance(1, 1.52, 0.1)).toBeGreaterThan(
      fresnelReflectance(1, 1.52, 1),
    );
    expect(fresnelReflectance(1, 1.52, 0)).toBeCloseTo(1, 6);
  });
});

describe('medium tracking', () => {
  it('knows when the ray enters the denser medium', () => {
    const response = interactWithSurface(
      vec3(0, 0, -1),
      surfaceNormal,
      1,
      1.52,
    );
    expect(response.entering).toBe(true);
    expect(response.normal).toEqual(surfaceNormal);
    expect(response.n1).toBe(1);
    expect(response.n2).toBe(1.52);
  });

  it('knows when the ray exits into air', () => {
    const response = interactWithSurface(
      vec3(0, 0, 1),
      surfaceNormal,
      1,
      1.52,
    );
    expect(response.entering).toBe(false);
    expect(response.normal.x).toBeCloseTo(0, 10);
    expect(response.normal.y).toBeCloseTo(0, 10);
    expect(response.normal.z).toBeCloseTo(-1, 10);
    expect(response.n1).toBe(1.52);
    expect(response.n2).toBe(1);
  });
});

describe('robustness', () => {
  it('never produces NaN directions across the critical range', () => {
    for (const angleDegrees of [0, 10, 30, 41, 45, 60, 80]) {
      const angle = (angleDegrees * Math.PI) / 180;
      const incoming = normalize(vec3(Math.sin(angle), 0, Math.cos(angle)));
      const response = interactWithSurface(
        incoming,
        surfaceNormal,
        1,
        1.52,
      );

      expect(Number.isFinite(response.reflected.x)).toBe(true);
      expect(Number.isFinite(response.reflected.y)).toBe(true);
      expect(Number.isFinite(response.reflected.z)).toBe(true);
      expect(length(response.reflected)).toBeCloseTo(1, 6);

      if (response.transmitted) {
        expect(Number.isFinite(response.transmitted.x)).toBe(true);
        expect(Number.isFinite(response.transmitted.y)).toBe(true);
        expect(Number.isFinite(response.transmitted.z)).toBe(true);
        expect(length(response.transmitted)).toBeCloseTo(1, 6);
      }
    }
  });

  it('offsets the next origin by exactly one epsilon', () => {
    const next = offsetOrigin(vec3(1, 2, 3), vec3(0, 0, 1));
    expect(next.x).toBe(1);
    expect(next.y).toBe(2);
    expect(next.z).toBeCloseTo(3 + RAY_EPSILON, 10);
  });
});
