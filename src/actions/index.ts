import { defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { z } from "astro/zod";

export const server = {
  sendMail: defineAction({
    input: z.object({
      name: z.string().default("---"),
      email: z.email(),
      message: z.string().optional(),
    }),
    handler: async (input) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getSecret("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "KGroup Landing <onboarding@resend.dev>",
          to: ["kgroupmed@gmail.com"],
          subject: `🚀 Nuevo Lead: ${input.name} (${"KGROUP"})`,
          html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #6C4FF6; margin-top: 0;">Nuevo mensaje desde KGroup Landing</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>👤 Nombre:</strong> ${input.name}</p>
          <p><strong>🏢 Empresa:</strong> ${"KGROUP"}</p>
          <p><strong>✉️ Correo:</strong> <a href="mailto:${input.email}">${input.email}</a></p>
          <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${"3008667253".replace(/\D/g, "")}">${"3008667253"}</a></p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <strong style="display: block; margin-bottom: 8px;">💬 Mensaje / Detalles del Proyecto:</strong>
            <p style="margin: 0; white-space: pre-wrap;">${input.message ?? "Sin mensaje"}</p>
          </div>
        </div>
      `,
        }),
      });

      return await response.json();
    },
  }),
};
