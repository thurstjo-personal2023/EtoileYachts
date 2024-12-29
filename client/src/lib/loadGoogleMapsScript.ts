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

        // Get API key and validate
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error("Missing VITE_GOOGLE_MAPS_API_KEY environment variable");
        }

        // Handle concurrent loading
        if (isLoading) {
          console.log("[Maps] Script already loading, waiting...");
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

        // Create script with direct loading
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;

        // Handle successful load
        script.addEventListener('load', () => {
          // Verify initialization
          if ((window as any).google?.maps?.places) {
            console.log("[Maps] Successfully loaded and verified Places API");
            isLoaded = true;
            isLoading = false;
            resolve();
          } else {
            const error = new Error("Google Maps Places API failed to initialize");
            console.error("[Maps] Initialization failed:", error);
            isLoading = false;
            reject(error);
          }
        });

        // Handle load errors
        script.addEventListener('error', async (error) => {
          console.error("[Maps] Script load error:", error);
          isLoading = false;
          script.remove(); // Clean up failed script

          if (loadAttempts < MAX_RETRIES) {
            console.log(`[Maps] Retrying in ${loadAttempts} seconds...`);
            await new Promise(resolve => setTimeout(resolve, loadAttempts * 1000));
            attemptLoad();
          } else {
            reject(new Error(`Failed to load Google Maps after ${MAX_RETRIES} attempts`));
          }
        });

        // Append script to document
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