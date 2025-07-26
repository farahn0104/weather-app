import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

const Header = ({ onSearch }) => { // Reciever onSearch funcion in Props
  const [city, setCity] = useState("");

  const handlerEvent = (e) => {
    e.preventDefault();
    if (city.trim()) onSearch(city); // Send city to the App.jsx component
  }

  // Current Location Button
 const handleCurrentLocation = () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        // Correct format for API call
        onSearch({ lat: latitude, lon: longitude });
      },
      (error) => alert('Location access denied',error.message)
    );
  }
};

  
  return (
    <div>
      <form onSubmit={handlerEvent}>
        <nav className="navbar">
          <input
            id="searchBar"
            value={city}
            type="search"
            placeholder="Search for a city..."
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" id="searchBtn">
            Search
          </button>
          <button onClick={handleCurrentLocation} id="currentBtn">
            <IoLocationOutline className="locationIcon" />
            Current
          </button>
        </nav>
      </form>
    </div>
  );
};

export default Header;
