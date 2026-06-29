import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const REGIONS = ["Nacional", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const ARTICULATION_POINTS = ["Cabeça", "Olhos", "Tórax", "Cintura", "Braços", "Mãos"];

const HAND_DISPOSITIONS = ["Paralela", "Cruzada", "Entrelaçada", "Uma sobre a outra", "Uma ao lado da outra", "N/A"];

const HAND_ORIENTATIONS = ["Para cima", "Para baixo", "Para frente", "Para trás", "Para dentro", "Para fora", "N/A"];

const SIGN_CLASSIFICATIONS = ["Uma mão", "Duas mãos - movimentos diferentes", "Duas mãos - movimentos iguais", "Movimento facial"];

const NON_MANUAL_OPTIONS = ["Expressão de interrogação", "Expressão de negação", "Expressão de afirmação", "Sopro", "Bochechas infladas", "Boca aberta", "Língua visível", "Sobrancelhas levantadas", "Sobrancelhas franzidas", "Olhos arregalados", "Olhos semicerrados", "Movimentação do tronco", "Inclinação da cabeça"];

const CATEGORIES = ["Animais", "Cores", "Família", "Alimentos", "Educação", "Saúde", "Trabalho", "Tecnologia", "Natureza", "Esportes", "Sentimentos", "Tempo", "Lugares", "Números", "Cumprimentos", "Verbos", "Adjetivos"];

export default function SignFormFields({ data, onChange, errors = {} }) {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const toggleArrayItem = (field, item) => {
    const current = data[field] || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateField(field, updated);
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <fieldset>
        <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold" aria-hidden="true">1</span>
          Informações Básicas
        </legend>
        <div className="space-y-4">
          <div>
            <Label htmlFor="portuguese_word" className="text-sm font-medium">
              Palavra em Português <span className="text-destructive" aria-label="campo obrigatório">*</span>
            </Label>
            <Input
              id="portuguese_word"
              value={data.portuguese_word || ""}
              onChange={(e) => updateField("portuguese_word", e.target.value)}
              placeholder="Ex: Obrigado"
              className="mt-1.5"
              required
              aria-required="true"
              aria-invalid={!!errors.portuguese_word}
              aria-describedby={errors.portuguese_word ? "error-word" : undefined}
            />
            {errors.portuguese_word && <p id="error-word" className="text-sm text-destructive mt-1" role="alert">{errors.portuguese_word}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">Descrição do Sinal</Label>
            <Textarea
              id="description"
              value={data.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descreva como o sinal é realizado..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="regional_variation" className="text-sm font-medium">Variação Regional</Label>
            <Select value={data.regional_variation || ""} onValueChange={(v) => updateField("regional_variation", v)}>
              <SelectTrigger id="regional_variation" className="mt-1.5" aria-label="Selecionar variação regional">
                <SelectValue placeholder="Selecione a região" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* Primary Parameters */}
      <fieldset>
        <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold" aria-hidden="true">2</span>
          Parâmetros Primários
        </legend>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Ponto de Articulação</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Pontos de articulação">
              {ARTICULATION_POINTS.map((point) => (
                <label
                  key={point}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                    (data.articulation_point || []).includes(point)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <Checkbox
                    checked={(data.articulation_point || []).includes(point)}
                    onCheckedChange={() => toggleArrayItem("articulation_point", point)}
                    aria-label={point}
                  />
                  {point}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="hand_configuration" className="text-sm font-medium">Configuração da Mão</Label>
            <Input
              id="hand_configuration"
              value={data.hand_configuration || ""}
              onChange={(e) => updateField("hand_configuration", e.target.value)}
              placeholder="Descreva a configuração da mão"
              className="mt-1.5"
            />
          </div>
        </div>
      </fieldset>

      {/* Secondary Parameters */}
      <fieldset>
        <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold" aria-hidden="true">3</span>
          Parâmetros Secundários
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hand_disposition" className="text-sm font-medium">Disposição das Mãos</Label>
            <Select value={data.hand_disposition || ""} onValueChange={(v) => updateField("hand_disposition", v)}>
              <SelectTrigger id="hand_disposition" className="mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {HAND_DISPOSITIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hand_orientation" className="text-sm font-medium">Orientação da Mão</Label>
            <Select value={data.hand_orientation || ""} onValueChange={(v) => updateField("hand_orientation", v)}>
              <SelectTrigger id="hand_orientation" className="mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {HAND_ORIENTATIONS.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="contact_region" className="text-sm font-medium">Região de Contato</Label>
            <Input
              id="contact_region"
              value={data.contact_region || ""}
              onChange={(e) => updateField("contact_region", e.target.value)}
              placeholder="Ex: Ponta dos dedos"
              className="mt-1.5"
            />
          </div>
        </div>
      </fieldset>

      {/* Non-Manual Components */}
      <fieldset>
        <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold" aria-hidden="true">4</span>
          Componentes Não-Manuais
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Componentes não-manuais">
          {NON_MANUAL_OPTIONS.map((comp) => (
            <label
              key={comp}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                (data.non_manual_components || []).includes(comp)
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30 hover:bg-muted"
              }`}
            >
              <Checkbox
                checked={(data.non_manual_components || []).includes(comp)}
                onCheckedChange={() => toggleArrayItem("non_manual_components", comp)}
                aria-label={comp}
              />
              {comp}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Classification */}
      <fieldset>
        <legend className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold" aria-hidden="true">5</span>
          Classificação do Sinal
        </legend>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sign_classification" className="text-sm font-medium">
              Tipo de Sinal <span className="text-destructive" aria-label="campo obrigatório">*</span>
            </Label>
            <Select value={data.sign_classification || ""} onValueChange={(v) => updateField("sign_classification", v)}>
              <SelectTrigger id="sign_classification" className="mt-1.5" aria-required="true">
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                {SIGN_CLASSIFICATIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sign_classification && <p className="text-sm text-destructive mt-1" role="alert">{errors.sign_classification}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Categorias</Label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Categorias do sinal">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleArrayItem("categories", cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    (data.categories || []).includes(cat)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  aria-pressed={(data.categories || []).includes(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="synonyms_input" className="text-sm font-medium">Sinônimos (separados por vírgula)</Label>
            <Input
              id="synonyms_input"
              value={(data.synonyms || []).join(", ")}
              onChange={(e) => updateField("synonyms", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Ex: Agradecer, Grato"
              className="mt-1.5"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}