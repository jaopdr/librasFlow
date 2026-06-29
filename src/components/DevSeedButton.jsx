import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";

const SEED_SIGNS = [
  {
    portuguese_word: "Obrigado",
    description: "Sinal de agradecimento. A mão dominante parte do queixo com os dedos estendidos e se move para frente e para baixo.",
    regional_variation: "Nacional",
    articulation_point: ["Tórax"],
    hand_configuration: "Mão aberta, dedos juntos e estendidos",
    hand_disposition: "Uma mão",
    hand_orientation: "Para frente",
    contact_region: "Queixo",
    non_manual_components: ["Expressão de afirmação"],
    sign_classification: "Uma mão",
    categories: ["Cumprimentos"],
    synonyms: ["Grato", "Gratidão"],
    status: "approved",
    lgpd_consent: true,
    is_minor: false,
    video_url: "",
    hand_photo_url: "https://images.unsplash.com/photo-1559181567-c3190ca9d7a7?w=400&h=300&fit=crop",
  },
  {
    portuguese_word: "Família",
    description: "As duas mãos em configuração F (indicador e polegar formando um círculo), se movem em círculo uma em relação à outra.",
    regional_variation: "Nacional",
    articulation_point: ["Mãos"],
    hand_configuration: "Configuração F — polegar e indicador formam anel, demais dedos estendidos",
    hand_disposition: "Uma ao lado da outra",
    hand_orientation: "Para frente",
    contact_region: "N/A",
    non_manual_components: [],
    sign_classification: "Duas mãos - movimentos iguais",
    categories: ["Família"],
    synonyms: ["Parentes"],
    status: "approved",
    lgpd_consent: true,
    is_minor: false,
    video_url: "",
    hand_photo_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
  },
  {
    portuguese_word: "Escola",
    description: "Uma mão bate duas vezes sobre a outra aberta, como representando um livro sendo fechado.",
    regional_variation: "Nacional",
    articulation_point: ["Mãos"],
    hand_configuration: "Mão dominante semi-aberta bate na palma da mão de apoio",
    hand_disposition: "Uma sobre a outra",
    hand_orientation: "Para cima",
    contact_region: "Palma da mão",
    non_manual_components: [],
    sign_classification: "Duas mãos - movimentos iguais",
    categories: ["Educação", "Lugares"],
    synonyms: ["Colégio", "Instituição de ensino"],
    status: "approved",
    lgpd_consent: true,
    is_minor: false,
    video_url: "",
    hand_photo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
  },
];

export default function DevSeedButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    // Clear existing signs
    const existing = await base44.entities.Sign.list("-created_date", 500);
    for (const s of existing) {
      await base44.entities.Sign.delete(s.id);
    }
    // Insert seeds
    for (const sign of SEED_SIGNS) {
      await base44.entities.Sign.create(sign);
    }
    setLoading(false);
    setDone(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 opacity-20 hover:opacity-80 transition-opacity text-xs px-2 py-1 bg-slate-800 text-white rounded z-50"
        aria-label="Ferramenta de desenvolvimento: reset e seed do banco"
        title="Dev: Reset & Seed DB"
      >
        <RefreshCw className="w-3 h-3" />
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setDone(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🛠 Dev: Reset & Seed Database</DialogTitle>
            <DialogDescription>
              {done
                ? "✅ Banco resetado! 3 sinais aprovados foram inseridos."
                : "Isso vai apagar TODOS os sinais atuais e inserir 3 sinais de exemplo aprovados. Use apenas em ambiente de desenvolvimento."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setOpen(false); setDone(false); }}>
              {done ? "Fechar" : "Cancelar"}
            </Button>
            {!done && (
              <Button variant="destructive" onClick={handleSeed} disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : "Resetar e Popular"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}