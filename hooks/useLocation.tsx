import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

const useLocation = () => {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hasLocation, setHasLocation] = useState(false);
  const [initialLocation, setInitialLocation] =
    useState<Location.LocationObject>();

  const watchPosition = useRef<Location.LocationSubscription>();

  useEffect(() => {
    getCurrentPosition()
      .then((location) => {
        setCurrentLocation(location);
        setInitialLocation(location);
        setHasLocation(!!location);
      })
      .catch((error: Error) => {
        setErrorMsg(error?.message);
        setHasLocation(false);
      });
  }, []);

  const getCurrentPosition = async (): Promise<Location.LocationObject> => {
    let { status } = await Location.requestForegroundPermissionsAsync(); // TODO: SACAR LOS PERMISOS DE AQUI!!
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    return await Location.getCurrentPositionAsync({});
  };

  const followUserLocation = async () => {
    watchPosition.current = await Location.watchPositionAsync(
      { distanceInterval: 15 },
      (location) => {
        console.log("watch", location);
        setCurrentLocation(location);
      }
    );
  };

  const stopFollowUserLocation = () => {
    if (watchPosition.current) {
      watchPosition.current.remove();
    }
  };

  return {
    currentLocation,
    errorMsg,
    hasLocation,
    followUserLocation,
    stopFollowUserLocation,
    getCurrentPosition,
    initialLocation,
  };
};

export default useLocation;
