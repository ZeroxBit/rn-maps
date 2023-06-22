import React, { useRef } from "react";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";

const GOOGLE_MAPS_APIKEY = "GOOGLE_MAPS_APIKEY";

const GooglePlacesInput = () => {
  const placesRef = useRef<GooglePlacesAutocompleteRef | null>();

  const getAddress = () => {
    console.log(placesRef.current?.setAddressText);
    // {setAddressText}: changes the value of the text input
    // {clear}: clears the text input
    // {isFocused}: returns true if the text input is focused, returns false if not.
    // {getCurrentLocation}: makes a query to find nearby places based on current location.
  };

  return (
    <GooglePlacesAutocomplete
      ref={(el) => (placesRef.current = el)}
      styles={{
        textInputContainer: {
          backgroundColor: "blue",
          width: "90%",
        },
      }}
      placeholder="Search"
      fetchDetails
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log("onPress", JSON.stringify(details));
        console.log("onPress data", JSON.stringify(data));
      }}
      onFail={(error) => console.log(error)}
      onNotFound={() => console.log("no results")}
      textInputProps={{
        autoFocus: true,
        blurOnSubmit: false,
      }}
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: "es",
        components: "country:pe",
      }}
    />
  );
};

export default GooglePlacesInput;
