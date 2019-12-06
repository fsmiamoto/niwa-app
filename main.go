package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/leaanthony/mewn"
	"github.com/tarm/serial"
	"github.com/wailsapp/wails"
)

var serialPort *serial.Port

func getCurrentTempHum() []float64 {
	temp, hum, err := readTempHumFromSerial()

	fmt.Printf("Temp: %.2f Hum: %.2f\n", temp, hum)

	if err != nil {
		log.Print(err)
		return []float64{-255, -255}
	}
	return []float64{temp, hum}
}

func readTempHumFromSerial() (float64, float64, error) {
	bytes, err := readFromSerial()
	if err != nil {
		return 0.0, 0.0, err
	}

	s := strings.TrimSpace(string(bytes))
	splited := strings.Split(s, ";")

	if len(splited) != 2 {
		return 0.0, 0.0, fmt.Errorf("Problem with splited length!")
	}

	temp, err := strconv.ParseFloat(strings.TrimLeft(splited[0], "\x00"), 32)
	if err != nil {
		return 0.0, 0.0, err
	}

	hum, err := strconv.ParseFloat(splited[1], 32)
	if err != nil {
		return 0.0, 0.0, err
	}

	return temp, hum, nil
}

func readFromSerial() ([]byte, error) {
	buf := make([]byte, 1)
	data := make([]byte, 32)

	// Wait for the first slash
	for {
		_, err := serialPort.Read(buf)
		if err != nil {
			return nil, nil
		}

		if string(buf[0]) == "/" {
			break
		}
	}

	// Append bytes until a other slash is found
	for {
		_, err := serialPort.Read(buf)
		if err != nil {
			return nil, nil
		}

		if string(buf[0]) == "/" {
			break
		}

		data = append(data, buf[0])
	}

	return data, nil
}

func main() {
	var err error

	c := &serial.Config{Name: "/dev/ttyACM0", Baud: 9600}

	serialPort, err = serial.OpenPort(c)

	if err != nil {
		log.Fatal(err)
	}

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
	app.Bind(getCurrentTempHum)
	app.Run()

}
