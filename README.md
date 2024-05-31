# Space Master API Documentation

Welcome to the Space Master API! This API provides various endpoints to access space-related data, including NASA's Astronomy Picture of the Day, Landsat imagery, upcoming launches, astronauts currently in the ISS, and information about solar system bodies.

## Base URL
The base URL for accessing the API is:
```
https://api-space-master.onrender.com
```

## Endpoints

### 1. NASA Astronomy Picture of the Day (APOD)
**Endpoint:** `/nasa-apod`

**Description:** Get the Astronomy Picture of the Day (APOD) from NASA.

**Method:** `GET`

**Example Request:**
```
GET https://api-space-master.onrender.com/nasa-apod
```

**Response:**
```json
{
    "copyright": "Some Author",
    "photo_explanation": "Explanation of the photo.",
    "image_title": "Title of the Image",
    "url": "https://example.com/image.jpg"
}
```

### 2. Landsat Imagery
**Endpoint:** `/landsat-imagery`

**Description:** Get Landsat imagery based on latitude, longitude, and optional dimensions and date.

**Method:** `GET`

**Query Parameters:**
- `lat` (required): Latitude
- `long` (required): Longitude
- `dim` (optional): Dimension (default: 0.25)
- `date` (optional): Date in YYYY/MM/DD format (default: today's date)

**Example Request:**
```
GET https://api-space-master.onrender.com/landsat-imagery?lat=34.0522&long=-118.2437&dim=0.25&date=2022/01/01
```

**Response:**
```json
{
    "type": "png",
    "base64": "<base64_encoded_image_data>",
    "convert_base64_to_png": "https://medium.com/@divinehycenth8/convert-a-base64-data-into-an-image-in-node-js-d82136576e35"
}
```

### 3. Upcoming Launches
**Endpoint:** `/upcoming-launches`

**Description:** Get information about upcoming space launches.

**Method:** `GET`

**Example Request:**
```
GET https://api-space-master.onrender.com/upcoming-launches
```

**Response:**
```json
[
    {
        "name": "Launch Name",
        "status": "Launch Status",
        "last_updated": "Last Updated Date",
        "start_window": "Start Window",
        "end_window": "End Window",
        "launch_by": "Launch Provider",
        "launch_type": "Launch Type",
        "rocket_name": "Rocket Name",
        "mission_name": "Mission Name",
        "mission_description": "Mission Description",
        "launch_pad": "Launch Pad",
        "launch_venue": "Launch Venue",
        "latitude": 0.0,
        "longitude": 0.0
    }
]
```

### 4. Astronauts in ISS
**Endpoint:** `/astronauts-in-iss`

**Description:** Get the names of astronauts currently in the International Space Station (ISS).

**Method:** `GET`

**Example Request:**
```
GET https://api-space-master.onrender.com/astronauts-in-iss
```

**Response:**
```json
{
    "iss_crew_members": [
        "Astronaut 1",
        "Astronaut 2",
        "Astronaut 3"
    ]
}
```

### 5. Solar System Bodies
**Endpoint:** `/solar-system-bodies`

**Description:** Get information about various bodies in the solar system. You can filter the results by type.

**Method:** `GET`

**Query Parameters:**
- `type` (optional): Type of bodies to filter. Possible values:
  - `all`
  - `local`
  - `non-planets`
  - `planets`
  - `dwarf`
  - `star`
  - `moon`
  - `comet`

**Example Request:**
```
GET https://api-space-master.onrender.com/solar-system-bodies?type=planets
```

**Response:**
```json
{
    "count": 8,
    "planets": [
        {
            "id": "mercury",
            "name": "Mercury",
            "aphelion": 69816900,
            "perihelion": 46001200,
            "mass": {"massValue": 3.3011, "massExponent": 23},
            "volume": {"volValue": 6.083, "volExponent": 10},
            "density": 5.427,
            "gravity": 3.7
        },
        // Other planets...
    ]
}
```

## Installation and Usage
To install and run the API locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/space-master-api.git
   ```
2. Navigate to the project directory:
   ```
   cd space-master-api
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```

The API should now be running at `http://localhost:3000`.

## Notes
- Ensure you replace `NASA_API_KEY` with your actual NASA API key.
- The API fetches data from various public APIs, and the rate limits of those APIs may apply.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License
This project is licensed under the MIT License.

---

For any further questions or support, please open an issue on the [GitHub repository](https://github.com/your-username/space-master-api).



