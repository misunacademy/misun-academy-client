export const chatStyles = `
.fab-btn {
  animation: fabFloat 3s ease-in-out infinite;
}
@keyframes fabFloat {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.fab-btn:hover {
  animation-play-state: paused;
}
.fab-pulse-glow {
  animation: fabPulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 9999px;
}
@keyframes fabPulseGlow {
  0%,
  100% {
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0.35);
  }
  50% {
    box-shadow: 0 0 0 10px hsl(var(--primary) / 0);
  }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.3);
}
`;
