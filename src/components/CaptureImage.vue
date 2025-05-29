<template>
  <div class="p-4">
    <video ref="video" autoplay playsinline class="w-full aspect-[2/2] object-cover border rounded-lg transform scale-x-[-1]"></video>

    <div class="mt-4 flex gap-4">
      <button @click="startCamera" class="px-4 py-2 bg-blue-600 text-white rounded">
        Start Camera
      </button>
      <button @click="captureImage" class="px-4 py-2 bg-green-600 text-white rounded" :disabled="!stream">
        Capture Image
      </button>
    </div>

    <canvas ref="canvas" class="mt-4 border hidden"></canvas>

    <img v-if="capturedImage" :src="capturedImage" alt="Captured" class="mt-4  border" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      stream: null,
      capturedImage: null,
    };
  },
  methods: {
    async startCamera() {
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        alert("Camera access requires HTTPS on real devices.");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported in this browser.");
        return;
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        const video = this.$refs.video;
        video.srcObject = this.stream;
        await video.play();
      } catch (err) {
        console.error("Camera error:", err);
        alert("Could not access the camera. Please check permissions.");
      }
    },

    captureImage() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

        // Mirror canvas
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.capturedImage = canvas.toDataURL("image/jpeg", 1.0); // high quality
    },
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  },
};
</script>

<!-- <style scoped>
video {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4; /* 👈 Portrait aspect ratio */
  object-fit: cover;
  border-radius: 0.5rem;
}
</style> -->
