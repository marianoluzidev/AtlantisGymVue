// ---- Firebase Admin / Functions v2 (tu código) ----
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

// HTTPS v2 + secrets
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// ---- Nuevos imports para API HTTP + MP v2 ----
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// Inicializa Admin SDK
initializeApp();

/* ===================== NOTIFICACIONES PUSH ===================== */
exports.enviarPushNotificacion = onDocumentCreated("notificaciones/{id}", async (event) => {
  console.log("📥 Evento recibido - ID:", event.id);
  const noti = event.data?.data();
  if (!noti) return;

  if (!noti.paraUid || !noti.titulo || !noti.mensaje) {
    console.log("⛔️ Noti incompleta:", JSON.stringify(noti));
    return;
  }

  const db = getFirestore();
  const userDoc = await db.collection("usuario").doc(noti.paraUid).get();
  const token = userDoc.data()?.fcmToken;

  if (!token) {
    console.log("⚠️ Token FCM no disponible para UID:", noti.paraUid);
    return;
  }

  const payload = {
    notification: { title: noti.titulo || "Notificación", body: noti.mensaje || "" },
    data: { click_action: "https://atlantisgym.web.app/" },
    token
  };

  try {
    await getMessaging().send(payload);
    console.log("📲 Push enviada a", noti.paraUid);
  } catch (error) {
    console.error("❌ Error enviando push:", error);
  }
});

/* ===================== MERCADO PAGO (SDK nuevo) ===================== */

// Secret seguro (Functions v2)
const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

// Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Crear preferencia (Checkout Pro)
app.post("/create-preference", async (req, res) => {
  try {
    // Instancia de cliente MP v2 con secret
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
    const preference = new Preference(client);

    const {
      title = "Cuota mensual Atlantis Gym",
      unit_price = 100,
      quantity = 1,
      payerEmail,
      metadata = {}
    } = req.body || {};

    const body = {
      items: [{ title, quantity: Number(quantity), unit_price: Number(unit_price) }],
      payer: payerEmail ? { email: payerEmail } : undefined,
      metadata,
      auto_return: "approved",
      back_urls: {
        success: "https://atlantisgymvue.web.app/pago-exitoso",
        failure: "https://atlantisgymvue.web.app/pago-fallido",
        pending: "https://atlantisgymvue.web.app/pago-pendiente"
      },
      binary_mode: true
    };

    const result = await preference.create({ body });

    // En el SDK nuevo, el id viene en result.id
    if (!result?.id) {
      console.error("MP: respuesta sin id:", result);
      return res.status(500).json({ error: "No se obtuvo ID de preferencia" });
    }

    return res.json({ id: result.id });
  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    return res.status(500).json({ error: "Error al crear preferencia" });
  }
});

// Export de la API HTTP con el secret adjunto
exports.mercadoPagoApi = onRequest(
  { region: "us-central1", secrets: [MP_ACCESS_TOKEN] },
  app
);
