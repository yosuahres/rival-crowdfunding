import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 pt-12 pb-8 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Left: Logo + Social */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/logo-1.png"
                alt="Rival logo"
                width={160}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/rival_its/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/rival-itsroboticsteam/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@rival_its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Link columns */}
          <div className="flex gap-16 sm:gap-24">
            {/* Our Team */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-1 text-sm font-semibold text-[#4ade80]">Our Team</h3>
              <Link href="/" className="text-sm text-white/70 transition-colors hover:text-white">
                Home
              </Link>
              <Link
                href="/#about"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Contact Us
              </Link>
              <Link
                href="/#cars"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Rover
              </Link>
            </div>

            {/* Program */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-1 text-sm font-semibold text-[#4ade80]">Program</h3>
              <Link
                href="/support"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Crowdfunding
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-6 h-px w-full bg-white/20" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/50">Copyright 2025 &copy; RIVAL ITS Team</p>
          <p className="text-right text-xs text-white/50">
            Institut Teknologi Sepuluh Nopember, Surabaya,
            <br />
            Jawa Timur, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
