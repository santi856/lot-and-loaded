// Lot & Loaded — shared form plumbing (vanilla JS, no dependencies).
//
// Submit path:
//   1. If an anon key is configured, POST the submission to Supabase REST.
//   2. On any failure (no key, network, table not created yet), save to
//      localStorage on this device and report mode "local" so the UI can
//      tell the user honestly how their submission was stored.
// Existing backend objects are never touched — these are two new tables only.

(function () {
  var cfg = window.PLATFORM_CONFIG || {};

  function localSave(kind, payload) {
    try {
      var key = "lot_and_loaded_local_submissions";
      var all = JSON.parse(localStorage.getItem(key) || "[]");
      all.push({ kind: kind, saved_at: new Date().toISOString(), payload: payload });
      localStorage.setItem(key, JSON.stringify(all));
    } catch (e) { /* storage unavailable — nothing more we can do client-side */ }
  }

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem("lot_and_loaded_local_submissions") || "[]");
    } catch (e) { return []; }
  }

  // Returns a Promise resolving to { ok: true, mode: "live" | "local" }.
  function submit(kind, table, payload) {
    if (!cfg.SUPABASE_ANON_KEY) {
      localSave(kind, payload);
      return Promise.resolve({ ok: true, mode: "local" });
    }
    return fetch(cfg.SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: {
        "apikey": cfg.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.ok) return { ok: true, mode: "live" };
      localSave(kind, payload);
      return { ok: true, mode: "local" };
    }).catch(function () {
      localSave(kind, payload);
      return { ok: true, mode: "local" };
    });
  }

  // HQ read path (admin.html). Uses a service_role key pasted at runtime and
  // kept only in sessionStorage for the tab session — never shipped in code.
  function fetchRows(table, serviceKey) {
    return fetch(cfg.SUPABASE_URL + "/rest/v1/" + table + "?select=*&order=created_at.desc&limit=200", {
      headers: {
        "apikey": serviceKey,
        "Authorization": "Bearer " + serviceKey
      }
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  window.LotLoaded = {
    submit: submit,
    fetchRows: fetchRows,
    readLocal: readLocal,
    config: cfg
  };
})();
