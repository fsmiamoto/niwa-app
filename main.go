package main

import (
	"math/rand"

	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

func getCurrentTemperature() float32 {
	return 26.0 + 2*rand.Float32()
}

func getCurrentHumidity() float32 {
	return 40 + 2*rand.Float32()
}

func main() {

	js := mewn.String("./frontend/build/static/js/main.js")
	css := mewn.String("./frontend/build/static/css/main.css")

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height: 768,
		Title:  "niwa-app",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})

	// Bind functions for use in the frontend
	app.Bind(getCurrentTemperature)
	app.Bind(getCurrentHumidity)

	app.Run()
}
