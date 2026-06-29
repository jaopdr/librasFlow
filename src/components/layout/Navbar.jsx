import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, BookOpen, Languages, Upload, ClipboardCheck, Shield, LogOut, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dicionário", path: "/", icon: BookOpen, roles: null },
  { label: "Tradutor IA", path: "/translator", icon: Languages, roles: null },
  { label: "Submeter Sinal", path: "/submit", icon: Upload, roles: ["contributor", "curator", "admin"] },
  { label: "Curadoria", path: "/curation", icon: ClipboardCheck, roles: ["curator", "admin"] },
  { label: "Administração", path: "/admin", icon: Shield, roles: ["admin"] },
];

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <header role="banner" className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <a href="#main-content" className="skip-link" aria-label="Pular para o conteúdo principal">
        Pular para o conteúdo principal
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Página inicial do Dicionário Libras"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-white font-bold text-lg" aria-hidden="true">🤟</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground tracking-tight">Libras</span>
              <span className="text-xs block text-muted-foreground -mt-0.5">Dicionário Colaborativo</span>
            </div>
          </Link>

          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium">{user.full_name || user.email}</span>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  aria-label="Sair da conta"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Cadastrar</Button>
                </Link>
              </div>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72" aria-label="Menu de navegação mobile">
                <nav className="flex flex-col gap-2 mt-8" aria-label="Navegação mobile">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <div className="border-t mt-4 pt-4">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          {user.full_name || user.email}
                        </div>
                        <button
                          onClick={() => { onLogout(); setMobileOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
                        >
                          <LogOut className="w-5 h-5" aria-hidden="true" />
                          Sair
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 px-4">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full">Entrar</Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)}>
                          <Button className="w-full bg-primary">Cadastrar</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}