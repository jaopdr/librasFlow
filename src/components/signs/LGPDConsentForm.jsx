import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Shield } from "lucide-react";

export default function LGPDConsentForm({ data, onChange, errors = {} }) {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <fieldset className="space-y-6">
      <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
          <Shield className="w-4 h-4" />
        </span>
        Consentimento LGPD (TCLE)
      </legend>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl" role="region" aria-label="Informações sobre proteção de dados">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Proteção de Dados Pessoais</p>
            <p>
              Vídeos contendo imagens de pessoas são considerados dados biométricos sensíveis
              pela Lei Geral de Proteção de Dados (LGPD). Ao enviar um vídeo, você declara
              que possui autorização do titular da imagem para uso nesta plataforma.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            data.lgpd_consent
              ? "border-green-400 bg-green-50"
              : "border-border hover:border-primary/30"
          }`}
        >
          <Checkbox
            checked={data.lgpd_consent || false}
            onCheckedChange={(checked) => updateField("lgpd_consent", checked)}
            aria-required="true"
            aria-invalid={!!errors.lgpd_consent}
            id="lgpd_consent"
          />
          <div className="text-sm">
            <span className="font-medium text-foreground">
              Declaro que li e concordo com o Termo de Consentimento Livre e Esclarecido (TCLE) <span className="text-destructive">*</span>
            </span>
            <p className="text-muted-foreground mt-1">
              Autorizo o uso da minha imagem e/ou do menor sob minha responsabilidade
              para fins educacionais nesta plataforma, conforme a LGPD (Lei 13.709/2018).
              Estou ciente de que posso revogar este consentimento a qualquer momento.
            </p>
          </div>
        </label>
        {errors.lgpd_consent && <p className="text-sm text-destructive" role="alert">{errors.lgpd_consent}</p>}

        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
          <Switch
            id="is_minor"
            checked={data.is_minor || false}
            onCheckedChange={(checked) => updateField("is_minor", checked)}
            aria-label="O sinalizante no vídeo é menor de idade"
          />
          <Label htmlFor="is_minor" className="text-sm font-medium cursor-pointer">
            O sinalizante no vídeo é menor de 18 anos
          </Label>
        </div>

        {data.is_minor && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-4" role="region" aria-label="Informações do responsável legal">
            <p className="text-sm font-medium text-amber-800">
              Informações do Responsável Legal (obrigatório para menores)
            </p>
            <div>
              <Label htmlFor="guardian_name" className="text-sm font-medium">
                Nome completo do Responsável <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guardian_name"
                value={data.guardian_name || ""}
                onChange={(e) => updateField("guardian_name", e.target.value)}
                placeholder="Nome do responsável legal"
                className="mt-1.5 bg-white"
                required={data.is_minor}
                aria-required={data.is_minor}
                aria-invalid={!!errors.guardian_name}
              />
              {errors.guardian_name && <p className="text-sm text-destructive mt-1" role="alert">{errors.guardian_name}</p>}
            </div>
            <div>
              <Label htmlFor="guardian_cpf" className="text-sm font-medium">
                CPF do Responsável <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guardian_cpf"
                value={data.guardian_cpf || ""}
                onChange={(e) => updateField("guardian_cpf", e.target.value)}
                placeholder="000.000.000-00"
                className="mt-1.5 bg-white"
                required={data.is_minor}
                aria-required={data.is_minor}
                aria-invalid={!!errors.guardian_cpf}
              />
              {errors.guardian_cpf && <p className="text-sm text-destructive mt-1" role="alert">{errors.guardian_cpf}</p>}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
}