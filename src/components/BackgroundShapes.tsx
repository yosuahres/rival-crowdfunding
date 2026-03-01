export default function BackgroundShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-20 -top-24 h-[350px] w-[400px] bg-[#2a8a4a] opacity-50 blur-[140px]"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          animation: "aurora-drift 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-5%] top-[20%] h-[300px] w-[350px] bg-[#a3c490] opacity-35 blur-[150px]"
        style={{
          borderRadius: "50% 60% 70% 40% / 50% 40% 60% 70%",
          animation: "aurora-drift-slow 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[50%] top-[10%] h-[180px] w-[240px] bg-[#d4cfb0] opacity-20 blur-[120px]"
        style={{
          borderRadius: "40% 60% 70% 30% / 60% 40% 50% 70%",
          animation: "aurora-drift-slow 14s ease-in-out infinite 4s",
        }}
      />
    </div>
  );
}
