export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-7 bg-white dark:bg-[#0c0c0c]">
      {/* Orbit system */}
      <div className="relative flex items-center justify-center w-[88px] h-[88px]">
        {/* Ring 1 — inner, fast clockwise */}
        <div className="absolute flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/[0.14] animate-[spin_1.8s_linear_infinite]">
          <span className="absolute -top-[2.5px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#111] dark:bg-[#f0f0f0]" />
        </div>

        {/* Ring 2 — mid, slow counter-clockwise */}
        <div className="absolute flex items-center justify-center w-14 h-14 rounded-full border border-black/8 dark:border-white/8 animate-[spin_2.6s_linear_infinite_reverse]">
          <span className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#444] dark:bg-[#bbb] opacity-55" />
        </div>

        {/* Ring 3 — outer, very slow clockwise */}
        <div className="absolute flex items-center justify-center w-20 h-20 rounded-full border border-black/6 dark:border-white/5 animate-[spin_3.8s_linear_infinite]">
          <span className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[#777] dark:bg-[#888] opacity-35" />
        </div>

        {/* Core — pulsing center dot */}
        <span className="w-[9px] h-[9px] rounded-full bg-[#0a0a0a] dark:bg-[#f5f5f5] z-10 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Label */}
      <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-black/30 dark:text-white/28 select-none animate-[blink_1.8s_ease-in-out_infinite]">
        Loading
      </p>
    </div>
  );
}
