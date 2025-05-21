import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true;
};

const useCurrentLocation = () => {
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const fetchLocation = async () => {
    const hasPermission = Platform.OS === 'ios' || await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Location permission not granted");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => setLocation(position),
      (error) => {
        console.error("Location error:", error);
        Alert.alert("Could not get location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  useEffect(() => {
    fetchLocation(); // initial fetch

    const timer = setTimeout(() => {
      fetchLocation(); // re-fetch after 1 hour
    }, 3600000); // 1 hour = 3600000 ms

    return () => clearTimeout(timer); // cleanup if user leaves the screen
  }, []);

  return location;
};

export default useCurrentLocation;
