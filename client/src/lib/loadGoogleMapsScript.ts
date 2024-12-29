// Singleton to manage Google Maps script loading
let isLoading = false;
let isLoaded = false;
let loadAttempts = 0;
const MAX_RETRIES = 3;

export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const attemptLoad = async () => {
      try {
        // Check if already loaded
        if (isLoaded && (window as any).google?.maps?.places) {
          console.log("[Maps] Already loaded and initialized");
          return resolve();
        }

        // Get API key
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log("[Maps] API Key status:", apiKey ? "Present" : "Missing");

        if (!apiKey) {
          throw new Error("Google Maps API key not found in VITE_GOOGLE_MAPS_API_KEY");
        }

        // Handle concurrent loading
        if (isLoading) {
          console.log("[Maps] Script already loading, waiting for completion");
          const checkInterval = setInterval(() => {
            if (isLoaded && (window as any).google?.maps?.places) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          return;
        }

        loadAttempts++;
        isLoading = true;
        console.log(`[Maps] Loading attempt ${loadAttempts} of ${MAX_RETRIES}`);

        // Create and append script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;

        // Define callback
        (window as any).initMap = () => {
          console.log("[Maps] InitMap callback triggered");
          if ((window as any).google?.maps?.places) {
            console.log("[Maps] Places API successfully initialized");
            isLoaded = true;
            isLoading = false;
            resolve();
          } else {
            const error = new Error("Places API failed to initialize in callback");
            console.error("[Maps]", error);
            isLoading = false;
            reject(error);
          }
        };

        script.onerror = async (error) => {
          console.error("[Maps] Script load error:", error);
          isLoading = false;

          if (loadAttempts < MAX_RETRIES) {
            console.log(`[Maps] Retrying... (${loadAttempts}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * loadAttempts));
            attemptLoad();
          } else {
            reject(new Error(`Failed to load Google Maps after ${MAX_RETRIES} attempts`));
          }
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("[Maps] Setup error:", error);
        isLoading = false;
        reject(error);
      }
    };

    attemptLoad();
  });
}