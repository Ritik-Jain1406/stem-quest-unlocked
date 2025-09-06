import { Card } from "@/components/ui/card";

export const Footer = () => {
  return (
    <footer className="w-full mt-16 py-6 bg-white/5 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Developed by <span className="font-semibold text-white">TEAM ZEINTH</span> All rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};