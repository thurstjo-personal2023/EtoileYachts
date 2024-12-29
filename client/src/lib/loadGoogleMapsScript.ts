// Singleton to manage Google Maps script loading
let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  if (isLoaded) return Promise.resolve();
  if (isLoading) {
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
    });
  }

  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Define the callback
      (window as any).initMap = () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      };

      // Handle errors
      script.onerror = () => {
        isLoading = false;
        reject(new Error('Google Maps script failed to load'));
      };

      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      reject(error);
    }
  });
}
