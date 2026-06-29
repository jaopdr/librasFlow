import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SignCard from "@/components/signs/SignCard";
import DevSeedButton from "@/components/DevSeedButton";
import { Search, BookOpen, Languages, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = ["Animais", "Cores", "Família", "Alimentos", "Educação", "Saúde", "Trabalho", "Tecnologia", "Natureza", "Esportes", "Sentimentos", "Tempo", "Lugares", "Números", "Cumprimentos", "Verbos", "Adjetivos"];

export default function Home() {
  const { user } = useAuth();
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSigns();
  }, []);

  const loadSigns = async () => {
    setLoading(true);
    const data = await base44.entities.Sign.filter({ status: "approved" }, "-created_date", 100);
    setSigns(data);
    setLoading(false);
  };

  const filtered = signs.filter((s) => {
    const matchSearch = !searchQuery || 
      s.portuguese_word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.synonyms || []).some(syn => syn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = !selectedCategory || (s.categories || []).includes(selectedCategory);
    const matchRegion = !selectedRegion || s.regional_variation === selectedRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const hasActiveFilters = selectedCategory || selectedRegion;

  return (
    <div>
      {user?.role === "admin" && <DevSeedButton />}
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-teal-50/50 to-background pt-16 pb-20 px-4" aria-label="Seção principal">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <span aria-hidden="true">🤟</span>
            Dicionário Colaborativo
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 leading-tight">
            Dicionário de{" "}
            <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
              Libras
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore, contribua e aprenda a Língua Brasileira de Sinais.
            Uma plataforma colaborativa com modelagem gramatical profunda e variações regionais.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto" role="search" aria-label="Buscar sinais no dicionário">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar sinal em Português..."
                className="pl-12 pr-4 h-14 text-lg rounded-2xl border-2 border-border/50 focus:border-primary shadow-lg shadow-black/5 bg-white"
                aria-label="Campo de busca de sinais"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10" aria-label="Estatísticas da plataforma">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span><strong className="text-foreground">{signs.length}</strong> sinais aprovados</span>
            </div>
            <Link to="/translator" className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              <Languages className="w-4 h-4" aria-hidden="true" />
              Tradutor IA
            </Link>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Resultados da busca">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Sinais"}
            <span className="text-muted-foreground font-normal text-base ml-2">({filtered.length})</span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full" aria-label="Filtros ativos" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div id="filter-panel" className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl border" role="group" aria-label="Filtros de busca">
            <div className="min-w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger aria-label="Filtrar por categoria">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[200px]">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger aria-label="Filtrar por região">
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  {["Nacional", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedCategory(""); setSelectedRegion(""); }}
                className="gap-1 text-muted-foreground"
                aria-label="Limpar todos os filtros"
              >
                <X className="w-4 h-4" /> Limpar
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20" role="status" aria-label="Carregando sinais">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="sr-only">Carregando sinais...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" role="status">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum sinal encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Tente uma busca diferente ou remova os filtros."
                : "Ainda não há sinais aprovados. Seja o primeiro a contribuir!"}
            </p>
            <Link to="/submit">
              <Button className="bg-primary">Submeter um Sinal</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((sign) => (
              <SignCard key={sign.id} sign={sign} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}