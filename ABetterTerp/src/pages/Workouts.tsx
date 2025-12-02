import { Link } from 'react-router'
import './Home.css'

export default function Workouts() {
  return (
    <div className="home-container home-root">
      <div className="home-card">
        <h1 className="home-heading">Workouts</h1>
        <p style={{ marginTop: '1rem' }}>Log and track your workouts here. (Placeholder page)</p>
        <p style={{ marginTop: '1rem' }}><Link to="/home">Back</Link></p>
      </div>
    </div>
  )
}
