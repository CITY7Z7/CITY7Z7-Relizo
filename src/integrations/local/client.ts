type Row = Record<string, any>;

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`/api${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) return { data: null, error: new Error(body.error || "Local database request failed") };
  return { data: body.data, error: null };
}

class QueryBuilder {
  private table: string;
  private filters: Record<string, string> = {};
  private orderBy?: { column: string; ascending: boolean };
  private operation: "select" | "insert" | "update" | "delete" = "select";
  private payload: Row | Row[] = {};
  private one = false;

  constructor(table: string) { this.table = table; }
  select(_columns = "*") { if (this.operation === "select") this.operation = "select"; return this; }
  order(column: string, options?: { ascending?: boolean }) { this.orderBy = { column, ascending: options?.ascending ?? true }; return this; }
  eq(column: string, value: string) { this.filters[column] = value; return this; }
  maybeSingle() { this.one = true; return this; }
  single() { this.one = true; return this; }
  insert(payload: Row | Row[]) { this.operation = "insert"; this.payload = payload; return this; }
  update(payload: Row) { this.operation = "update"; this.payload = payload; return this; }
  delete() { this.operation = "delete"; return this; }
  then(resolve: (value: any) => any, reject?: (reason: any) => any) {
    const query = new URLSearchParams({ ...this.filters });
    if (this.orderBy) { query.set("order", this.orderBy.column); query.set("ascending", String(this.orderBy.ascending)); }
    if (this.one) query.set("single", "true");
    const init: RequestInit = { method: this.operation === "select" ? "GET" : this.operation === "delete" ? "DELETE" : "POST" };
    if (this.operation === "insert" || this.operation === "update") {
      const sanitize = (row: Row) => Object.fromEntries(Object.entries(row).map(([k, v]) => {
        if (typeof v === "boolean") return [k, v ? 1 : 0];
        if (typeof v === "number" && !Number.isFinite(v)) return [k, null];
        return [k, v];
      }));
      const payload = Array.isArray(this.payload) ? this.payload.map(sanitize) : sanitize(this.payload);
      init.body = JSON.stringify({ operation: this.operation, payload, filters: this.filters });
      init.headers = { "Content-Type": "application/json" };
    }
    return request(`/db/${this.table}?${query}`, init).then(resolve, reject);
  }
}

export type Session = { user: { id: string; email: string } } | null;
const listeners = new Set<(event: string, session: Session) => void>();
const session = (): Session => {
  const email = localStorage.getItem("relizo_user");
  return email ? { user: { id: email, email } } : null;
};
const notify = (next: Session) => listeners.forEach(listener => listener(next ? "SIGNED_IN" : "SIGNED_OUT", next));

export const localClient = {
  from: (table: string) => new QueryBuilder(table),
  auth: {
    getSession: async () => ({ data: { session: session() }, error: null }),
    onAuthStateChange: (listener: (_event: string, session: Session) => void) => {
      listeners.add(listener);
      return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
    },
    signInWithPassword: async ({ email }: { email: string; password: string }) => {
      localStorage.setItem("relizo_user", email); const next = session(); notify(next); return { data: { session: next }, error: null };
    },
    signUp: async ({ email }: { email: string; password: string }) => {
      localStorage.setItem("relizo_user", email); const next = session(); notify(next); return { data: { session: next }, error: null };
    },
    signOut: async () => { localStorage.removeItem("relizo_user"); notify(null); return { error: null }; },
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async (path: string, file: File) => {
        const data = Array.from(new Uint8Array(await file.arrayBuffer()));
        return request("/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path, data }) });
      },
      getPublicUrl: (path: string) => ({ data: { publicUrl: `/api/files/${path}` } }),
    }),
  },
};