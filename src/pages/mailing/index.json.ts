import type { APIRoute } from "astro";
import { RESEND_API_KEY } from "astro:env/server";

export const POST = (async ({ request }) => {
  try {
    const apiKey = RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Falta configurar RESEND_API_KEY en el archivo .env");
    }

    const { nombre, empresa, email, telefono, mensaje } = await request.json();

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KGroup Landing <onboarding@resend.dev>",
        to: ["kgroupmed@gmail.com"],
        subject: `🚀 Nuevo Lead: ${nombre} (${empresa || "Particular"})`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #6C4FF6; margin-top: 0;">Nuevo mensaje desde KGroup Landing</h2>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p><strong>👤 Nombre:</strong> ${nombre || "—"}</p>
              <p><strong>🏢 Empresa:</strong> ${empresa || "Sin especificar"}</p>
              <p><strong>✉️ Correo:</strong> <a href="mailto:${email}">${email || "—"}</a></p>
              <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${(telefono || "").replace(/\D/g, "")}">${telefono || "—"}</a></p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
                <strong style="display: block; margin-bottom: 8px;">💬 Mensaje / Detalles del Proyecto:</strong>
                <p style="margin: 0; white-space: pre-wrap;">${mensaje || "Sin mensaje adicional"}</p>
              </div>
            </div>
          `,
      }),
    });

    const resendJson = await resendRes.json();
    if (resendRes.ok) {
      return new Response(JSON.stringify({ ok: true, id: resendJson.id }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({
          ok: false,
          error: resendJson.message || "Error en Resend",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}) satisfies APIRoute;
