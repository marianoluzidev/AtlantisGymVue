const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

exports.enviarPushNotificacion = onDocumentCreated("notificaciones/{id}", async (event) => {
  console.log("📥 Evento recibido:", JSON.stringify(event));

  const noti = event.data?.data();
  if (!noti) {
    console.log("⚠️ No se encontraron datos en la notificación.");
    return;
  }

  console.log("🔎 Datos de noti recibidos:", JSON.stringify(noti, null, 2));

  // Validar que los campos necesarios estén presentes
  if (!noti.paraUid || !noti.titulo || !noti.mensaje) {
    console.log("⛔️ Noti incompleta, no se envía push:", JSON.stringify(noti, null, 2));
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
    notification: {
      title: noti.titulo || 'Notificación',
      body: noti.mensaje || ''
    },
    data: {
      click_action: 'https://atlantisgym.web.app/' // o alguna ruta más específica
    },
    token
  };

  try {
    await getMessaging().send(payload);
    console.log("📲 Push enviada a", noti.paraUid);
  } catch (error) {
    console.error("❌ Error enviando push:", error);
  }
});
