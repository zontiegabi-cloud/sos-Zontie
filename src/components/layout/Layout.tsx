import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { PageTransition } from "@/components/common/PageTransition";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background grunge-overlay">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
