import { useState } from "react";

function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("email");
    const savedPass = localStorage.getItem("password");

    if (email === savedEmail && password === savedPass) {
      onLogin();
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome Back 👋</h2>

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

        <button onClick={handleLogin} style={styles.btn}>
          Login
        </button>

        <p onClick={goToRegister} style={styles.link}>
          Create Account
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
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
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px"
  },
  link: {
    marginTop: "10px",
    color: "#667eea",
    cursor: "pointer"
  }
};

export default Login;