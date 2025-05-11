<script lang="ts">
	import {
		ChevronLeft,
		Code,
		ExternalLink,
		Github,
		Headphones,
		Heart,
		Mic,
		Music,
		Star
	} from '@lucide/svelte';
</script>

<div class="flex flex-col bg-gray-900 font-sans text-white">
	<header class="mb-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<a class="rounded-full p-2 hover:bg-gray-700" href="/">
					<ChevronLeft size={24} class="text-gray-300" />
				</a>
				<h1 class="text-2xl font-bold text-emerald-400">About Guided Ear</h1>
			</div>
		</div>
	</header>

	<div class="mb-6 rounded-lg bg-gray-800 p-6">
		<div class="mb-4 flex items-start gap-4">
			<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-900/50">
				<Headphones size={32} class="text-emerald-400" />
			</div>
			<div class="flex-1">
				<h2 class="mb-1 text-xl font-bold text-emerald-400">Hands-Free Ear Training</h2>
				<p class="text-gray-300">
					A completely hands-free ear training application designed for musicians who want to
					practice anywhere, anytime.
				</p>
			</div>
		</div>

		<div class="space-y-3 text-gray-300">
			<div class="flex items-start gap-3">
				<Mic size={18} class="mt-1 flex-shrink-0 text-emerald-500" />
				<div>
					<h3 class="font-medium">Speech Synthesis</h3>
					<p class="text-sm text-gray-400">
						Identify chords using and hear results announced back to you - no tapping or looking at
						the screen required.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3">
				<Music size={18} class="mt-1 flex-shrink-0 text-emerald-500" />
				<div>
					<h3 class="font-medium">Progressive Learning</h3>
					<p class="text-sm text-gray-400">
						Start with basic triads and advance through complex chord types including sevenths,
						extensions, and inversions.
					</p>
				</div>
			</div>

			<!-- <div class="flex items-start gap-3">
				<Star size={18} class="mt-1 flex-shrink-0 text-emerald-500" />
				<div>
					<h3 class="font-medium">Practice Tracking</h3>
					<p class="text-sm text-gray-400">
						Monitor your progress through practice statistics without any pressure - tracking helps
						you see improvement over time.
					</p>
				</div>
			</div> -->
		</div>
	</div>

	<div class="mb-6 rounded-lg bg-gray-800 p-6">
		<h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-400">
			<Code size={20} />
			<span>About the Developer</span>
		</h2>

		<div class="space-y-3 text-gray-300">
			<p class="text-sm">
				Created by a musician and developer who wanted a distraction-free way to practice ear
				training during commutes, walks, and other moments when hands are busy.
			</p>

			<div class="flex items-center gap-4 pt-2">
				<a
					href="https://github.com/timvancann"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-emerald-400 transition-colors hover:text-emerald-300"
				>
					<Github size={20} />
					<span>GitHub Profile</span>
					<ExternalLink size={14} />
				</a>
			</div>
		</div>
	</div>

	<div class="mb-6 rounded-lg bg-gray-800 p-6">
		<h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-400">
			<Heart size={20} />
			<span>Free & Open Source</span>
		</h2>

		<div class="space-y-3 text-gray-300">
			<p class="text-sm">
				Guided Ear is completely free to use, with no ads, subscriptions, or in-app purchases. The
				full source code is available on GitHub.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<a
					href="https://github.com/timvancann/guided-ear"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
				>
					<Github size={18} />
					<span>View on GitHub</span>
					<ExternalLink size={14} />
				</a>

				<a
					href="https://github.com/timvancann/guided-ear/issues"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
				>
					<span>Report Issues</span>
					<ExternalLink size={14} />
				</a>
			</div>
		</div>
	</div>

	<div class="rounded-lg border border-emerald-800/50 bg-emerald-900/20 p-4">
		<h3 class="mb-2 font-medium text-emerald-300">Have feedback or suggestions?</h3>
		<p class="mb-3 text-sm text-gray-300">
			Your input helps make this app better for everyone! Feel free to create an issue on GitHub.
		</p>
	</div>

	<div class="mt-8 border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
		<p>Guided Ear • Built with ♥ for musicians</p>
		<p class="mt-1">Made with SvelteKit, TypeScript, and Tailwind CSS</p>
	</div>
</div>
