import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Maqbool Hussain Portfolio | Wisemix Media",
  description:
    "Portfolio for Maqbool Hussain, creator of Wisemix Media, featuring web development, digital tools, and technical content.",
};

const services = [
  "Next.js websites",
  "SEO-focused blogs",
  "Admin dashboards",
  "Browser-based tools",
];

const projects = [
  {
    title: "Wisemix Media Blog",
    description: "A fast publishing platform for technology, business, and practical digital guides.",
    href: "/blog",
  },
  {
    title: "Online Tools Hub",
    description: "Private browser tools for image compression, resizing, PDF generation, and document workflows.",
    href: "/tools",
  },
  {
    title: "CV Builder",
    description: "A focused resume builder for creating polished, job-ready CVs online.",
    href: "https://cv.wisemixmedia.com/",
  },
];

export default function PortfolioHomePage() {
  return (
    <div className="bg-white text-gray-950 overflow-x-hidden">
      <section className="relative min-h-[calc(100vh-4rem)] bg-gray-950 text-white">
        <Image
          src="/hero6.png"
          alt="Wisemix Media workspace"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gray-950/55" />

        <div className="relative z-10 container mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-center">
          <div className="max-w-3xl py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
              Portfolio
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
              Maqbool Hussain
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-xl text-gray-200 leading-relaxed">
              I build practical web experiences for creators, learners, and growing brands through
              Wisemix Media: fast blogs, useful tools, clean interfaces, and content that helps people move.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
              >
                View Tools
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white hover:text-gray-950 transition-colors"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                What I Do
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-black leading-tight text-gray-950">
                Useful digital products with a content-first mindset.
              </h2>
              <p className="mt-5 text-gray-600 leading-relaxed">
                Wisemix Media combines technical publishing, web tools, and modern development into
                one practical ecosystem. The focus is simple: build pages that load quickly, explain
                clearly, and help visitors complete real tasks.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <span className="block h-1.5 w-10 rounded-full bg-blue-600 mb-5" />
                  <h3 className="text-lg font-bold text-gray-950">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Featured Work
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-gray-950">
                Projects and platforms
              </h2>
            </div>
            <Link href="/contact" className="text-sm font-bold text-blue-600 hover:text-blue-700">
              Contact
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.title}
                href={project.href}
                className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-black text-gray-950 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
