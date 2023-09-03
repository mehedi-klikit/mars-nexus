import {useState, useEffect, useRef} from "react";
import Globe from "react-globe.gl";
import * as XLSX from 'xlsx/xlsx.mjs';

import {countries} from "./countries";

const initialState = "unloaded";

function EarthGlobe() {
    const [state, setState] = useState(initialState);
    const [places, setPlaces] = useState([]);
    const [arcs, setArcs] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch("/datasets/worldcities.xlsx");
            const arrayBuffer = await response.arrayBuffer();
            return {success: true, data: arrayBuffer};
        } catch (error) {
            console.error(error);
            return {success: false};
        }
    };

    useEffect(() => {
        (async () => {
            if (state === "unloaded") {
                const res = await fetchData();

                if (res.success) {
                    const wb = XLSX.read(res.data, {type: "array"});
                    const wc = wb.Sheets["worldcities"];
                    const arcsSheet = wb.Sheets["transactions"];

                    const wcData = XLSX.utils.sheet_to_json(wc, {header: 1});
                    const arcsData = XLSX.utils.sheet_to_json(arcsSheet, {header: 1});

                    const places_ = wcData
                        .slice(1) // Skip the header
                        .map((data) => ({
                            lat: +data[1],
                            lng: +data[2],
                            size: "0.25",
                            city: data[0],
                        }));

                    const transactions = arcsData.map((data) => ({
                        startlat: +data[3],
                        startlng: +data[4],
                        endlat: +data[5],
                        endlng: +data[6],
                        label: `${data[2]} to ${data[0]}`,
                    }));

                    setArcs(transactions);
                    setPlaces(places_);
                    setState("loaded");
                }
            }
        })();
    }, [state]);

    const globeEl = useRef();

    return (
        <>
            <Globe
                ref={globeEl}
                globeImageUrl="/images/earth-night.jpg"
                backgroundImageUrl="/images/night-sky.png"
                arcsData={arcs}
                arcStartLat={(d) => +d.startlat}
                arcStartLng={(d) => +d.startlng}
                arcEndLat={(d) => +d.endlat}
                arcEndLng={(d) => +d.endlng}
                arcDashLength={0.25}
                arcDashGap={1}
                arcLabel={(d) => d.label}
                arcDashInitialGap={() => Math.random()}
                arcDashAnimateTime={4000}
                arcColor={() => "#9cff00"}
                arcsTransitionDuration={0}
                pointsData={places.slice(0, 20000)}
                pointColor={() => "#FFFF00"}
                pointAltitude={0.01}
                pointLabel="city"
                pointRadius="size"
                hexPolygonsData={countries.features}
                hexPolygonResolution={3}
                hexPolygonMargin={0.7}
                hexPolygonColor={() => "rgba(255,255,255, 1)"}
                showAtmosphere={false}
            />
        </>
    );
}

export default EarthGlobe;
