import { Navigation } from "@/components/Navbar/navbar";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-28">{children}</div>
    </div>
  );
}
