import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hand, Eye, Play } from "lucide-react";

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
};
const STATUS_LABELS = {
  approved: "Aprovado",
  pending: "Pendente",
  rejected: "Rejeitado",
};

export default function SignCard({ sign, showStatus = false }) {
  return (
    <article
      className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
      aria-label={`Sinal: ${sign.portuguese_word}`}
    >
      {/* Media: photo top, video on hover */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {/* Hand photo — always shown if present */}
        {sign.hand_photo_url && (
          <img
            src={sign.hand_photo_url}
            alt={`Configuração de mão: ${sign.portuguese_word}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Video overlay on hover */}
        {sign.video_url && (
          <video
            src={sign.video_url}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              sign.hand_photo_url ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
            muted
            loop
            playsInline
            onMouseOver={(e) => e.target.play()}
            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            aria-label={`Vídeo do sinal ${sign.portuguese_word}`}
          />
        )}

        {/* Fallback: no media */}
        {!sign.hand_photo_url && !sign.video_url && (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-teal-50 flex items-center justify-center">
            <Hand className="w-12 h-12 text-primary/30" aria-hidden="true" />
          </div>
        )}

        {/* Play badge when video available + photo shown */}
        {sign.hand_photo_url && sign.video_url && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs flex items-center gap-1 opacity-80 group-hover:opacity-0 transition-opacity">
            <Play className="w-3 h-3" aria-hidden="true" /> ver vídeo
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
            {sign.portuguese_word}
          </h3>
          {showStatus && (
            <Badge className={`${STATUS_STYLES[sign.status]} text-xs shrink-0`}>
              {STATUS_LABELS[sign.status]}
            </Badge>
          )}
        </div>

        {sign.regional_variation && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{sign.regional_variation}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{sign.sign_classification || "Não classificado"}</span>
        </div>

        {sign.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sign.categories.map((cat) => (
              <span key={cat} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                {cat}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/sign/${sign.id}`}
          className="mt-1 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          aria-label={`Ver detalhes do sinal ${sign.portuguese_word}`}
        >
          Ver detalhes →
        </Link>
      </div>
    </article>
  );
}