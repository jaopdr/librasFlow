import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Eye, MapPin, Hand, MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Curation() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [reviewDialog, setReviewDialog] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    async function init() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { base44.auth.redirectToLogin("/curation"); return; }
      const me = await base44.auth.me();
      if (!["curator", "admin"].includes(me.role)) { navigate("/"); return; }
      setUser(me);
      await loadSigns();
    }
    init();
  }, []);

  const loadSigns = async () => {
    setLoading(true);
    const data = await base44.entities.Sign.list("-created_date", 200);
    setSigns(data);
    setLoading(false);
  };

  const handleReview = async (status) => {
    setProcessing(true);
    await base44.entities.Sign.update(reviewDialog.id, {
      status,
      review_notes: reviewNotes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    });
    toast({
      title: status === "approved" ? "Sinal Aprovado" : "Sinal Rejeitado",
      description: `O sinal "${reviewDialog.portuguese_word}" foi ${status === "approved" ? "aprovado" : "rejeitado"}.`,
    });
    setReviewDialog(null);
    setReviewNotes("");
    setProcessing(false);
    await loadSigns();
  };

  const handleDelete = async (id) => {
    await base44.entities.Sign.delete(id);
    setConfirmDeleteId(null);
    toast({ title: "Sinal excluído", description: "O sinal foi removido do dicionário." });
    await loadSigns();
  };

  const filtered = signs.filter((s) => s.status === activeTab);
  const counts = {
    pending: signs.filter((s) => s.status === "pending").length,
    approved: signs.filter((s) => s.status === "approved").length,
    rejected: signs.filter((s) => s.status === "rejected").length,
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Curadoria</h1>
        <p className="text-muted-foreground">
          Revise os sinais submetidos. Aprove, rejeite ou exclua sinais do dicionário.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6" aria-label="Filtrar sinais por status">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            Pendentes
            {counts.pending > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">{counts.pending}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            Aprovados
            <span className="ml-1 text-xs text-muted-foreground">{counts.approved}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" aria-hidden="true" />
            Rejeitados
            <span className="ml-1 text-xs text-muted-foreground">{counts.rejected}</span>
          </TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="flex justify-center py-20" role="status">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Nenhum sinal {tab === "pending" ? "pendente" : tab === "approved" ? "aprovado" : "rejeitado"}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((sign) => (
                  <article
                    key={sign.id}
                    className="bg-white rounded-xl border p-5 flex flex-col sm:flex-row gap-4"
                    aria-label={`Sinal: ${sign.portuguese_word}`}
                  >
                    {/* Thumbnail: hand photo preferred */}
                    <div className="sm:w-48 shrink-0">
                      {sign.hand_photo_url ? (
                        <img
                          src={sign.hand_photo_url}
                          alt={`Configuração de mão: ${sign.portuguese_word}`}
                          className="w-full aspect-video object-cover rounded-lg bg-slate-100"
                        />
                      ) : sign.video_url ? (
                        <video
                          src={sign.video_url}
                          className="w-full aspect-video object-cover rounded-lg bg-slate-100"
                          muted
                          playsInline
                          onMouseOver={(e) => e.target.play()}
                          onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                          aria-label={`Vídeo do sinal ${sign.portuguese_word}`}
                        />
                      ) : (
                        <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <Hand className="w-8 h-8 text-muted-foreground/30" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{sign.portuguese_word}</h3>
                        <Badge className={`shrink-0 ${
                          sign.status === "approved" ? "bg-green-100 text-green-800" :
                          sign.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {sign.status === "approved" ? "Aprovado" : sign.status === "rejected" ? "Rejeitado" : "Pendente"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        {sign.regional_variation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {sign.regional_variation}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          {sign.sign_classification || "N/A"}
                        </span>
                      </div>
                      {sign.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{sign.description}</p>
                      )}
                      {sign.review_notes && (
                        <div className="text-sm bg-muted/50 p-3 rounded-lg">
                          <span className="font-medium text-foreground flex items-center gap-1 mb-1">
                            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> Nota do curador:
                          </span>
                          <p className="text-muted-foreground">{sign.review_notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0 sm:justify-center">
                      {sign.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 gap-1"
                          onClick={() => setReviewDialog(sign)}
                          aria-label={`Revisar sinal ${sign.portuguese_word}`}
                        >
                          Revisar
                        </Button>
                      )}
                      {/* Curators/admins can delete any sign */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/20 hover:bg-destructive/5 gap-1"
                        onClick={() => setConfirmDeleteId(sign.id)}
                        aria-label={`Excluir sinal ${sign.portuguese_word}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Excluir
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => { setReviewDialog(null); setReviewNotes(""); }}>
        <DialogContent className="sm:max-w-lg" aria-label="Revisão de sinal">
          <DialogHeader>
            <DialogTitle>Revisar Sinal: {reviewDialog?.portuguese_word}</DialogTitle>
            <DialogDescription>
              Analise os detalhes gramaticais e o vídeo. Adicione notas e aprove ou rejeite o sinal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {reviewDialog?.hand_photo_url && (
              <img src={reviewDialog.hand_photo_url} alt="Configuração de mão" className="w-full h-40 object-contain rounded-lg bg-slate-100" />
            )}
            {reviewDialog?.video_url && (
              <video src={reviewDialog.video_url} controls className="w-full rounded-lg" aria-label="Vídeo do sinal" />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Região:</span> {reviewDialog?.regional_variation || "N/A"}</div>
              <div><span className="font-medium">Classificação:</span> {reviewDialog?.sign_classification || "N/A"}</div>
              <div><span className="font-medium">Articulação:</span> {(reviewDialog?.articulation_point || []).join(", ") || "N/A"}</div>
              <div><span className="font-medium">Config. Mão:</span> {reviewDialog?.hand_configuration || "N/A"}</div>
            </div>
            <div>
              <label htmlFor="review-notes" className="text-sm font-medium">Notas de Revisão</label>
              <Textarea
                id="review-notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Adicione observações sobre a precisão gramatical..."
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
                onClick={() => handleReview("rejected")}
                disabled={processing}
              >
                <XCircle className="w-4 h-4" aria-hidden="true" />
                Rejeitar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 gap-1"
                onClick={() => handleReview("approved")}
                disabled={processing}
              >
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Aprovar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir este sinal?</DialogTitle>
            <DialogDescription>Esta ação é permanente e não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => handleDelete(confirmDeleteId)}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}