import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "90vh",
  marginLeft: "30px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

// Define libraries outside of the component
const libraries = ["places"];

function GoogleMapView() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIza********************cfquo1o8",
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState(center);
  const inputRef = useRef(null);
  const inputRef1 = useRef(null);
  // const [placeId, setPlaceId] = useState("");
  const [address, setAddress] = useState([]);
  const [searchedPlaces, setSearchedPlaces] = useState([]);
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        console.log(place.address_components);
        setAddress(place.address_components);
        // setPlaceId(place);
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMarkerPosition({ lat, lng });
        }
      });
    }
  }, [isLoaded]);

  //Custom Search withOut using any package

  function getAutoCompleteData(searchValue) {
    console.log(searchValue);
    if (searchValue !== "") {
      let config = {
        input: searchValue,
      };
      const googleService = new window.google.maps.places.AutocompleteService();
      googleService.getPlacePredictions(config, (predictions) => {
        if (predictions) {
          setSearchedPlaces(predictions);
        }
      });
    }
    if (searchValue === "") {
      setSearchedPlaces([]);
    }
  }
  console.log(searchedPlaces);

  return (
    <div style={{ padding: "20px", display: "flex" }}>
      <div style={{ textAlign: "center" }}>
        {/* Custom Search */}
        <div>
          <input
            ref={inputRef1}
            onChange={(e) => getAutoCompleteData(e.target.value)}
          />
          <div>
            {searchedPlaces.length > 0
              ? searchedPlaces.map((curr, ind) => {
                  return (
                    <>
                      <div>
                        {ind % 2 === 0 ? (
                          <button
                            value={curr.description}
                            style={{
                              border: "none",
                              backgroundColor: "aqua",
                              height: "30px",
                              width: "300px",
                            }}
                          >
                            <img src="../../pin.png" width="20px" />
                            {curr.description.length > 35
                              ? curr.description.slice(0, 35) + "....."
                              : curr.description}
                          </button>
                        ) : (
                          <button
                            value={curr.description}
                            style={{
                              border: "none",
                              backgroundColor: "none",
                              height: "30px",
                              width: "300px",
                            }}
                          >
                            <img src="../../pin.png" width="20px" />
                            {curr.description.length > 35
                              ? curr.description.slice(0, 35) + "....."
                              : curr.description}
                          </button>
                        )}
                      </div>
                    </>
                  );
                })
              : ""}
          </div>
        </div>

        <h1>Address Search</h1>

        <div>
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for a location"
            style={{
              height: "50px",
              width: "500px",
              boxShadow: "rgb(25 158 211) 0px 20px 30px -10px",
              marginBottom: "20px",
              fontSize: "20px",
            }}
          />
        </div>
        {address.map((curr, ind) => {
          return (
            <>
              <div key={ind}>
                <input
                  type="text"
                  placeholder="City Name"
                  value={curr.long_name}
                  readOnly
                  style={{
                    height: "50px",
                    width: "500px",
                    boxShadow: "rgb(181 51 203) 0px 20px 30px -10px",
                    marginBottom: "20px",
                    fontSize: "20px",
                  }}
                />
              </div>
            </>
          );
        })}
      </div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={10}
        >
          <MarkerF position={markerPosition} />
        </GoogleMap>
      )}
    </div>
  );
}

export default GoogleMapView;
