import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SignFormFields from "@/components/signs/SignFormFields";
import LGPDConsentForm from "@/components/signs/LGPDConsentForm";
import { Upload, CheckCircle, FileVideo, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubmitSign() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    status: "pending",
    articulation_point: [],
    non_manual_components: [],
    categories: [],
    synonyms: [],
    lgpd_consent: false,
    is_minor: false,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin("/submit");
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
    }
    checkAuth();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.portuguese_word?.trim()) errs.portuguese_word = "A palavra em português é obrigatória.";
    if (!formData.sign_classification) errs.sign_classification = "A classificação do sinal é obrigatória.";
    if (!photoFile) errs.photo = "A foto da configuração de mão é obrigatória.";
    if (!videoFile) errs.video = "O vídeo demonstrativo é obrigatório.";
    if (!formData.lgpd_consent) errs.lgpd_consent = "O consentimento LGPD é obrigatório para envio.";
    if (formData.is_minor && !formData.guardian_name?.trim()) errs.guardian_name = "Nome do responsável é obrigatório para menores.";
    if (formData.is_minor && !formData.guardian_cpf?.trim()) errs.guardian_cpf = "CPF do responsável é obrigatório para menores.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Erro", description: "O vídeo deve ter no máximo 50MB.", variant: "destructive" });
      return;
    }
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      toast({ title: "Erro", description: "Formato aceito: MP4 ou WebM.", variant: "destructive" });
      return;
    }
    setVideoFile(file);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Erro", description: "A foto deve ter no máximo 10MB.", variant: "destructive" });
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Erro", description: "Formato aceito: JPG, PNG ou WebP.", variant: "destructive" });
      return;
    }
    setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    setUploading(true);
    let videoUrl = "";
    let handPhotoUrl = "";
    if (videoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });
      videoUrl = file_url;
    }
    if (photoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
      handPhotoUrl = file_url;
    }
    await base44.entities.Sign.create({
      ...formData,
      video_url: videoUrl,
      hand_photo_url: handPhotoUrl,
      status: "pending",
    });
    setUploading(false);
    setSubmitted(true);
    toast({ title: "Sinal enviado!", description: "Seu sinal foi enviado para revisão por um curador." });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="sr-only">Verificando autenticação...</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Sinal Enviado com Sucesso!</h1>
        <p className="text-muted-foreground mb-8">
          Seu sinal está com status <strong>Pendente</strong> e será revisado por um curador linguista.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => {
            setSubmitted(false);
            setFormData({ status: "pending", articulation_point: [], non_manual_components: [], categories: [], synonyms: [], lgpd_consent: false, is_minor: false });
            setVideoFile(null);
            setPhotoFile(null);
            setErrors({});
          }}>
            Submeter Outro Sinal
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>Voltar ao Dicionário</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Submeter Novo Sinal</h1>
        <p className="text-muted-foreground">
          Contribua com o dicionário adicionando um novo sinal. Preencha os parâmetros gramaticais,
          envie um vídeo e uma foto da configuração de mão. Seu envio será revisado por um curador.
        </p>
      </div>

      <form onSubmit={handleSubmit} aria-label="Formulário de submissão de novo sinal" noValidate>
        <div className="space-y-10">
          <SignFormFields data={formData} onChange={setFormData} errors={errors} />

          {/* Hand Photo Upload — MANDATORY */}
          <fieldset>
            <legend className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
                <Camera className="w-4 h-4" />
              </span>
              Foto da Configuração de Mão
              <span className="text-destructive text-sm" aria-label="campo obrigatório">*</span>
            </legend>
            <p className="text-sm text-muted-foreground mb-3">
              Envie uma foto clara mostrando a posição exata da mão para este sinal. JPG, PNG ou WebP — máximo 10MB.
            </p>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                photoFile
                  ? "border-green-400 bg-green-50"
                  : errors.photo
                  ? "border-destructive bg-destructive/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Enviar foto da configuração de mão (JPG, PNG ou WebP, máximo 10MB)"
                aria-required="true"
                aria-invalid={!!errors.photo}
                id="photo-upload"
              />
              {photoFile ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt="Pré-visualização da foto enviada"
                    className="h-32 object-contain rounded-lg"
                  />
                  <p className="font-medium text-green-800">{photoFile.name}</p>
                  <p className="text-sm text-green-600">{(photoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
              ) : (
                <div>
                  <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
                  <p className="font-medium text-foreground">Clique ou arraste uma foto</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG ou WebP — máximo 10MB</p>
                </div>
              )}
            </div>
            {errors.photo && <p className="text-sm text-destructive mt-1" role="alert">{errors.photo}</p>}
          </fieldset>

          {/* Video Upload — MANDATORY */}
          <fieldset>
            <legend className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
                <FileVideo className="w-4 h-4" />
              </span>
              Vídeo Demonstrativo
              <span className="text-destructive text-sm" aria-label="campo obrigatório">*</span>
            </legend>
            <p className="text-sm text-muted-foreground mb-3">MP4 ou WebM — máximo 50MB.</p>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                videoFile
                  ? "border-green-400 bg-green-50"
                  : errors.video
                  ? "border-destructive bg-destructive/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Enviar vídeo demonstrativo do sinal (MP4 ou WebM, máximo 50MB)"
                aria-required="true"
                aria-invalid={!!errors.video}
                id="video-upload"
              />
              {videoFile ? (
                <div>
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="font-medium text-green-800">{videoFile.name}</p>
                  <p className="text-sm text-green-600 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
                  <p className="font-medium text-foreground">Clique ou arraste um vídeo</p>
                  <p className="text-sm text-muted-foreground mt-1">MP4 ou WebM — máximo 50MB</p>
                </div>
              )}
            </div>
            {errors.video && <p className="text-sm text-destructive mt-1" role="alert">{errors.video}</p>}
          </fieldset>

          {/* LGPD Consent */}
          <LGPDConsentForm data={formData} onChange={setFormData} errors={errors} />

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 px-8 h-12 text-base"
              aria-label="Enviar sinal para revisão"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Enviando...
                </span>
              ) : (
                "Enviar para Revisão"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Seu sinal ficará com status <strong>Pendente</strong> até ser aprovado por um curador.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}