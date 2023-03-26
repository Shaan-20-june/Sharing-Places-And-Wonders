import React from "react";
import { useParams } from "react-router-dom";

// Import all Components here
import PlaceList from "../components/PlaceList";

// Import all CSS files here

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most beautiful sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Empire_State_Building_LED_live_election_results_Obama_Romney_Spire_Close-up_%288162616388%29.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire Central Building",
    description: "One of the most beautiful sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Empire_State_Building_LED_live_election_results_Obama_Romney_Spire_Close-up_%288162616388%29.jpg",
    address: "20 W 34th St., Jenkins, NY 85236, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u2",
  },
];

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
