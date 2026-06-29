import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Users, Trash2, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_LABELS = { contributor: "Contribuidor", curator: "Curador", admin: "Administrador" };
const ROLE_COLORS = { contributor: "bg-blue-100 text-blue-800", curator: "bg-purple-100 text-purple-800", admin: "bg-red-100 text-red-800" };

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // user to delete
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    async function init() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { base44.auth.redirectToLogin("/admin"); return; }
      const me = await base44.auth.me();
      if (me.role !== "admin") { navigate("/"); return; }
      setCurrentUser(me);
      await loadData();
    }
    init();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const userList = await base44.entities.User.filter({ is_active: { $ne: false } }, "-created_date", 200);
    setUsers(userList);
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    await base44.entities.User.update(userId, { role: newRole });
    await loadData();
  };

  const deleteUserData = async (user) => {
    setProcessingId(user.id);
    // Delete all content (signs) submitted by this user
    await base44.entities.Sign.deleteMany({ created_by_id: user.id });
    // Soft-delete the user account: mark as inactive
    await base44.entities.User.update(user.id, { is_active: false });
    setConfirmDelete(null);
    setProcessingId(null);
    await loadData();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Administração</h1>
        <p className="text-muted-foreground">Gerencie papéis de usuários e exclua dados de contas conforme solicitado.</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">Usuários</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20" role="status">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Lista de usuários">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th scope="col" className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Usuário</th>
                  <th scope="col" className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Email</th>
                  <th scope="col" className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Papel Atual</th>
                  <th scope="col" className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Alterar Papel</th>
                  <th scope="col" className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-4 font-medium">{u.full_name || "—"}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-4">
                      <Badge className={ROLE_COLORS[u.role] || "bg-gray-100 text-gray-800"}>
                        {ROLE_LABELS[u.role] || u.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {u.id !== currentUser.id && (
                        <Select value={u.role} onValueChange={(v) => updateRole(u.id, v)}>
                          <SelectTrigger className="w-40" aria-label={`Alterar papel de ${u.full_name || u.email}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contributor">Contribuidor</SelectItem>
                            <SelectItem value="curator">Curador</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {u.id !== currentUser.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/5 gap-1"
                          onClick={() => setConfirmDelete(u)}
                          disabled={processingId === u.id}
                          aria-label={`Excluir conta de ${u.full_name || u.email}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Excluir Conta
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent aria-label="Confirmar exclusão de dados do usuário">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" aria-hidden="true" />
              Excluir dados de {confirmDelete?.full_name || confirmDelete?.email}?
            </DialogTitle>
            <DialogDescription>
              Esta ação irá excluir permanentemente <strong>todos os sinais</strong> submetidos por este usuário e
              <strong> inativar a conta</strong>. O usuário deixará de ter acesso e desaparecerá da listagem.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={!!processingId}
              onClick={() => deleteUserData(confirmDelete)}
            >
              {processingId ? "Excluindo..." : "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}