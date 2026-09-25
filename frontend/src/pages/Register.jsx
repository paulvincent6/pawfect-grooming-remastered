import { Link } from "react-router-dom";

function Register() {
  return (
    <main>
      <h1>Create Account</h1>

      <form>
        <div>
          <label>Full Name</label>
          <br />
          <input type="text" placeholder="Enter your full name" />
        </div>

        <div>
          <label>Email</label>
          <br />
          <input type="email" placeholder="Enter your email" />
        </div>

        <div>
          <label>Phone Number</label>
          <br />
          <input type="tel" placeholder="Enter your phone number" />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input type="password" placeholder="Create a password" />
        </div>

        <div>
          <label>Confirm Password</label>
          <br />
          <input type="password" placeholder="Confirm your password" />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default Register;