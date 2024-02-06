import React from "react";
import "./App.css";
import TotalMeteorites from "./components/TotalMeteorites/TotalMeteorites";
import AverageMass from "./components/AverageMass/AverageMass";
import MeteoritesMap from "./components/MeteoritesMap/MeteoritesMap";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meteorite Dashboard</h1>
      </header>
      <main>
        <div className="map-container">
          <div className="card-container">
            <div className="card">
              <TotalMeteorites />
            </div>
            <div className="card">
              <AverageMass />
            </div>
          </div>
          <MeteoritesMap />
        </div>
      </main>
      <footer>Data from NASA Public Data | Dashboard by Austin Allen</footer>
    </div>
  );
}

export default App;
