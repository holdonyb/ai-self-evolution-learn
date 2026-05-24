type StreamingResultUtterance = {
  text?: unknown;
};

type StreamingResultPayload = {
  result?: {
    text?: unknown;
    utterances?: StreamingResultUtterance[] | unknown;
  };
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function longestOverlap(left: string, right: string) {
  const maxLength = Math.min(left.length, right.length);

  for (let length = maxLength; length > 0; length -= 1) {
    if (left.slice(-length) === right.slice(0, length)) {
      return length;
    }
  }

  return 0;
}

export function extractStreamingTranscript(text: string, fullData: unknown) {
  const fallbackText = normalizeText(text);
  const payload = fullData as StreamingResultPayload | null;
  const currentText = normalizeText(payload?.result?.text) || fallbackText;
  const utterances = Array.isArray(payload?.result?.utterances) ? payload?.result?.utterances : [];
  const utteranceText = utterances
    .map((item) => normalizeText(item?.text))
    .filter(Boolean)
    .join("");

  if (!utteranceText) {
    return currentText;
  }

  if (!currentText || utteranceText.endsWith(currentText) || utteranceText.includes(currentText)) {
    return utteranceText;
  }

  if (currentText.startsWith(utteranceText)) {
    return currentText;
  }

  const overlap = longestOverlap(utteranceText, currentText);
  if (overlap > 0) {
    return `${utteranceText}${currentText.slice(overlap)}`;
  }

  return `${utteranceText}${currentText}`;
}

export function mergeStreamingTranscript(aggregateText: string, previousPacketText: string, nextPacketText: string) {
  const aggregate = normalizeText(aggregateText);
  const previous = normalizeText(previousPacketText);
  const next = normalizeText(nextPacketText);

  if (!next) {
    return aggregate;
  }

  if (!aggregate) {
    return next;
  }

  if (!previous) {
    if (next.startsWith(aggregate)) {
      return next;
    }

    if (aggregate.endsWith(next)) {
      return aggregate;
    }

    const overlap = longestOverlap(aggregate, next);
    return overlap > 0 ? `${aggregate}${next.slice(overlap)}` : `${aggregate}${next}`;
  }

  if (next.startsWith(aggregate)) {
    return next;
  }

  if (next.startsWith(previous)) {
    const suffix = next.slice(previous.length);
    return suffix ? `${aggregate}${suffix}` : aggregate;
  }

  if (previous.startsWith(next)) {
    return aggregate;
  }

  if (aggregate.endsWith(next)) {
    return aggregate;
  }
  const overlap = longestOverlap(previous, next) || longestOverlap(aggregate, next);
  return overlap > 0 ? `${aggregate}${next.slice(overlap)}` : `${aggregate}${next}`;
}
