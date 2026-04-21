import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

function TrackUser() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const userRef = ref(db, "users/user123");

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);
        const lastKey = keys[keys.length - 1];
        setLocation(data[lastKey]);
      }
    });
  }, []);

  return (
    <div>
      <h2>Live Tracking</h2>

      {location ? (
        <iframe
          title="map"
          src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
          width="100%"
          height="400"
        />
      ) : (
        <p>No location yet...</p>
      )}
    </div>
  );
}

export default TrackUser;