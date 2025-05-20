// useLiveLocation.ts
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  }
  return true; // iOS permission is handled in Info.plist
};

const useLiveLocation = () => {
  const [location, setLocation] = useState<GeoPosition | null>(null);

  useEffect(() => {
    let watchId: number;

    const startTracking = async () => {
      const granted = Platform.OS === 'ios' || await requestLocationPermission();

      if (!granted) {
        Alert.alert("Location permission not granted");
        return;
      }

      watchId = Geolocation.watchPosition(
        (position) => {
          setLocation(prev => {
            // Update only if location has changed
            if (
              prev?.coords.latitude !== position.coords.latitude ||
              prev?.coords.longitude !== position.coords.longitude
            ) {
              return position;
            }
            return prev;
          });
        },
        (error) => {
          console.error("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
        }
      );
    };

    startTracking();

    return () => {
      if (watchId !== undefined) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return location;
};

export default useLiveLocation;