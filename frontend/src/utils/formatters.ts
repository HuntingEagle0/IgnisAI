export function formatConfidence(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

export function formatFRP(val: number): string {
  return `${val.toFixed(1)} MW`;
}

export function formatTemp(val: number): string {
  return `${val.toFixed(1)} K`;
}

export function formatCoordinates(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

export function formatDateTime(dtStr: string): string {
  try {
    const d = new Date(dtStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dtStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dtStr;
  }
}
