import { db } from "./firebase";
import { ref, set } from "firebase/database";
import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [page, setPage] = useState("login");
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [history, setHistory] = useState([]);
  const [tapCount, setTapCount] = useState(0);
  const [isCalling, setIsCalling] = useState(false);

  // ✅ Editable Contacts
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("contacts");
    return saved ? JSON.parse(saved) : ["919770318785"];
  });

  // ✅ Save contacts
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const [safeLocations, setSafeLocations] = useState([
    { lat: 26.2152, lon: 78.2141 },
    { lat: 26.2299, lon: 78.2056 }
  ]);

  const MAX_DISTANCE = 0.5;

  // ✅ Cooldown
  const [lastAlertTime, setLastAlertTime] = useState(0);

  // 🔊 Sound + Voice
  const playAlertSound = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
    audio.play();
  };

  const speakStatus = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // 🔐 Login
  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setPage("login");
  };

  // 📍 Distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🚨 ALERT FUNCTION
  const sendAlert = (lat, lon) => {
    const now = Date.now();

    if (now - lastAlertTime < 60000) return; // 1 min cooldown
    setLastAlertTime(now);

    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `🚨 EMERGENCY! I am in danger. My Location: ${mapUrl}`;

    contacts.forEach((number, index) => {
      if (!number) return;

      setTimeout(() => {
        if (navigator.onLine) {
          window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
        } else {
          window.open(`sms:${number}?body=${encodeURIComponent(message)}`);
        }
      }, index * 1500);
    });

    // 📞 Call first contact
    setTimeout(() => {
      if (contacts[0]) window.open(`tel:${contacts[0]}`);
    }, 2000);

    navigator.vibrate && navigator.vibrate([500, 200, 500]);
    playAlertSound();
    speakStatus("Emergency Alert Triggered");
  };

  // 🔥 Triple Tap
  const handleTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 2000);
  };

  useEffect(() => {
    if (tapCount === 3 && coords) {
      sendAlert(coords.lat, coords.lon);
      setTapCount(0);
    }
  }, [tapCount, coords]);

  // 📡 Tracking
  useEffect(() => {
    if (!isLoggedIn) return;

    const watchId = navigator.geolocation.watchPosition(
  (pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;
    setCoords({ lat, lon });

    // ✅ FIREBASE LOCATION SEND (ADD THIS)
    set(ref(db, "users/user123"), {
      lat,
      lon,
      time: Date.now()
    });

    const isSafe = safeLocations.some(
      loc => getDistance(lat, lon, loc.lat, loc.lon) <= MAX_DISTANCE
    );
        const currentStatus = isSafe ? "SAFE ✅" : "DANGER 🚨";

        if (status !== currentStatus) {
          setStatus(currentStatus);
          speakStatus(`You are now ${currentStatus}`);
          setHistory(prev => [
            { time: new Date().toLocaleTimeString(), status: currentStatus },
            ...prev.slice(0, 5)
          ]);
        }

        if (!isSafe) {
          sendAlert(lat, lon);
        }
      },
      () => setStatus("Location Access Denied"),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoggedIn, safeLocations, status]);

  // 🔐 Auth UI
  if (!isLoggedIn) {
    return page === "login"
      ? <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />
      : <Register goToLogin={() => setPage("login")} />;
  }

  return (
    <div style={styles.container} onClick={handleTap}>

      {/* Fake Call */}
      {isCalling && (
        <div style={styles.callOverlay}>
          <div style={styles.callInfo}>
            <div style={styles.avatar}>M</div>
            <h2>Mom Calling...</h2>
          </div>
          <button onClick={() => setIsCalling(false)}>End Call</button>
        </div>
      )}

      <h1>🚨 Women Safety</h1>

      <div style={{
        ...styles.statusCard,
        background: status.includes("SAFE") ? "green" : "red"
      }}>
        {status}
      </div>

      {/* SOS BUTTON */}
      <button
        style={styles.sosBtn}
        onClick={() => coords && sendAlert(coords.lat, coords.lon)}
        onContextMenu={(e) => {
          e.preventDefault();
          coords && sendAlert(coords.lat, coords.lon);
        }}
      >
        SOS
      </button>

      <div style={styles.actionGrid}>
        <button onClick={() => {
          if (coords) {
            setSafeLocations([...safeLocations, coords]);
            alert("Safe Zone Saved!");
          }
        }}>
          📍 Set Safe Zone
        </button>

        <button onClick={() => setIsCalling(true)}>
          📞 Fake Call
        </button>
      </div>

      {/* ✅ CONTACT EDITOR */}
      <div style={{ marginTop: 20 }}>
        <h3>📞 Emergency Contacts</h3>

        {contacts.map((contact, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <input
              type="text"
              value={contact}
              onChange={(e) => {
                const updated = [...contacts];
                updated[index] = e.target.value;
                setContacts(updated);
              }}
              style={{ padding: 5, marginRight: 5 }}
            />

            <button onClick={() => {
              const updated = contacts.filter((_, i) => i !== index);
              setContacts(updated);
            }}>
              ❌
            </button>
          </div>
        ))}

        <button onClick={() => setContacts([...contacts, ""])}>
          ➕ Add Contact
        </button>
      </div>

      {coords && (
        <iframe
          title="map"
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lon}&z=15&output=embed`}
          width="100%"
          height="200"
        />
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

const styles = {
  container: { padding: 20, textAlign: "center", background: "#0f172a", color: "#fff" },
  statusCard: { padding: 10, margin: 10, borderRadius: 10 },
  sosBtn: { fontSize: 30, padding: 40, borderRadius: "50%", background: "red", color: "#fff" },
  actionGrid: { display: "flex", gap: 10, justifyContent: "center" },

  callOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#000", color: "#fff" },
  avatar: { fontSize: 40 }
};

export default App;