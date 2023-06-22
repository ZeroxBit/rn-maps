import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import useLocation from "./hooks/useLocation";
import MapViewDirections from "react-native-maps-directions";
import { Fab } from "./Fab";
import GooglePlacesInput from "./GooglePlacesInput";

const GOOGLE_MAPS_APIKEY = "GOOGLE_MAPS_APIKEY";

export default function App() {
  const { hasLocation, currentLocation, followUserLocation, stopFollowUserLocation, getCurrentPosition } = useLocation();
  const [origin, setOrigin] = useState<any>(currentLocation?.coords);
  const [destiny, setDestiny] = useState<any>({
    latitude: -12.0961623,
    longitude: -77.005488,
  });

  const mapViewRef = useRef<MapView>();
  const following = useRef<boolean>(true);

  useEffect(() => {
    // followUserLocation();
    return () => {
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    stopFollowUserLocation();

    if (currentLocation?.coords && following.current) {
      handleCenterPosition(false);
    }
  }, [currentLocation]);

  const handleCenterPosition = async (setFollowing = true) => {
    if (setFollowing) {
      following.current = true;
    }

    const { coords } = await getCurrentPosition();

    mapViewRef.current?.animateCamera({
      center: {
        ...coords,
      },
    });
  };

  if (!hasLocation || !currentLocation) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(currentLocation)}</Text>
      <StatusBar style="auto" />
      <GooglePlacesInput />
      <MapView
        ref={(el) => (mapViewRef.current = el!)}
        style={{ width: "90%", height: 400 }}
        showsUserLocation
        initialRegion={{
          latitude: -11.9250007,
          longitude: -77.06079869999999,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => (following.current = false)}
      >
        <Marker
          draggable
          image={require("./assets/prueba.png")}
          coordinate={{
            latitude: currentLocation!.coords.latitude,
            longitude: currentLocation!.coords.longitude,
          }}
          title={"Mi titulo"}
          description={"marker.description"}
          style={styles.marker}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />
        <Marker
          draggable
          coordinate={{
            latitude: destiny.latitude || currentLocation!.coords.latitude,
            longitude: destiny.longitude || currentLocation!.coords.longitude,
          }}
          title={"Mi titulo"}
          description={"marker.description"}
          style={styles.marker}
          onDragEnd={(direction) => {
            console.log("onDragEnd", direction.nativeEvent.coordinate);
            setDestiny(direction.nativeEvent.coordinate);
          }}
        />

        <MapViewDirections
          origin={{
            latitude: currentLocation!.coords.latitude,
            longitude: currentLocation!.coords.longitude,
          }}
          destination={{
            latitude: destiny.latitude || currentLocation!.coords.latitude,
            longitude: destiny.longitude || currentLocation!.coords.longitude,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="red"
        />
      </MapView>

      {/* Boton para centar la camara en el objetivo */}
      <Fab
        iconName="compass-outline"
        onPress={handleCenterPosition}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 500,
    width: "100%",
  },
  marker: {
    ...StyleSheet.absoluteFillObject,
    width: 10,
    height: 10,
  },
});
