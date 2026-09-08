// Diagnostic: checks connectivity from Node.js to the Hugging Face Inference API.
// Run: node scripts/check-hf-connectivity.mjs
// Cross-platform (Windows / macOS / Linux) — no dependencies.
//
// Tests, in order:
//   1. Proxy env vars that Node.js would use
//   2. DNS resolution of api-inference.huggingface.co
//   3. HTTPS reachability (HEAD request)
//   4. A real generation call with your HUGGING_FACE_API_KEY

import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";

const HF_HOST = "api-inference.huggingface.co";
const MODEL = "black-forest-labs/FLUX.1-schnell";

async function main() {
  console.log("── Proxy env vars (yang dilihat Node.js) ──");
  const proxies = [
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "http_proxy",
    "https_proxy",
    "NO_PROXY",
  ].filter((k) => process.env[k]);
  console.log(
    proxies.length
      ? proxies.map((k) => `  ${k}=${process.env[k].slice(0, 60)}`).join("\n")
      : "  (none)"
  );

  console.log("\n── 1. DNS lookup ──");
  try {
    const { address } = await dns.lookup(HF_HOST);
    console.log(`  OK → ${address}`);
  } catch (e) {
    console.log(`  FAIL → ${e.message}`);
    console.log(
      "  → Masalah DNS. Coba ganti DNS (mis. 1.1.1.1 / 8.8.8.8) atau periksa koneksi jaringan."
    );
    return;
  }

  console.log("\n── 2. HTTPS ke HF (HEAD) ──");
  try {
    const r = await fetch(`https://${HF_HOST}`, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    console.log(`  OK → HTTP ${r.status}`);
  } catch (e) {
    console.log(`  FAIL → ${e.message}`);
    console.log(
      "  → Node.js tidak bisa HTTPS padahal browser bisa? Kemungkinan besar: firewall Windows memblokir node.exe, atau proxy yang dipakai browser tidak dipakai Node.js."
    );
    return;
  }

  console.log("\n── 3. Generate uji (FLUX.1-schnell, bisa 30–90 detik) ──");
  const key = readEnv("HUGGING_FACE_API_KEY");
  if (!key || key === "your_huggingface_api_key") {
    console.log("  SKIP → HUGGING_FACE_API_KEY belum diisi di .env.local");
    return;
  }
  try {
    const r = await fetch(`https://${HF_HOST}/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({ inputs: "a red fox in snow" }),
      signal: AbortSignal.timeout(90000),
    });
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await r.json();
      console.log(`  HTTP ${r.status} (JSON) → ${JSON.stringify(j).slice(0, 300)}`);
    } else {
      const buf = await r.arrayBuffer();
      console.log(`  ✅ BERHASIL → HTTP ${r.status}, gambar ${buf.byteLength} bytes`);
      console.log(
        "  → Kalau ini berhasil tapi aplikasi tetap gagal, restart `npm run dev` lalu coba lagi."
      );
    }
  } catch (e) {
    console.log(`  FAIL → ${e.message}`);
    console.log(
      "  → Kalau langkah 2 OK tapi langkah 3 gagal, kemungkinan model sedang loading — ulangi perintah ini."
    );
  }
}

function readEnv(name) {
  const file = path.join(process.cwd(), ".env.local");
  try {
    const content = fs.readFileSync(file, "utf8");
    const m = content.match(new RegExp(`^${name}=(.+)$`, "m"));
    return m ? m[1].trim().replace(/^"|"$/g, "") : "";
  } catch {
    return "";
  }
}

main();