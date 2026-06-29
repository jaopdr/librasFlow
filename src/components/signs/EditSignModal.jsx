import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import SignFormFields from "@/components/signs/SignFormFields";
import { Upload, X, FileVideo, ImageIcon } from "lucide-react";

export default function EditSignModal({ sign, open, onClose, onSaved }) {
  const [formData, setFormData] = useState({ ...sign });
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    let updatedData = { ...formData };

    if (photoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
      updatedData.hand_photo_url = file_url;
    } else if (!updatedData.hand_photo_url) {
      // hand_photo_url is required — always fall back to the original value
      updatedData.hand_photo_url = sign.hand_photo_url;
    }
    if (videoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });
      updatedData.video_url = file_url;
    }

    await base44.entities.Sign.update(sign.id, updatedData);
    setSaving(false);
    onSaved({ ...updatedData, id: sign.id });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Sinal: {sign.portuguese_word}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Media uploads */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Photo */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Foto da Mão
              </label>
              {(photoFile || formData.hand_photo_url) && (
                <div className="relative mb-2">
                  <img
                    src={photoFile ? URL.createObjectURL(photoFile) : formData.hand_photo_url}
                    alt="Prévia da foto"
                    className="w-full aspect-video object-cover rounded-lg border"
                  />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-lg px-4 py-3 hover:border-primary/50 transition-colors text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                {photoFile ? photoFile.name : "Escolher nova foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                />
              </label>
            </div>

            {/* Video */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileVideo className="w-4 h-4" /> Vídeo Demonstrativo
              </label>
              {(videoFile || formData.video_url) && (
                <div className="relative mb-2">
                  <video
                    src={videoFile ? URL.createObjectURL(videoFile) : formData.video_url}
                    className="w-full aspect-video object-cover rounded-lg border bg-black"
                    controls
                  />
                  <button
                    onClick={() => { setVideoFile(null); setFormData(f => ({ ...f, video_url: "" })); }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-lg px-4 py-3 hover:border-primary/50 transition-colors text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                {videoFile ? videoFile.name : "Escolher novo vídeo"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setVideoFile(e.target.files[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* All other sign fields */}
          <SignFormFields data={formData} onChange={setFormData} errors={{}} />
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}