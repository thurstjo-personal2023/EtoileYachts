// Singleton to manage Google Maps script loading
let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  if (isLoaded) {
    console.log("Google Maps already loaded");
    return Promise.resolve();
  }

  if (isLoading) {
    console.log("Google Maps script is currently loading");
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
    });
  }

  console.log("Starting Google Maps script load");
  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap&v=weekly`;
      script.async = true;
      script.defer = true;

      // Define the callback
      (window as any).initMap = () => {
        console.log("Google Maps initialized successfully");
        isLoaded = true;
        isLoading = false;
        resolve();
      };

      // Handle errors
      script.onerror = (error) => {
        console.error("Google Maps script failed to load:", error);
        isLoading = false;
        reject(new Error('Google Maps script failed to load'));
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error loading Google Maps script:", error);
      isLoading = false;
      reject(error);
    }
  });
}