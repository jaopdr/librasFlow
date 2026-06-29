import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRightLeft, Languages, Sparkles, Copy, Check, RotateCcw, Info } from "lucide-react";

const EXAMPLES = {
  gloss_to_portuguese: [
    { input: "EU AMANHÃ LOJA IR", description: "Frase simples no futuro" },
    { input: "MULHER LIVRO LER GOSTAR", description: "Expressão de preferência" },
    { input: "HOMEM CARRO COMPRAR PASSADO", description: "Ação no passado" },
    { input: "CRIANÇA ESCOLA NÃO-QUERER", description: "Negação" },
  ],
  portuguese_to_gloss: [
    { input: "Eu irei à loja amanhã", description: "Frase simples no futuro" },
    { input: "A mulher gosta de ler livros", description: "Expressão de preferência" },
    { input: "O homem comprou um carro", description: "Ação no passado" },
    { input: "A criança não quer ir à escola", description: "Negação" },
  ],
};

export default function Translator() {
  const { toast } = useToast();
  const [direction, setDirection] = useState("gloss_to_portuguese");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const isGlossToPortuguese = direction === "gloss_to_portuguese";

  const toggleDirection = () => {
    const newDir = isGlossToPortuguese ? "portuguese_to_gloss" : "gloss_to_portuguese";
    setDirection(newDir);
    setInputText(outputText);
    setOutputText("");
  };

  const translate = async () => {
    if (!inputText.trim()) return;
    setTranslating(true);
    setOutputText("");

    const prompt = isGlossToPortuguese
      ? `Você é um especialista em Libras (Língua Brasileira de Sinais) e linguística. 
Traduza a seguinte "Glosa de Libras" para Português gramaticamente correto e natural.

A Glosa de Libras é a forma como muitas pessoas surdas escrevem, usando a estrutura gramatical de Libras (Tópico-Comentário, sem artigos, preposições simplificadas, verbos no infinitivo ou com marcadores temporais separados).

Glosa de Libras: "${inputText}"

Responda APENAS com a tradução em Português correto, sem explicações adicionais.`
      : `Você é um especialista em Libras (Língua Brasileira de Sinais) e linguística.
Converta o seguinte texto em Português para "Glosa de Libras".

Regras da Glosa de Libras:
- Use LETRAS MAIÚSCULAS
- Remova artigos (o, a, os, as, um, uma)
- Remova preposições quando possível
- Verbos ficam no infinitivo ou com marcadores temporais separados (PASSADO, FUTURO)
- Estrutura: Tópico-Comentário (o contexto/assunto vem primeiro)
- Negação vem após o verbo: NÃO-QUERER, NÃO-TER
- Adjetivos vêm após o substantivo
- Pergunta marcada por expressão facial, não inversão

Texto em Português: "${inputText}"

Responda APENAS com a glosa em Libras, sem explicações adicionais.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setOutputText(result);
    
    await base44.entities.TranslationHistory.create({
      source_text: inputText,
      translated_text: result,
      direction,
    });

    setTranslating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copiado!", description: "Tradução copiada para a área de transferência." });
  };

  const handleExample = (text) => {
    setInputText(text);
    setOutputText("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Tradutor com IA
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Tradutor Libras ↔ Português
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Traduza entre Glosa de Libras e Português gramaticalmente correto usando inteligência artificial.
        </p>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8" role="region" aria-label="Informações sobre o tradutor">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">O que é Glosa de Libras?</p>
            <p>
              A Glosa é uma forma escrita simplificada usada para representar a estrutura da Libras.
              Usa letras maiúsculas, não tem artigos, e segue a ordem Tópico-Comentário.
              Exemplo: "EU AMANHÃ LOJA IR" = "Eu irei à loja amanhã"
            </p>
          </div>
        </div>
      </div>

      {/* Direction Toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${isGlossToPortuguese ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
          Glosa de Libras
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDirection}
          className="rounded-full w-10 h-10 shrink-0"
          aria-label={`Trocar direção de tradução. Atualmente: ${isGlossToPortuguese ? "Glosa para Português" : "Português para Glosa"}`}
        >
          <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />
        </Button>
        <span className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${!isGlossToPortuguese ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
          Português
        </span>
      </div>

      {/* Translation Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <label htmlFor="translation-input" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" aria-hidden="true" />
            {isGlossToPortuguese ? "Glosa de Libras" : "Português"}
          </label>
          <Textarea
            id="translation-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isGlossToPortuguese
              ? "Digite a glosa de Libras... Ex: EU AMANHÃ LOJA IR"
              : "Digite o texto em Português... Ex: Eu irei à loja amanhã"
            }
            className="min-h-[200px] text-base bg-white resize-none"
            aria-label={`Texto de entrada em ${isGlossToPortuguese ? "Glosa de Libras" : "Português"}`}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{inputText.length} caracteres</span>
            {inputText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setInputText(""); setOutputText(""); }}
                className="text-muted-foreground gap-1"
                aria-label="Limpar texto de entrada"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" aria-hidden="true" />
            {isGlossToPortuguese ? "Português" : "Glosa de Libras"}
          </label>
          <div
            className="min-h-[200px] p-4 bg-white border rounded-xl text-base"
            role="region"
            aria-label="Resultado da tradução"
            aria-live="polite"
          >
            {translating ? (
              <div className="flex items-center gap-3 text-muted-foreground" role="status">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span>Traduzindo...</span>
              </div>
            ) : outputText ? (
              <p className="whitespace-pre-wrap">{outputText}</p>
            ) : (
              <p className="text-muted-foreground/50 italic">A tradução aparecerá aqui...</p>
            )}
          </div>
          <div className="flex justify-end">
            {outputText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-1"
                aria-label="Copiar tradução"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Translate Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={translate}
          disabled={!inputText.trim() || translating}
          className="bg-primary hover:bg-primary/90 px-10 h-12 text-base gap-2"
          aria-label="Traduzir texto"
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          {translating ? "Traduzindo..." : "Traduzir"}
        </Button>
      </div>

      {/* Examples */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Exemplos</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXAMPLES[direction].map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExample(ex.input)}
              className="text-left p-4 bg-white border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group"
              aria-label={`Usar exemplo: ${ex.input}`}
            >
              <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                "{ex.input}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}