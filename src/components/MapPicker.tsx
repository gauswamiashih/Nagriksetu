import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Banaskantha district center coordinates
const BANASKANTHA_CENTER = {
  lat: 24.1760,
  lng: 72.4380,
};

export function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [position, setPosition] = useState({
    lat: initialLat || BANASKANTHA_CENTER.lat,
    lng: initialLng || BANASKANTHA_CENTER.lng,
  });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate reverse geocoding (in production, use Google Maps Geocoding API)
  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    // Simulated address based on coordinates
    await new Promise(resolve => setTimeout(resolve, 300));
    const simulatedAddress = `Location near ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E, Banaskantha, Gujarat`;
    setAddress(simulatedAddress);
    setIsLoading(false);
    return simulatedAddress;
  }, []);

  useEffect(() => {
    getAddressFromCoords(position.lat, position.lng);
  }, [position.lat, position.lng, getAddressFromCoords]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPos);
          const addr = await getAddressFromCoords(newPos.lat, newPos.lng);
          onLocationSelect(newPos.lat, newPos.lng, addr);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleMapClick = (offsetX: number, offsetY: number, width: number, height: number) => {
    // Convert click position to approximate coordinates
    // This is a simplified version - in production, use proper map projection
    const latRange = 0.1; // ~11km
    const lngRange = 0.15; // ~15km
    
    const newLat = BANASKANTHA_CENTER.lat + ((height / 2 - offsetY) / height) * latRange * 2;
    const newLng = BANASKANTHA_CENTER.lng + ((offsetX - width / 2) / width) * lngRange * 2;
    
    setPosition({ lat: newLat, lng: newLng });
  };

  const confirmLocation = async () => {
    const addr = await getAddressFromCoords(position.lat, position.lng);
    onLocationSelect(position.lat, position.lng, addr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Select Location</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4 mr-2" />
          )}
          Use My Location
        </Button>
      </div>
      
      {/* Map Container - Interactive placeholder */}
      <div
        className="relative w-full h-64 bg-muted rounded-lg overflow-hidden cursor-crosshair border-2 border-dashed border-border"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleMapClick(
            e.clientX - rect.left,
            e.clientY - rect.top,
            rect.width,
            rect.height
          );
        }}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indian-green/10 via-background to-primary/10" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        
        {/* District Label */}
        <div className="absolute top-4 left-4 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-md text-xs font-medium">
          Banaskantha District, Gujarat
        </div>
        
        {/* Pin Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <div className="relative">
            <MapPin className="h-10 w-10 text-primary drop-shadow-lg" fill="hsl(var(--primary))" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
          </div>
        </div>
        
        {/* Click Hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-muted-foreground">
          Click on the map to adjust pin location
        </div>
      </div>

      {/* Coordinates & Address */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">Selected Location:</span>
        </div>
        <p className="text-sm text-muted-foreground">{address || 'Loading address...'}</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Lat: {position.lat.toFixed(6)}</span>
          <span>Lng: {position.lng.toFixed(6)}</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={confirmLocation}
        className="w-full"
        disabled={isLoading}
      >
        <MapPin className="h-4 w-4 mr-2" />
        Confirm This Location
      </Button>
    </div>
  );
}
