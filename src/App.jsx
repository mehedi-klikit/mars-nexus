import './App.css'
import EarthGlobe from "./EarthGlobe.jsx";
import Asteroid from "../../mars-nexus/public/images/asteroid.png";


function App() {

    return (
        <>
            <img src={Asteroid} style={{height: "100px"}}/>
            <EarthGlobe/>
        </>
    )
}

export default App
