import React, { useEffect, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

function TotalMeteorites() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    axios
      .get("/total_meteorites")
      .then((response) => {
        setTotal(response.data.total);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  return (
    <div className="TotalMeteorites">
      <h2>Total Meteorites</h2>
      {total !== null ? <p>{d3.format(",")(total)}</p> : <p>Loading...</p>}
    </div>
  );
}

export default TotalMeteorites;
