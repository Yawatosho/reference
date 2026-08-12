export function getRank(total) {
  if (total >= 95) return "S";
  if (total >= 85) return "A";
  if (total >= 70) return "B";
  if (total >= 50) return "C";
  return "D";
}

export function calculateScore(
  caseData,
  selections,
) {
  const segments = caseData.deduction.slots.map((slot) => {
    const selected = slot.options.find(
      (option) => option.id === selections[slot.id],
    );
    const ratio = selected?.score ?? 0;

    return {
      id: slot.id,
      label: slot.label,
      selectedText: selected?.text ?? "未選択",
      ratio,
      points: ratio * 25,
      mark: ratio === 1 ? "correct" : ratio > 0 ? "partial" : "incorrect",
    };
  });

  const accuracy = segments.reduce((sum, segment) => sum + segment.points, 0);
  const total = accuracy;

  return {
    segments,
    accuracy,
    total,
    rank: getRank(total),
  };
}
