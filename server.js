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

app.get("/landsat-imagery", async (req, res) => {
    try {
        const latitude = req.query.lat;
        const longitude = req.query.long;
        const dimension  = req.query.dim || 0.25;

        const api_req_date = req.query.date || rtoday;

        const response = await axios.get(`https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&date=${api_req_date}&api_key=${NASA_API_KEY}`);
        const result = response.data;

        //console.log(result);
        res.json(result);
    } catch (error) {
        res.json(error.message);
    }
});

app.get("/upcoming", async (req, res) => {
    try {
        const response = await axios.get("https://ll.thespacedevs.com/2.2.0/launch/upcoming");
        const result = response.data;
        const latest = result.results[0];

        const respose = {
            name : latest.name,
            status : latest.status?.name,
            last_updated : latest.last_updated,
            start_window : latest.window_start,
            end_window : latest.window_end,
            launch_by : latest.launch_service_provider?.name,
            launch_type : latest.launch_service_provider?.type,
            rocket_name : latest.rocket.configuration?.name,
            mission_name : latest.mission?.name,
            mission_description : latest.mission?.description,
            launch_pad : latest.pad?.name,
            launch_venue : latest.pad?.location?.name,
            latitude : latest.pad?.latitude,
            longitude : latest.pad?.longitude,
        }

        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
})

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
        console.log(final_launch_data);
    } catch (error) {
        res.json(error.message);
    }
});

app.get("/spacestations", async (req, res) => {
    try {
        const response = await axios.get("https://ll.thespacedevs.com/2.2.0/spacestation");
        const result = response.data;

        var space_stations = [];

        for(var i = 0; i < result.count; i++) {
            if (result.results.status.name == "Active") {
                const data = {
                    name: result.results.name,
                    orbit: result.results.orbit,
                    active_expeditions: result.results.active_expeditions,
                }
            space_stations.push(data);
            }
        }

        res.json(space_stations);

    } catch (error) {
        res.json(error.message);
    }
});

app.listen(port, () => {
    console.log(`Successfully up and running on port ${port}`);
});