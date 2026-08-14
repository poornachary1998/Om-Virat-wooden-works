'use client';
import { useLang } from '@/lib/i18n';

const STATS = {
  en: [['25+', 'Years of work'], ['1,200+', 'Projects delivered'], ['30', 'Carpenters & workers']],
  te: [['25+', 'సంవత్సరాల అనుభవం'], ['1,200+', 'పూర్తి చేసిన పనులు'], ['30', 'వడ్రంగులు & కార్మికులు']]
};

export default function Stats() {
  const { lang } = useLang();
  return (
    <div className="stats">
      <div className="wrap">
        {STATS[lang].map(([n, label]) => (
          <div key={label}>
            <div className="stat-n">{n}</div>
            <div className="stat-l">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
