export default function FooterTop() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-b from-primary/40 to-transparent" />
        <div
          className="absolute top-0 h-px w-40 opacity-90"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(156 85% 70%), transparent)',
            animation: 'shimmer-line 3s linear infinite',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="absolute w-7 h-7 rounded-full border border-primary/30 animate-ping opacity-30" />
          <div className="absolute w-5 h-5 rounded-full border border-primary/50" />
          <div
            className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-primary-glow via-primary to-emerald-dark shadow-[0_0_12px_hsl(156_70%_42%),0_0_24px_hsl(156_70%_42%/0.5)]"
          />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-0">
          <div className="w-32 h-px bg-gradient-to-l from-primary/70 to-transparent" />
          <div className="w-4" />
          <div className="w-32 h-px bg-gradient-to-r from-primary/70 to-transparent" />
        </div>
      </div>
      <style>{`
        @keyframes shimmer-line {
          0%   { left: -10rem; }
          100% { left: 110%; }
        }
      `}</style>
    </>
  );
}
