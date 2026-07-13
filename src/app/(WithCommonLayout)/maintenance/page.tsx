"use client";

import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import Image from "next/image";
import { Wrench, Clock } from "lucide-react";
import PageBackground from "@/components/shared/PageBackground";

const FALLBACK_TITLE = "We’ll Be Back Soon";
const FALLBACK_MESSAGE =
	"Misun Academy is undergoing scheduled maintenance to improve your learning experience. We’ll be back shortly.";

	
export default function MaintenancePage() {
	const { data } = useGetSettingsQuery();

	const maintenanceTitle = data?.data?.maintenanceTitle?.trim() || FALLBACK_TITLE;
	const maintenanceMessage = data?.data?.maintenanceMessage?.trim() || FALLBACK_MESSAGE;

	return (
		<PageBackground
			gradient="bg-surface flex items-center justify-center"
			dotOpacity="opacity-[0.04]"
			orbs={[
				{ position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", size: "w-[600px] h-[600px]", opacity: "bg-primary/5", blur: "blur-[140px]" },
				{ position: "top-[-10%] left-[-10%]", size: "w-[350px] h-[350px]", opacity: "bg-primary/4", blur: "blur-[100px]", extra: "animate-pulse", style: { animationDuration: '6s' } },
				{ position: "bottom-[-10%] right-[-10%]", size: "w-[350px] h-[350px]", opacity: "bg-primary/3", blur: "blur-[100px]" },
			]}
		>
			<div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
				
				{/* Top Premium Badge */}
				<div className="flex justify-center mb-2">
					<div className="relative p-[1.5px] rounded-full overflow-hidden">
						{/* Rotating conic gradient border */}
						<span className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_40%,hsl(156_70%_42%)_70%,hsl(156_70%_42%)_100%)] opacity-70" />
						<div className="relative px-6 py-2 rounded-full bg-surface flex items-center gap-2 border border-white/5">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
							</span>
							<span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/95 flex items-center gap-2">
								<Wrench className="h-3 w-3 text-primary" />
								Undergoing Restoration
							</span>
						</div>
					</div>
				</div>

				{/* Maintenance Illustration Asset */}
				<div className="relative p-[1.5px] rounded-2xl overflow-hidden shadow-[0_0_40px_hsl(156_70%_42%/0.15)]">
					{/* Rotating conic border */}
					<span className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%/0.8)_100%)]" />
					<div className="relative rounded-2xl bg-surface p-1">
						<Image
							src="/maintenance_art.png"
							alt="System Maintenance Illustration"
							width={192}
							height={192}
							loading="eager"
							className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-xl animate-float"
						/>
					</div>
				</div>

				{/* Title & Description Container */}
				<div className="space-y-6 max-w-xl">
					{/* Large Title */}
					<h1 className="text-3xl sm:text-5xl font-bold leading-[140%] tracking-tight">
						<span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
							{maintenanceTitle}
						</span>
					</h1>

					{/* Classical Divider Ornament */}
					<div className="flex items-center gap-3 w-full max-w-xs mx-auto">
						<div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
						<div className="flex gap-1">
							<div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
							<div className="w-1.5 h-1.5 rounded-full bg-primary" />
							<div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
						</div>
						<div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
					</div>

					{/* Description */}
					<p className="mx-auto text-base sm:text-xl text-white/60 leading-relaxed font-bangla">
						{maintenanceMessage}
					</p>
				</div>

				{/* System Status Alert */}
				<div className="flex justify-center">
					<div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-5 py-3 text-xs tracking-wider uppercase text-primary/90">
						<Clock className="h-4 w-4 text-primary animate-pulse" />
						<span>Restoring Full Services Shortly</span>
					</div>
				</div>

				{/* Brand Signature */}
				<div className="text-[11px] tracking-[0.3em] text-white/30 uppercase font-light">
					MISUN ACADEMY &copy; 2026
				</div>

			</div>
		</PageBackground>
	);
}
