
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function LocationButton({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Locating...",
      description: "Finding your current location",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          const location = data.city || data.locality || "your location";
          const message = `What airport lounges are available near ${location} (coordinates: ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})?`;
          
          onSendMessage(message);
          
          toast({
            title: "Location found!",
            description: `Searching for lounges near ${location}`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not determine your location name",
            variant: "destructive",
          });
        }
      },
      (error) => {
        toast({
          title: "Error",
          description: "Could not get your location: " + error.message,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Button
      onClick={getLocation}
      variant="outline"
      size="sm"
      className="gap-2 animate-fade-in"
    >
      <MapPin size={16} />
      Find nearby lounges
    </Button>
  );
}
