import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Hand, Eye, Tag, Trash2, Target, RotateCcw, Layers, Smile, Pencil } from "lucide-react";
import EditSignModal from "@/components/signs/EditSignModal";

export default function SignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const canEdit = user && ["admin", "curator"].includes(user.role);
  const canDelete = user && ["admin", "curator"].includes(user.role);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await base44.entities.Sign.get(id);
        setSign(data);
      } catch {
        setSign(null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    await base44.entities.Sign.delete(id);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  if (!sign) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Sinal não encontrado</h1>
        <Link to="/"><Button>Voltar ao Dicionário</Button></Link>
      </div>
    );
  }

  const primaryParams = [
    { label: "Pontos de Articulação", value: (sign.articulation_point || []).join(", "), icon: Target },
    { label: "Configuração da Mão", value: sign.hand_configuration, icon: Hand },
  ].filter((i) => i.value);

  const secondaryParams = [
    { label: "Disposição das Mãos", value: sign.hand_disposition, icon: Layers },
    { label: "Orientação da Mão", value: sign.hand_orientation, icon: RotateCcw },
    { label: "Região de Contato", value: sign.contact_region, icon: Target },
    { label: "Componentes Não-Manuais", value: (sign.non_manual_components || []).join(", "), icon: Smile },
  ].filter((i) => i.value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dicionário
        </Link>
        <div className="flex gap-2">
          {canEdit && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowEdit(true)}
            >
              <Pencil className="w-4 h-4" />
              Editar Sinal
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Excluir Sinal
            </Button>
          )}
        </div>
      </div>

      {showEdit && (
        <EditSignModal
          sign={sign}
          open={showEdit}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => setSign(updated)}
        />
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir "{sign.portuguese_word}"?</DialogTitle>
            <DialogDescription>Esta ação é permanente e não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── HERO: word + badges + description ── */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">{sign.portuguese_word}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {sign.regional_variation && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="w-3 h-3" />
              {sign.regional_variation}
            </Badge>
          )}
          {sign.sign_classification && (
            <Badge variant="outline" className="gap-1">
              <Eye className="w-3 h-3" />
              {sign.sign_classification}
            </Badge>
          )}
        </div>
        {sign.description && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{sign.description}</p>
        )}
      </div>

      {/* ── MEDIA: video + hand photo side by side ── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {/* Video */}
        <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
          {sign.video_url ? (
            <video
              src={sign.video_url}
              controls
              className="w-full aspect-video"
              aria-label={`Vídeo do sinal ${sign.portuguese_word}`}
            >
              <track kind="captions" label="Português" />
              Seu navegador não suporta vídeo HTML5.
            </video>
          ) : (
            <div className="w-full aspect-video bg-slate-800 flex items-center justify-center">
              <p className="text-slate-400 text-sm">Vídeo não disponível</p>
            </div>
          )}
          <div className="px-4 py-2 bg-black/80">
            <p className="text-xs text-slate-400">Vídeo demonstrativo</p>
          </div>
        </div>

        {/* Hand photo */}
        <div className="rounded-2xl overflow-hidden border bg-white shadow-sm">
          {sign.hand_photo_url ? (
            <img
              src={sign.hand_photo_url}
              alt={`Configuração de mão para o sinal ${sign.portuguese_word}`}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              <Hand className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
          <div className="px-4 py-2 border-t bg-slate-50">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Hand className="w-3.5 h-3.5" /> Foto da configuração de mão
            </p>
          </div>
        </div>
      </div>

      {/* ── GRAMMATICAL DETAILS ── */}
      {(primaryParams.length > 0 || secondaryParams.length > 0) && (
        <section aria-labelledby="grammar-heading">
          <h2 id="grammar-heading" className="text-xl font-semibold text-foreground mb-5">
            Parâmetros Gramaticais
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Primary parameters */}
            {primaryParams.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {secondaryParams.length > 0 && (
            <div className="bg-white border rounded-2xl p-6 grid sm:grid-cols-2 gap-5">
              {secondaryParams.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</dt>
                    <dd className="text-sm font-medium text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── SYNONYMS & CATEGORIES ── */}
      {(sign.synonyms?.length > 0 || sign.categories?.length > 0) && (
        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          {sign.synonyms?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Sinônimos
              </h3>
              <div className="flex flex-wrap gap-2">
                {sign.synonyms.map((s) => (
                  <span key={s} className="px-3 py-1 bg-muted rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}
          {sign.categories?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {sign.categories.map((c) => (
                  <span key={c} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}