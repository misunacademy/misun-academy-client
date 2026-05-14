"use client";

import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import { Wrench, Clock } from "lucide-react";

const FALLBACK_TITLE = "We’ll Be Back Soon";
const FALLBACK_MESSAGE =
	"Misun Academy is undergoing scheduled maintenance to improve your learning experience. We’ll be back shortly.";

	
export default function MaintenancePage() {
	const { data } = useGetSettingsQuery();

	const maintenanceTitle = data?.data?.maintenanceTitle?.trim() || FALLBACK_TITLE;
	const maintenanceMessage = data?.data?.maintenanceMessage?.trim() || FALLBACK_MESSAGE;

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-sky-50">
			<div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
			<div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />

			<div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
				<div className="flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
					<Wrench className="h-4 w-4" />
					Scheduled maintenance
				</div>

				<div className="space-y-4">
					<h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
						{maintenanceTitle}
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl">
						{maintenanceMessage}
					</p>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-4">
					<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
						<Clock className="h-4 w-4 text-amber-600" />
						We are working to restore full access as soon as possible.
					</div>
				</div>

				{/* <div className="flex flex-wrap items-center justify-center gap-3">
					<Button asChild variant="outline">
						<Link href="/dashboard/admin">Admin dashboard</Link>
					</Button>
				</div> */}
			</div>
		</div>
	);
}
