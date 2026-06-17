const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const locations = {
    Poland: {
        Warsaw: { lat: 52.2297, lon: 21.0122 },
        Lublin: { lat: 51.2465, lon: 22.5684 },
        Krakow: { lat: 50.0647, lon: 19.945 }
    },
    Germany: {
        Berlin: { lat: 52.52, lon: 13.405 },
        Munich: { lat: 48.1351, lon: 11.582 }
    },
    France: {
        Paris: { lat: 48.8566, lon: 2.3522 }
    }
};


console.log(`Start apki: ${new Date().toISOString()}`);
console.log("Autor: Tomasz Nowak");
console.log(`Nasluchiwanie na porcie: ${PORT}`);


app.get("/", (req, res) => {
    res.render("index", {
        locations,
        weather: null
    });
});

app.post("/weather", async (req, res) => {
    const country = req.body.country;
    const city = req.body.city;

    const coords = locations[country][city];

    try {
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        const weather = response.data.current;

        res.render("index", {
            locations,
            weather: {
                country,
                city,
                temperature: weather.temperature_2m,
                humidity: weather.relative_humidity_2m,
                wind: weather.wind_speed_10m
            }
        });

    } catch (error) {

        res.render("index", {
            locations,
            weather: {
                error: "nie udalo sie pobrać danych o pogodzie."
            }
        });
    }
});
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.listen(PORT, "0.0.0.0");