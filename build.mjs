import { rm, mkdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "./dist";

async function build() {
  console.log("🚀 Iniciando proceso de build...");

  // 1. Limpiar carpeta dist previa si existe
  if (existsSync(DIST_DIR)) {
    await rm(DIST_DIR, { recursive: true, force: true });
    console.log("  ✓ Carpeta dist anterior eliminada");
  }

  // 2. Crear carpeta dist vacía
  await mkdir(DIST_DIR, { recursive: true });

  // 3. Archivos y carpetas requeridos para producción
  const itemsToCopy = [
    "index.html",
    "assets",
    "server.mjs",
    "package.json",
    ".env.example",
  ];

  for (const item of itemsToCopy) {
    if (existsSync(item)) {
      await cp(item, join(DIST_DIR, item), { recursive: true });
      console.log(`  ✓ Copiado a dist/: ${item}`);
    } else {
      console.warn(`  ⚠️ No se encontró: ${item}`);
    }
  }

  console.log("\n✨ ¡Build completado con éxito!");
  console.log(
    '📦 La carpeta "dist/" ya contiene la versión de producción lista para despliegue.',
  );
}

build().catch((err) => {
  console.error("❌ Error durante el proceso de build:", err);
  process.exit(1);
});
