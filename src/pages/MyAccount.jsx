import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SignCard from "@/components/signs/SignCard";
import { User, Shield, Trash2, AlertTriangle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_LABELS = {
  contributor: "Contribuidor",
  curator: "Curador",
  admin: "Administrador",
};

export default function MyAccount() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mySigns, setMySigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function init() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin("/my-account");
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
      const signs = await base44.entities.Sign.filter({ created_by_id: me.id }, "-created_date", 100);
      setMySigns(signs);
      setLoading(false);
    }
    init();
  }, []);

  const handleDeleteRequest = async () => {
    setDeleting(true);
    await base44.entities.DataDeletionRequest.create({
      user_email: user.email,
      reason: deleteReason,
      status: "pending",
    });
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de exclusão de dados foi registrada. Um administrador irá processá-la.",
    });
    setShowDelete(false);
    setDeleting(false);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {(user.full_name || user.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.full_name || "Usuário"}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge className="mt-2" variant="outline">
                {ROLE_LABELS[user.role] || user.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* My Submissions */}
      <section className="mb-8" aria-label="Minhas submissões">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
          Minhas Submissões ({mySigns.length})
        </h2>
        {mySigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border">
            <p className="text-muted-foreground mb-4">Você ainda não submeteu nenhum sinal.</p>
            <Button onClick={() => navigate("/submit")} className="bg-primary">Submeter Primeiro Sinal</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mySigns.map((sign) => (
              <SignCard key={sign.id} sign={sign} showStatus />
            ))}
          </div>
        )}
      </section>

      {/* LGPD Section */}
      <section className="bg-white rounded-2xl border p-6" aria-label="Privacidade e proteção de dados">
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          Privacidade & LGPD
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem o direito
          de solicitar a exclusão completa dos seus dados pessoais, incluindo todos os sinais
          e vídeos que você enviou (Direito ao Esquecimento).
        </p>
        <Button
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
          onClick={() => setShowDelete(true)}
          aria-label="Solicitar exclusão dos meus dados e conta"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          Excluir Minha Conta e Dados
        </Button>
      </section>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent aria-label="Solicitação de exclusão de dados">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              Excluir Meus Dados
            </DialogTitle>
            <DialogDescription>
              Ao confirmar, todos os seus sinais, vídeos e dados pessoais serão permanentemente
              removidos da plataforma. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="delete-reason">Motivo (opcional)</Label>
              <Textarea
                id="delete-reason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Informe o motivo da solicitação..."
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteRequest} disabled={deleting}>
              {deleting ? "Enviando..." : "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}