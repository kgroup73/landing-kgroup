// Servidor de desarrollo y producción con integrador de Resend API.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 4321;

// Cargar variables de entorno desde .env si existe
if (existsSync(join(ROOT, '.env'))) {
  const envContent = readFileSync(join(ROOT, '.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json'
};

createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 📩 Endpoint para recibir formularios y enviarlos con Resend
  if (req.method === 'POST' && req.url === '/api/contacto') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          throw new Error('Falta configurar RESEND_API_KEY en el archivo .env');
        }

        const data = JSON.parse(bodyStr || '{}');
        const { nombre, empresa, email, telefono, mensaje } = data;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'KGroup Landing <onboarding@resend.dev>',
            to: ['kgroupmed@gmail.com'],
            subject: `🚀 Nuevo Lead: ${nombre} (${empresa || 'Particular'})`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #6C4FF6; margin-top: 0;">Nuevo mensaje desde KGroup Landing</h2>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                <p><strong>👤 Nombre:</strong> ${nombre || '—'}</p>
                <p><strong>🏢 Empresa:</strong> ${empresa || 'Sin especificar'}</p>
                <p><strong>✉️ Correo:</strong> <a href="mailto:${email}">${email || '—'}</a></p>
                <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${(telefono || '').replace(/\D/g, '')}">${telefono || '—'}</a></p>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
                  <strong style="display: block; margin-bottom: 8px;">💬 Mensaje / Detalles del Proyecto:</strong>
                  <p style="margin: 0; white-space: pre-wrap;">${mensaje || 'Sin mensaje adicional'}</p>
                </div>
              </div>
            `
          })
        });

        const resendJson = await resendRes.json();
        if (resendRes.ok) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, id: resendJson.id }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: resendJson.message || 'Error en Resend' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Servidor de archivos estáticos
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, rel);

  try {
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404');
  }
}).listen(PORT, () => console.log(`KGroup landing → http://localhost:${PORT}`));
