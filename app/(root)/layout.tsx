import { WorkspaceSidebar } from "@/components/Sidebar/workspace-sidebar";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <WorkspaceSidebar />
      <div className="pt-20 md:pl-[19rem] md:pt-0">{children}</div>
    </div>
  );
}
