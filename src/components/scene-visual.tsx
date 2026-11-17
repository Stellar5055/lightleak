import type { PresetId, SpectrumMode } from '@/data/scenes';

const FAN = [
  '#7a5cff',
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#7f1d1d',
];

type SceneVisualProps = {
  preset: PresetId;
  rays: boolean;
  spectrum: SpectrumMode;
  width: number;
  selected?: boolean;
  onRayClick?: () => void;
  idPrefix?: string;
  className?: string;
};

export function SceneVisual({
  preset,
  rays,
  spectrum,
  width,
  selected = false,
  onRayClick,
  idPrefix = 'sv',
  className = '',
}: SceneVisualProps) {
  const p = idPrefix;
  const mono = spectrum === 'mono';
  const beamColor = mono ? '#22c55e' : '#f7f7f4';
  const beamWidth = 1.6 + width / 8;
  const glowWidth = beamWidth * 5;

  return (
    <svg
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${preset} optical bench`}
    >
      <defs>
        <radialGradient id={`${p}-bg`} cx="50%" cy="38%" r="78%">
          <stop offset="0" stopColor="#16181d" />
          <stop offset="0.55" stopColor="#0b0c0f" />
          <stop offset="1" stopColor="#07080a" />
        </radialGradient>
        <linearGradient id={`${p}-spectrum`} x1="0" x2="1">
          {FAN.map((color, index) => (
            <stop
              key={color}
              offset={`${(index / (FAN.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9f7f1" stopOpacity="0.3" />
          <stop offset="0.55" stopColor="#7fd0c8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`${p}-tip`}>
          <stop offset="0" stopColor="#ffe3ad" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffc46b" stopOpacity="0.24" />
          <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${p}-vignette`} cx="50%" cy="45%" r="72%">
          <stop offset="0.42" stopColor="#07080a" stopOpacity="0" />
          <stop offset="1" stopColor="#07080a" stopOpacity="0.78" />
        </radialGradient>
        <filter id={`${p}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${p}-soft`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <pattern
          id={`${p}-grid`}
          width="80"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path d="M80 0H0V60" fill="none" stroke="#1a1c21" strokeWidth="1" />
        </pattern>
        <pattern
          id={`${p}-floor`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path d="M30 0H0V30" fill="none" stroke="#15171b" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1200" height="760" fill={`url(#${p}-bg)`} />

      {/* bench */}
      <path
        d="M20 558h1160l60 202H-40Z"
        fill="#0b0c0e"
        stroke="#1a1c20"
        strokeWidth="1"
      />
      <path d="M20 558h1160l60 202H-40Z" fill={`url(#${p}-grid)`} opacity="0.75" />
      <path
        d="M20 558h1160"
        stroke="#2a2c31"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* screen */}
      <g>
        <rect
          x="760"
          y="166"
          width="280"
          height="334"
          rx="3"
          fill="#17181d"
          stroke="#40424a"
          strokeWidth="1.2"
        />
        <rect x="770" y="176" width="260" height="314" fill="#14151a" />
        <rect
          x="770"
          y="176"
          width="260"
          height="314"
          fill={`url(#${p}-floor)`}
          opacity="0.35"
        />
        <rect x="760" y="166" width="280" height="2" fill="#4a4c54" />
      </g>

      {/* source */}
      <g transform="translate(190 470)">
        <path d="M-20 28h40v22h-40z" fill="#191a1e" />
        <rect
          x="-50"
          y="-18"
          width="86"
          height="36"
          rx="9"
          fill="#8c6a2e"
          stroke="#c49a4a"
          strokeWidth="1"
        />
        <rect x="34" y="-12" width="44" height="24" rx="4" fill="#26272c" />
        <circle cx="80" cy="0" r="8" fill="#ffe3ad" filter={`url(#${p}-glow)`} />
        <circle cx="80" cy="0" r="62" fill={`url(#${p}-tip)`} />
      </g>

      {preset === 'prism' && (
        <PrismScene
          p={p}
          rays={rays}
          mono={mono}
          beamColor={beamColor}
          beamWidth={beamWidth}
          glowWidth={glowWidth}
          selected={selected}
          onRayClick={onRayClick}
        />
      )}

      {preset === 'ball' && (
        <BallScene
          p={p}
          rays={rays}
          mono={mono}
          beamColor={beamColor}
          beamWidth={beamWidth}
          glowWidth={glowWidth}
          selected={selected}
          onRayClick={onRayClick}
        />
      )}

      {preset === 'blank' && (
        <g>
          <ellipse
            cx="590"
            cy="558"
            rx="98"
            ry="15"
            fill="#0a0b0d"
            stroke="#2b2d33"
            strokeDasharray="4 6"
          />
          <circle
            cx="590"
            cy="450"
            r="86"
            fill="none"
            stroke="#f7f7f4"
            strokeOpacity="0.14"
            strokeDasharray="4 8"
          />
          <path
            d="M590 432v36M572 450h36"
            stroke="#f7f7f4"
            strokeOpacity="0.2"
            strokeWidth="1.4"
          />
          <circle cx="230" cy="470" r="58" fill={`url(#${p}-tip)`} opacity="0.28" />
        </g>
      )}

      <rect width="1200" height="760" fill={`url(#${p}-vignette)`} />
    </svg>
  );
}

type ScenePartProps = {
  p: string;
  rays: boolean;
  mono: boolean;
  beamColor: string;
  beamWidth: number;
  glowWidth: number;
  selected: boolean;
  onRayClick?: () => void;
};

function PrismScene({
  p,
  rays,
  mono,
  beamColor,
  beamWidth,
  glowWidth,
  selected,
  onRayClick,
}: ScenePartProps) {
  const entryX = 542;
  const exitX = 632;

  return (
    <g>
      {rays && (
        <g>
          <path
            d={`M270 470H${entryX}L${exitX} 500H760`}
            fill="none"
            stroke={beamColor}
            strokeWidth={glowWidth}
            strokeOpacity="0.14"
            strokeLinecap="round"
            filter={`url(#${p}-soft)`}
          />
          <path
            d={`M270 470H${entryX}L${exitX} 500`}
            fill="none"
            stroke={beamColor}
            strokeWidth={beamWidth}
            strokeLinecap="round"
          />
          <path
            d={`M${exitX} 500H760`}
            fill="none"
            stroke="#bff4ee"
            strokeWidth={Math.max(1.4, beamWidth - 0.8)}
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          {!mono && (
            <g className="fan-in">
              {FAN.map((color, index) => (
                <path
                  key={color}
                  d={`M${exitX} 500 760 ${414 + index * 17}`}
                  stroke={color}
                  strokeWidth={Math.max(1.8, beamWidth - 0.4)}
                  strokeOpacity="0.95"
                  strokeLinecap="round"
                  filter={`url(#${p}-glow)`}
                />
              ))}
            </g>
          )}
          {mono && (
            <path
              d={`M${exitX} 500 760 470`}
              stroke="#22c55e"
              strokeWidth={beamWidth}
              strokeLinecap="round"
              filter={`url(#${p}-glow)`}
            />
          )}
        </g>
      )}

      {/* the spectrum on the screen — this is the caustic, not the ray overlay */}
      {mono ? (
        <rect
          x="770"
          y="462"
          width="240"
          height={beamWidth + 2}
          fill="#22c55e"
          opacity="0.95"
          filter={`url(#${p}-glow)`}
        />
      ) : (
        <g opacity="1" filter={`url(#${p}-glow)`}>
          {FAN.map((color, index) => (
            <rect
              key={color}
              x="770"
              y={412 + index * 17}
              width="240"
              height="4"
              fill={color}
            />
          ))}
        </g>
      )}

      <g>
        <ellipse
          cx="580"
          cy="558"
          rx="100"
          ry="15"
          fill="#0a0b0d"
          stroke="#c49a4a"
          strokeOpacity="0.32"
        />
        <ellipse
          cx="580"
          cy="470"
          rx="110"
          ry="92"
          fill="#7fd0c8"
          opacity="0.05"
          filter={`url(#${p}-soft)`}
        />
        <path
          d="M500 558 660 558 580 390Z"
          fill={`url(#${p}-glass)`}
          stroke="#bff4ee"
          strokeOpacity="0.8"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d={`M${entryX} 470 ${exitX} 500`}
          stroke="#bff4ee"
          strokeOpacity="0.65"
          strokeWidth="2"
        />
        <path
          d="M527 512 604 410"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="1.4"
        />
        <path
          d="M580 390v168"
          stroke="#ffffff"
          strokeOpacity="0.07"
          strokeWidth="1"
        />
      </g>

      {selected && (
        <g>
          <ellipse
            cx="580"
            cy="558"
            rx="104"
            ry="15"
            fill="none"
            stroke="#f7f7f4"
            strokeOpacity="0.32"
            strokeDasharray="4 6"
          />
        </g>
      )}

      {rays && (
        <>
          <path
            d="M270 470H542"
            fill="none"
            stroke="transparent"
            strokeWidth="30"
            pointerEvents="stroke"
            className="cursor-pointer"
            onClick={onRayClick}
            aria-label="Read this ray"
          />
          <path
            d="M632 500H760"
            fill="none"
            stroke="transparent"
            strokeWidth="30"
            pointerEvents="stroke"
            className="cursor-pointer"
            onClick={onRayClick}
            aria-label="Read this ray"
          />
        </>
      )}
    </g>
  );
}

function BallScene({
  p,
  rays,
  mono,
  beamColor,
  beamWidth,
  glowWidth,
  selected,
  onRayClick,
}: ScenePartProps) {
  return (
    <g>
      {rays && (
        <g>
          <path
            d="M270 440H486M270 480H486M270 520H486"
            fill="none"
            stroke={beamColor}
            strokeWidth={glowWidth}
            strokeOpacity="0.12"
            strokeLinecap="round"
            filter={`url(#${p}-soft)`}
          />
          <path
            d="M270 440H486M270 480H486M270 520H486"
            fill="none"
            stroke={beamColor}
            strokeWidth={beamWidth}
            strokeLinecap="round"
          />
          <path
            d="M486 440Q560 440 616 500 690 560 770 560M486 480Q560 480 620 514 690 560 770 560M486 520Q560 520 624 530 690 560 770 560"
            fill="none"
            stroke={mono ? '#22c55e' : '#bff4ee'}
            strokeOpacity="0.75"
            strokeWidth={Math.max(1.2, beamWidth - 0.8)}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* caustic on the bench — remains when rays are hidden */}
      <ellipse
        cx="770"
        cy="560"
        rx="44"
        ry="13"
        fill={mono ? '#22c55e' : '#ffe3ad'}
        opacity="0.55"
        filter={`url(#${p}-glow)`}
      />
      <ellipse
        cx="770"
        cy="560"
        rx="18"
        ry="6"
        fill="#fffaf0"
        opacity="0.9"
        filter={`url(#${p}-glow)`}
      />
      <circle
        cx="940"
        cy="470"
        r="16"
        fill={mono ? '#22c55e' : '#ffe3ad'}
        opacity="0.28"
        filter={`url(#${p}-glow)`}
      />

      <g>
        <ellipse
          cx="560"
          cy="558"
          rx="92"
          ry="15"
          fill="#0a0b0d"
          stroke="#c49a4a"
          strokeOpacity="0.32"
        />
        <circle
          cx="560"
          cy="480"
          r="80"
          fill={`url(#${p}-glass)`}
          stroke="#bff4ee"
          strokeOpacity="0.6"
          strokeWidth="1.8"
        />
        <path
          d="M502 444c20-26 58-34 84-18"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle
          cx="560"
          cy="480"
          r="62"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.05"
        />
      </g>

      {selected && (
        <g>
          <ellipse
            cx="560"
            cy="558"
            rx="104"
            ry="18"
            fill="none"
            stroke="#f7f7f4"
            strokeOpacity="0.45"
            strokeDasharray="4 6"
          />
        </g>
      )}

      {rays && (
        <path
          d="M270 480H500"
          fill="none"
          stroke="transparent"
          strokeWidth="30"
          pointerEvents="stroke"
          className="cursor-pointer"
          onClick={onRayClick}
          aria-label="Read this ray"
        />
      )}
    </g>
  );
}
