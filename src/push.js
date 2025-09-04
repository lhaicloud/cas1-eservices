// push.js
const VAPID_PUBLIC_KEY = "BPV_cvT2ycCqvLpTRz7xGLrAYl4MmsJUQfUVPlA5F8vDt6Tr_oRp7HUE4w36VB3qDGCmbGpWglSQ4TGk55le0_o"; // Replace with your server's public key

export async function subscribeUserToPush() {
    if (!("serviceWorker" in navigator)) return;


    const reg = await navigator.serviceWorker.ready;


    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
    }


    // Replace with your own VAPID public key
    const vapidPublicKey = VAPID_PUBLIC_KEY.trim();
    console.log(vapidPublicKey)
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);


    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
    });

    let deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
        deviceId = crypto.randomUUID(); // Generate a new ID
        localStorage.setItem("device_id", deviceId);
    }

    // Send subscription to backend to save

    // may bug pa dgd
    await fetch(`${import.meta.env.VITE_WS_API_URL }/subscribe`, {
        method: "POST",
        body: JSON.stringify({ userId: deviceId, subscription }),
        headers: {
        "Content-Type": "application/json",
        },
    });


    return true;
}



function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);  // <-- throws InvalidCharacterError if base64 is invalid
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
