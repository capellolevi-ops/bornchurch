/**
 * Cálculo do próximo horário de cada culto (fuso de Brasília, UTC-3).
 * Usado pelos contadores regressivos do site.
 */

const SP_OFFSET_MS = 3 * 60 * 60 * 1000;

const weekdayMap: Record<string, number> = {
  domingo: 0,
  "segunda-feira": 1,
  segunda: 1,
  "terça-feira": 2,
  terca: 2,
  "quarta-feira": 3,
  quarta: 3,
  "quinta-feira": 4,
  quinta: 4,
  "sexta-feira": 5,
  sexta: 5,
  sábado: 6,
  sabado: 6,
};

/** Converte "Domingo" em 0..6. Retorna null quando não é um dia da semana. */
export function weekdayIndex(day: string): number | null {
  const key = day.trim().toLowerCase();
  return key in weekdayMap ? (weekdayMap[key] as number) : null;
}

/** Extrai horas e minutos de textos como "10h00", "18h30 às 21h00" ou "20:00". */
export function parseTime(time: string): { hours: number; minutes: number } | null {
  const match = /(\d{1,2})\s*[h:]\s*(\d{2})?/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  if (Number.isNaN(hours) || hours > 23) return null;
  return { hours, minutes: Number.isNaN(minutes) ? 0 : minutes };
}

/** Próxima ocorrência (timestamp UTC) de um culto semanal, ou null se não recorrente. */
export function nextOccurrence(day: string, times: readonly string[]): number | null {
  const weekday = weekdayIndex(day);
  if (weekday === null) return null;

  const now = Date.now();
  let best: number | null = null;

  for (const time of times) {
    const parsed = parseTime(time);
    if (!parsed) continue;

    // "Agora" nos campos UTC representa o horário local de Brasília.
    const sp = new Date(now - SP_OFFSET_MS);
    let delta = (weekday - sp.getUTCDay() + 7) % 7;
    let candidate =
      Date.UTC(
        sp.getUTCFullYear(),
        sp.getUTCMonth(),
        sp.getUTCDate() + delta,
        parsed.hours,
        parsed.minutes,
      ) + SP_OFFSET_MS;

    if (candidate <= now) {
      delta += 7;
      candidate =
        Date.UTC(
          sp.getUTCFullYear(),
          sp.getUTCMonth(),
          sp.getUTCDate() + delta,
          parsed.hours,
          parsed.minutes,
        ) + SP_OFFSET_MS;
    }

    if (best === null || candidate < best) best = candidate;
  }

  return best;
}

export type CountdownParts = { dias: number; horas: number; min: number; seg: number };

/** Diferença até o alvo, ou null quando já passou. */
export function countdownParts(target: number): CountdownParts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  return {
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor((ms / 3_600_000) % 24),
    min: Math.floor((ms / 60_000) % 60),
    seg: Math.floor((ms / 1000) % 60),
  };
}
