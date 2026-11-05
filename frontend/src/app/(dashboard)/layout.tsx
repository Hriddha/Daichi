import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-daichi-bg relative flex overflow-hidden">
      {/* Background Ambient Glow Orbs for Glassmorphic depth */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-daichi-sand/50 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 bg-daichi-sage/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 left-1/3 w-[30rem] h-[30rem] bg-daichi-clay/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glass Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}