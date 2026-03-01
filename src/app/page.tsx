import ProgressBar from "@/components/ProgressBar";
import Carousel from "@/components/Carousel";

const CURRENT_AMOUNT = 4_500_000;
const GOAL_AMOUNT = 20_000_000;

const CAROUSEL_IMAGES = [
  { src: "/assets/gemas.png", alt: "Rival slide 1" },
  { src: "/assets/izin.png", alt: "Rival slide 2" },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="bg-gradient-to-r from-[#bdb88e] via-[#d4cfb0] to-[#8eac7a] bg-clip-text text-center text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl">
        #YourSupportMatters
      </h1>
      <p className="-mt-8 text-center text-base font-medium text-white/70 sm:text-lg">
        RIVAL ITS Team — Crowdfunding
      </p>

      <ProgressBar current={CURRENT_AMOUNT} goal={GOAL_AMOUNT} />

      <a
        href="/support"
        className="inline-flex items-center justify-center rounded-full bg-[#bdb88e] px-8 py-3 text-lg font-semibold text-[#231f20] shadow-lg transition-all hover:scale-105 hover:bg-[#8eac7a] hover:shadow-xl active:scale-100"
      >
        Support Us
      </a>

      <Carousel images={CAROUSEL_IMAGES} />

      <h2 className="text-center font-[family-name:var(--font-exo2)] text-3xl font-bold text-white">
        RIVAL ITS TEAM
      </h2>
    </main>
  );
}
