import { useState } from "react";

function Register({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    alert("Registered!");
    goToLogin();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account ✨</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleRegister} style={styles.btn}>
          Register
        </button>

        <p onClick={goToLogin} style={styles.link}>
          Already have account?
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "300px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#ff758c",
    color: "#fff",
    border: "none",
    borderRadius: "8px"
  },
  link: {
    marginTop: "10px",
    color: "#ff758c",
    cursor: "pointer"
  }
};

export default Register;