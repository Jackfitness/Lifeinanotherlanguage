type Handler = (payload?: any) => void;

/** Tiny pub/sub used to decouple game systems from the UI. */
class Bus {
  private map = new Map<string, Set<Handler>>();
  on(evt: string, fn: Handler) {
    if (!this.map.has(evt)) this.map.set(evt, new Set());
    this.map.get(evt)!.add(fn);
    return () => this.map.get(evt)!.delete(fn);
  }
  emit(evt: string, payload?: any) {
    this.map.get(evt)?.forEach((fn) => fn(payload));
  }
}
export const bus = new Bus();
