import React from "react";

// Import all Components here
import UsersList from "../components/UsersList";

// Import all CSS files here

const Users = (props) => {
  const USERS = [
    {
      id: "u1",
      name: "Santanu Dutta",
      image: "//cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
      places: 5,
    },
    // {
    //   id: "u2",
    //   name: "Banashree Dutta",
    //   image:
    //     "https://commons.wikimedia.org/wiki/Commons:Wiki_Loves_Folklore_2023#/media/File:%E0%B2%95%E0%B2%BF%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%BF%E0%B2%A6%E0%B2%BE%E0%B2%B0%E0%B3%81.JPG",
    //   places: 5,
    // },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
