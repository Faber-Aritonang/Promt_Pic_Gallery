import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
