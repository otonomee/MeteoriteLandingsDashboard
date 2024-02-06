import React, { useEffect, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

function AverageMass() {
  const [averageMass, setAverageMass] = useState(null);

  useEffect(() => {
    axios
      .get("/average_mass")
      .then((response) => {
        setAverageMass(response.data.average_mass);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const massInKg = averageMass * 0.001;
  const massInLbs = averageMass * 0.00220462;

  return (
    <div className="AverageMass">
      <h2>Average Mass of Meteorites</h2>
      {averageMass !== null ? (
        <div>
          <p>
            {d3.format(".2f")(massInKg)} kg/{d3.format(".2f")(massInLbs)} lbs
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AverageMass;
