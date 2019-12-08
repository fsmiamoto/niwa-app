package main

import (
	"log"
	"time"

	"niwa/pkg/database"
	"niwa/pkg/serial"

	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

const (
	// Max values to avoid saving bad points
	MaxTemp = 40
	MaxHum  = 100

	// App
	Title  = "Niwa"
	Width  = 1024
	Height = 768
)

func getCurrentTempHum() database.TempHumPoint {
	temp, hum, err := serial.ReadTempHumFromSerial()

	if err != nil {
		log.Print(err)

		return database.TempHumPoint{
			Temp:      -255,
			Hum:       -255,
			Timestamp: time.Now().Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	if temp > MaxTemp || hum > MaxHum {
		log.Print("Invalid values for temp or humidity")
		return database.TempHumPoint{
			Temp:      -255,
			Hum:       -255,
			Timestamp: time.Now().Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	log.Printf("Temp: %.2f Hum: %.2f\n", temp, hum)

	newPoint := database.TempHumPoint{
		Temp:      temp,
		Hum:       hum,
		Timestamp: time.Now().Format("2006-01-02T15:04:05Z07:00"),
	}

	database.InsertPoint(newPoint)

	return newPoint
}

func main() {
	database.Init("./data.db")
	serial.Init("/dev/ttyACM0", 9600)

	defer database.Close()
	defer serial.Close()

	js := mewn.String("./frontend/build/static/js/main.js")
	css := mewn.String("./frontend/build/static/css/main.css")

	app := wails.CreateApp(&wails.AppConfig{
		Width:  Width,
		Height: Height,
		Title:  Title,
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})

	// Bind functions to the frontend
	app.Bind(getCurrentTempHum)
	app.Bind(database.GetPoints)
	app.Bind(serial.TurnPump)

	app.Run()

}
