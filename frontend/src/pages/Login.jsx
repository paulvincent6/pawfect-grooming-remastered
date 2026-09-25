import { Link } from "react-router-dom";

function Login() {
  return (
    <main>
      <h1>Login</h1>

      <form>
        <div>
          <label>Email</label>
          <br />
          <input type="email" placeholder="Enter your email" />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input type="password" placeholder="Enter your password" />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}

export default Login;