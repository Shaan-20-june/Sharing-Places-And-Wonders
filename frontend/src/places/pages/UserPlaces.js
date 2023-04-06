import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Import all Components here
import PlaceList from "../components/PlaceList";
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

// Import all custom hooks here
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState();

  const { isLoading, sendRequest } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {
        setLoadedPlaces([]);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </Fragment>
  );
};

export default UserPlaces;
