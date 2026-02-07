import { Shield, Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="header-gradient text-navy-foreground">
      <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                COREP Reporting Assistant
              </h1>
              <p className="text-xs text-navy-foreground/60 sm:text-sm">
                AI-powered PRA Regulatory Compliance Tool
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-navy-foreground/50">
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">System Online</span>
            <span className="pulse-dot" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
