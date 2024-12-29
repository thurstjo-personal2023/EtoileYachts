// Singleton to manage Google Maps script loading
let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  // Early return if already loaded
  if (isLoaded && (window as any).google?.maps?.places) {
    console.log("[Maps] Already loaded with Places API");
    return Promise.resolve();
  }

  // Handle concurrent loading requests
  if (isLoading) {
    console.log("[Maps] Script currently loading, waiting...");
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isLoaded && (window as any).google?.maps?.places) {
          console.log("[Maps] Concurrent load complete");
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
    });
  }

  console.log("[Maps] Starting script load");
  console.log("[Maps] API Key present:", !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';

      // Ensure API key is available
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error('Google Maps API key not found in environment variables');
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("[Maps] Script loaded, checking Places API");
        if ((window as any).google?.maps?.places) {
          console.log("[Maps] Places API initialized successfully");
          isLoaded = true;
          isLoading = false;
          resolve();
        } else {
          const error = new Error('Places API not initialized properly');
          console.error("[Maps] Places API initialization failed:", error);
          reject(error);
        }
      };

      script.onerror = (error) => {
        console.error("[Maps] Script failed to load:", error);
        isLoading = false;
        reject(new Error('Google Maps script failed to load'));
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("[Maps] Error during script setup:", error);
      isLoading = false;
      reject(error);
    }
  });
}