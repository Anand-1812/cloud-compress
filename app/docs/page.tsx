import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileCode2,
  Image as ImageIcon,
  KeyRound,
  Rocket,
  ShieldCheck,
  Video,
  WandSparkles,
  Workflow,
} from "lucide-react";

import { Footer } from "@/components/Landing/footer";
import { Navigation } from "@/components/Navbar/navbar";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "#overview", label: "Overview", Icon: BookOpen },
  { href: "#workflow", label: "Workflow", Icon: Workflow },
  { href: "#tools", label: "Tools", Icon: WandSparkles },
  { href: "#api", label: "API", Icon: FileCode2 },
  { href: "#env", label: "Environment", Icon: KeyRound },
];

const modules = [
  {
    href: "/social-share",
    title: "Social Image Studio",
    description:
      "Upload an image, generate platform-ready crops, and export transformed assets for social channels.",
    Icon: ImageIcon,
  },
  {
    href: "/video-upload",
    title: "Video Engine",
    description:
      "Upload a video to Cloudinary, compress it, store metadata in Postgres, and surface previews on the dashboard.",
    Icon: Video,
  },
];

const apiRoutes = [
  {
    route: "/api/image-upload",
    method: "POST",
    description: "Accepts an image file and returns a Cloudinary `publicId` for transformation previews.",
    auth: "Required",
  },
  {
    route: "/api/video-upload",
    method: "POST",
    description:
      "Accepts a video file plus metadata, uploads it to Cloudinary, and stores the compression record in the database.",
    auth: "Required",
  },
  {
    route: "/api/videos",
    method: "GET",
    description:
      "Returns the signed-in user’s uploaded video records for the dashboard and upload history views.",
    auth: "Required",
  },
];

const envVars = [
  {
    name: "DATABASE_URL",
    description: "PostgreSQL connection string used by Prisma for uploaded video records.",
  },
  {
    name: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    description: "Public Cloudinary cloud name used to build asset preview URLs in the browser.",
  },
  {
    name: "CLOUDINARY_API_KEY",
    description: "Server-side Cloudinary API key used by the upload routes.",
  },
  {
    name: "CLOUDINARY_API_SECRET",
    description: "Server-side Cloudinary API secret used by the upload routes.",
  },
  {
    name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    description: "Public Clerk key for the auth UI.",
  },
  {
    name: "CLERK_SECRET_KEY",
    description: "Server-side Clerk secret used by protected routes and middleware.",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="relative overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[150px]" />
          <div className="absolute bottom-24 right-[-8rem] h-[20rem] w-[20rem] rounded-full bg-primary/8 blur-[120px]" />
        </div>

        <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="overflow-hidden rounded-[3rem] border border-border/60 bg-card/50 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Documentation
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tighter md:text-7xl">
              Clean docs for the <span className="text-muted-foreground">CloudCompress</span> workflow.
            </h1>

            <p className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground/85">
              Everything you need to understand the product flow, required environment setup,
              authenticated API routes, and where each compression tool fits in the workspace.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/home">
                <Button className="h-14 rounded-2xl px-8 text-sm font-black uppercase tracking-[0.2em]">
                  Open Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="#api">
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-border bg-background/80 px-8 text-sm font-black uppercase tracking-[0.2em]"
                >
                  API Reference
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {quickLinks.map((item) => {
                const Icon = item.Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="overview" className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Overview</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              What this project does
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
              CloudCompress is a media workspace with two product flows: image resizing for social
              platforms and Cloudinary-backed video compression with dashboard history. Clerk
              protects the app, Prisma stores uploaded video metadata, and the dashboard surfaces
              those results back to the user.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-border bg-card/50 p-6 shadow-lg">
              <Rocket className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-xl font-black tracking-tight">Fast Workspace Flow</h3>
              <p className="mt-3 font-medium leading-relaxed text-muted-foreground">
                Public landing page, protected studio routes, and direct entry into the image or
                video tools.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card/50 p-6 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-xl font-black tracking-tight">Protected Upload Routes</h3>
              <p className="mt-3 font-medium leading-relaxed text-muted-foreground">
                Upload APIs require authentication, and the video dashboard now returns only the
                signed-in user’s records.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card/50 p-6 shadow-lg">
              <WandSparkles className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-xl font-black tracking-tight">Cloudinary Delivery</h3>
              <p className="mt-3 font-medium leading-relaxed text-muted-foreground">
                Cloudinary handles asset storage, optimized derivatives, preview thumbnails, and
                compressed video delivery.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-[3rem] border border-border bg-card/40 p-8 shadow-xl backdrop-blur-xl md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Workflow</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              How the product flows together
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {[
                "User signs in with Clerk and enters the protected workspace.",
                "Image or video files are uploaded through the specialized tool page.",
                "Cloudinary processes the asset while Prisma stores the video record metadata.",
                "The dashboard lists the user’s latest videos with preview cards and downloads.",
              ].map((step, index) => (
                <div key={step} className="rounded-[2rem] border border-border bg-background/70 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                    0{index + 1}
                  </div>
                  <p className="font-medium leading-relaxed text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Tools</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Workspace modules
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((module) => {
              const Icon = module.Icon;

              return (
                <article
                  key={module.href}
                  className="rounded-[2.5rem] border border-border bg-card/50 p-8 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <Link href={module.href}>
                      <Button variant="outline" className="rounded-2xl px-5">
                        Open
                      </Button>
                    </Link>
                  </div>

                  <h3 className="mt-8 text-2xl font-black tracking-tight">{module.title}</h3>
                  <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
                    {module.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="api" className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-[3rem] border border-border bg-card/40 p-8 shadow-xl backdrop-blur-xl md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">API</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Route reference
            </h2>

            <div className="mt-8 space-y-4">
              {apiRoutes.map((item) => (
                <div
                  key={item.route}
                  className="rounded-[2rem] border border-border bg-background/70 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                          {item.method}
                        </span>
                        <code className="text-sm font-black text-foreground">{item.route}</code>
                      </div>
                      <p className="mt-4 max-w-3xl font-medium leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-full border border-border bg-card px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                      Auth: {item.auth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="env" className="relative mx-auto max-w-7xl px-6 py-12 pb-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Environment
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Required configuration
            </h2>
            <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
              These are the main variables the project expects for auth, Cloudinary delivery, and
              Prisma-backed video records.
            </p>
          </div>

          <div className="rounded-[3rem] border border-border bg-card/40 p-8 shadow-xl backdrop-blur-xl">
            <div className="grid gap-4">
              {envVars.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[1.75rem] border border-border bg-background/70 p-5"
                >
                  <code className="text-sm font-black text-foreground">{item.name}</code>
                  <p className="mt-2 font-medium leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
