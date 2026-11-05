import { S, store } from './save';
import { bus } from './events';

/**
 * Village Pass pricing and purchases.
 *
 * RevenueCat setup: one entitlement (any name) and a default offering with a Monthly package
 * (auto-renewing, 7-day free trial) and a Lifetime package (one-time). Suggested product ids:
 *   - village_pass_lifetime  one-time, unlocks everything forever
 *   - village_pass_monthly   auto-renewing, with a 7-day free trial
 * Other packages in the offering (e.g. Yearly) are ignored.
 *
 * Backends:
 *   - RevenueCat (native app wrapped with Capacitor + @revenuecat/purchases-capacitor): real payments.
 *   - Test mode (web build / artifact): no money changes hands; purchases are simulated so the whole
 *     flow can be played and tested. The pass sheet says so clearly.
 */
export type PlanId = 'village_pass_lifetime' | 'village_pass_monthly';
export interface Plan { id: PlanId; price: string; trialDays?: number; period?: 'month'; pkg?: unknown }
export interface Billing {
  readonly real: boolean;
  plans(): Promise<Plan[]>;
  purchase(plan: Plan): Promise<'ok' | 'cancelled' | 'error'>;
  restore(): Promise<boolean>;
  /** Re-check the entitlement with the store (on launch / resume). */
  refresh(): Promise<void>;
}

/** Default prices (USD). Stores localize these per country; RevenueCat returns the real strings. */
export const PRICING = {
  lifetime: { usd: 19.99, label: '$19.99' },
  monthly: { usd: 3.99, label: '$3.99', trialDays: 7 },
};
/** The free taste of the Pass: the first chapter(s) of the first town. */
export const FREE_PREVIEW = { town: 'clover', chapters: 1 };
/** Towns that are completely free (the writing-systems town). */
export const FREE_TOWNS = ['ink'];
/** Any active RevenueCat entitlement unlocks the Pass, whatever it's called in the dashboard. */
const ENTITLEMENT_HINT = 'village_pass';

// ------------------------------------------------------------------ entitlement
const params = new URLSearchParams(location.search);

/** True when the player owns the Pass (lifetime, or a monthly plan that hasn't lapsed). */
export function hasPass(): boolean {
  if (params.get('pass') === '1') return true;
  const f = store.data?.flags as Record<string, unknown> | undefined; // no save yet (title / onboarding)
  if (!f) return false;
  if (!f.villagePass) return false;
  const exp = Number(f.passExpires ?? 0);
  return !exp || Date.now() < exp;
}

function grant(plan: PlanId | null, expires = 0) {
  if (!store.data) return;
  const f = S().flags as Record<string, unknown>;
  const had = hasPass();
  f.villagePass = !!plan;
  f.passPlan = plan ?? undefined;
  f.passExpires = expires || undefined;
  store.touch('pass');
  if (!had && hasPass()) bus.emit('pass:granted', plan);
}

/** Is this town quest beyond the free preview for a player without the Pass? */
export function questLocked(q: { town?: string; chapter?: number }): boolean {
  if (!q.town || hasPass() || FREE_TOWNS.includes(q.town)) return false;
  return !(q.town === FREE_PREVIEW.town && (q.chapter ?? 1) <= FREE_PREVIEW.chapters);
}
export const townOpenFree = (town: string) => town === FREE_PREVIEW.town || FREE_TOWNS.includes(town);

// ------------------------------------------------------------------ RevenueCat (native)
type RCPackage = { identifier: string; packageType?: string; product: { identifier: string; priceString: string; introPrice?: { periodNumberOfUnits?: number } | null } };
type RCInfo = { entitlements: { active: Record<string, { productIdentifier: string; expirationDate?: string | null }> } };
interface RCPlugin {
  configure(o: { apiKey: string }): Promise<void>;
  getOfferings(): Promise<{ current?: { availablePackages: RCPackage[] } | null }>;
  purchasePackage(o: { aPackage: RCPackage }): Promise<{ customerInfo: RCInfo }>;
  restorePurchases(): Promise<{ customerInfo: RCInfo }>;
  getCustomerInfo(): Promise<{ customerInfo: RCInfo }>;
}

class RevenueCatBilling implements Billing {
  readonly real = true;
  private ready: Promise<void>;
  constructor(private rc: RCPlugin, apiKey: string) { this.ready = rc.configure({ apiKey }); }
  private apply(info: RCInfo) {
    const active = info.entitlements.active;
    const e = active[ENTITLEMENT_HINT] ?? Object.values(active)[0];
    if (!e) { grant(null); return; }
    // a subscription has an expiry date; a lifetime purchase doesn't
    const plan: PlanId = e.expirationDate ? 'village_pass_monthly' : 'village_pass_lifetime';
    grant(plan, e.expirationDate ? Date.parse(e.expirationDate) : 0);
  }
  async plans() {
    await this.ready;
    const off = await this.rc.getOfferings();
    // Use the packages' types from the offering (Monthly / Lifetime), not product names.
    const pkgs = (off.current?.availablePackages ?? []).filter((p) => p.packageType === 'MONTHLY' || p.packageType === 'LIFETIME' || /monthly|lifetime/i.test(p.product.identifier));
    return pkgs.map((p): Plan => {
      const monthly = p.packageType ? p.packageType === 'MONTHLY' : /monthly/i.test(p.product.identifier);
      return { id: monthly ? 'village_pass_monthly' : 'village_pass_lifetime', price: p.product.priceString, period: monthly ? 'month' : undefined, trialDays: p.product.introPrice?.periodNumberOfUnits ?? undefined, pkg: p };
    });
  }
  async purchase(plan: Plan) {
    try {
      await this.ready;
      const r = await this.rc.purchasePackage({ aPackage: plan.pkg as RCPackage });
      this.apply(r.customerInfo);
      return hasPass() ? 'ok' : 'error';
    } catch (e) {
      const err = e as { userCancelled?: boolean | null; code?: string | number };
      return err?.userCancelled || String(err?.code) === '1' || String(err?.code) === 'PURCHASE_CANCELLED' ? 'cancelled' : 'error';
    }
  }
  async restore() { await this.ready; const r = await this.rc.restorePurchases(); this.apply(r.customerInfo); return hasPass(); }
  async refresh() { try { await this.ready; this.apply((await this.rc.getCustomerInfo()).customerInfo); } catch { /* offline: keep cached entitlement */ } }
}

// ------------------------------------------------------------------ test mode (web)
class TestBilling implements Billing {
  readonly real = false;
  async plans(): Promise<Plan[]> {
    return [
      { id: 'village_pass_lifetime', price: PRICING.lifetime.label },
      { id: 'village_pass_monthly', price: PRICING.monthly.label, period: 'month', trialDays: PRICING.monthly.trialDays },
    ];
  }
  async purchase(plan: Plan) {
    grant(plan.id, plan.id === 'village_pass_monthly' ? Date.now() + 30 * 864e5 : 0);
    return 'ok' as const;
  }
  async restore() { return hasPass(); }
  async refresh() { if (store.data && !hasPass() && (S().flags as Record<string, unknown>).villagePass) grant(null); }
}

// ------------------------------------------------------------------ pick a backend
const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};

/** Real payments inside the iOS / Android app; test mode on the web. */
/** A native build with no store key: never fake a purchase, just report the store as unavailable. */
class NoBilling implements Billing {
  readonly real = true;
  async plans(): Promise<Plan[]> { throw new Error('store unavailable'); }
  async purchase() { return 'error' as const; }
  async restore() { return hasPass(); }
  async refresh() {}
}

async function isNative() { try { return (await import('@capacitor/core')).Capacitor.isNativePlatform(); } catch { return false; } }

class LazyBilling implements Billing {
  private inner: Promise<Billing>;
  real = false;
  constructor() {
    this.inner = (async (): Promise<Billing> => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return new TestBilling();
        const platform = Capacitor.getPlatform();
        const key = (window as unknown as { __RC_KEY__?: string }).__RC_KEY__
          || (platform === 'ios' ? env.VITE_REVENUECAT_IOS_KEY : env.VITE_REVENUECAT_ANDROID_KEY) || env.VITE_REVENUECAT_KEY;
        if (!key) { console.warn('RevenueCat key missing: the store is unavailable'); this.real = true; return new NoBilling(); }
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        const b = new RevenueCatBilling(Purchases as unknown as RCPlugin, key);
        this.real = true;
        return b;
      } catch (e) { console.warn('billing fallback', e); return (await isNative()) ? (this.real = true, new NoBilling()) : new TestBilling(); }
    })();
  }
  async plans() { return (await this.inner).plans(); }
  async purchase(p: Plan) { return (await this.inner).purchase(p); }
  async restore() { return (await this.inner).restore(); }
  async refresh() { return (await this.inner).refresh(); }
  /** Resolves once the backend is chosen (the pass sheet waits for it). */
  ready() { return this.inner.then(() => this.real); }
}
export const billing = new LazyBilling();
