import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";

const app = express();
const port = 3000;
const NASA_API_KEY = "bNjULSboAPSvDaYME41SMmVjiPSiccn0oV9e1AiD";

app.use(bodyParser.urlencoded( {extended: true} ));

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

const rtoday = yyyy + '/' + mm + '/' + dd;

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/nasa-apod", async (req, res) => {
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        const result = response.data;
        const data = {
            copyright: result.copyright,
            photo_explanation: result.explanation,
            image_title: result.title,
            url: result.url 
        };
        //console.log(data);
        res.json(data);
    } catch (error) {
        res.json(error.message);
    }
});


//------------------------------------------------------------------------------------------------
// /landsat-imagery?lat=LAT&long=LONG&dim=DIM&date=YYYY/MM/DD
app.get("/landsat-imagery", async (req, res) => {
    try {
        const latitude = req.query.lat;
        const longitude = req.query.long;
        const dimension  = req.query.dim || 0.25;

        const api_req_date = req.query.date || rtoday;

        const response = await axios.get(`https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&date=${api_req_date}&api_key=${NASA_API_KEY}`);
        const result = response.data;

        const image_data = {
            type: "png", 
            base64: result,
            convert_base64_to_png: "https://medium.com/@divinehycenth8/convert-a-base64-data-into-an-image-in-node-js-d82136576e35"
        };

        //console.log(result);
        res.json(image_data);

    } catch (error) {
        res.json(error.message);
    }
});


//------------------------------------------------------------------------------------------------
// /upcoming-launches
app.get("/upcoming-launches", async (req, res) => {
    try {
        const response = await axios.get("https://ll.thespacedevs.com/2.2.0/launch/upcoming");
        const result = response.data;
        console.log(result.results[0].name);
        
        let final_launch_data = [];
        
        for (var i = 0; i < result.count ; i++) {
            const launch_data = {
                name : result.results[i]?.name,
                status : result.results[i]?.status?.name,
                last_updated : result.results[i]?.last_updated,
                start_window : result.results[i]?.window_start,
                end_window : result.results[i]?.window_end,
                launch_by : result.results[i]?.launch_service_provider?.name,
                launch_type : result.results[i]?.launch_service_provider?.type,
                rocket_name : result.results[i]?.rocket.configuration?.name,
                mission_name : result.results[i]?.mission?.name,
                mission_description : result.results[i]?.mission?.description,
                launch_pad : result.results[i]?.pad?.name,
                launch_venue : result.results[i]?.pad?.location?.name,
                latitude : result.results[i]?.pad?.latitude,
                longitude : result.results[i]?.pad?.longitude,
            };

            final_launch_data.push(launch_data);
        }
        //console.log(final_launch_data);
        res.json(final_launch_data);
    } catch (error) {
        res.json(error.message);
    }
});


//------------------------------------------------------------------------------------------------
// /astronauts-in-iss
app.get("/astronauts-in-iss", async (req, res) => {
    try {
        const response = await axios.get("http://api.open-notify.org/astros.json");
        const result = response.data;
        //console.log(result);

        let iss_crew = [];
        for (var i = 0; i < result.people.length; i++) {
            if (result.people[i].craft == 'ISS') {
                iss_crew.push(result.people[i].name);
            }
        }
        const data = { iss_crew_members: iss_crew };
        //console.log(iss_crew);
        res.json(data);
    } catch (error) {
        res.json(error.message);
    }
});
//-----------------------------------------------------------------------------------------------
/* 
solar-system-bodies?type=TYPE
types: all, local, non-planets, planets
*/
app.get("/solar-system-bodies", async (req, res) => {
    try {
        const response = await axios.get("https://api.le-systeme-solaire.net/rest/bodies/");
        const result = response.data;
        //console.log(result.bodies.length);

        let bodiesData = [];

        for (var i = 0; i < result.bodies.length; i++) {
            const body_info = {
                id: result.bodies[i].id,
                name: result.bodies[i].englishName,
                aphelion: result.bodies[i].aphelion,
                perihelion: result.bodies[i].perihelion,
                mass: result.bodies[i].mass,
                volume: result.bodies[i].volume,
                density: result.bodies[i].density,
                gravity: result.bodies[i].gravity
            };
            bodiesData.push(body_info);
        };


        let planetary_bodies = [
            "Mercury",
            "Venus",
            "Earth",
            "Mars",
            "Jupiter",
            "Saturn",
            "Uranus",
            "Neptune",
            "Pluto"  // Some consider Pluto a dwarf planet rather than a full-fledged planet
        ];

        let planetsInOurSolarSystem = [];

        for (var i = 0; i < planetary_bodies.length; i++) {
            const planet = planetary_bodies[i];
            for (var j = 0; j < bodiesData.length; j++) {
                if (bodiesData[j].name == planet) {
                    planetsInOurSolarSystem.push(bodiesData[j]);
                }
            }
        }

        let nonPlanets = [];
        let planets = [];
        for (var i = 0; i < result.bodies.length; i++) {
            if (result.bodies[i].isPlanet === false) {
                const body_info = {
                    id: result.bodies[i].id,
                    name: result.bodies[i].englishName,
                    aphelion: result.bodies[i].aphelion,
                    perihelion: result.bodies[i].perihelion,
                    mass: result.bodies[i].mass,
                    volume: result.bodies[i].volume,
                    density: result.bodies[i].density,
                    gravity: result.bodies[i].gravity
                };
                nonPlanets.push(body_info);
            } else {
                const body_info = {
                    id: result.bodies[i].id,
                    name: result.bodies[i].englishName,
                    aphelion: result.bodies[i].aphelion,
                    perihelion: result.bodies[i].perihelion,
                    mass: result.bodies[i].mass,
                    volume: result.bodies[i].volume,
                    density: result.bodies[i].density,
                    gravity: result.bodies[i].gravity
                };
                planets.push(body_info);
            }
        }

        const final_bodies_data = {
            count: bodiesData.length,
            bodies: bodiesData
        };
        const planets_in_our_solarsystem = {
            count: planetsInOurSolarSystem.length,
            planets: planetsInOurSolarSystem
        };
        const non_planets = {
            count: nonPlanets.length,
            bodies: nonPlanets
        };
        const arePlanets = {
            count: planets.length,
            planets: planets
        };

        const requestType = req.query.type;
        switch (requestType) {
            case "all":
                res.json(final_bodies_data);
                break;
            case "local":
                res.json(planets_in_our_solarsystem);
                break;
            case "non-planets":
                res.json(non_planets);
                break;
            case "planets":
                res.json(arePlanets);
                break;
            default:
                break;
        };



    } catch (error) {
        res.json(error.message);
    }
});
//------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Successfully up and running on port ${port}`);
});