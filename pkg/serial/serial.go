package serial

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	s "github.com/tarm/serial"
)

var SerialPort *s.Port

func Init(port string, baud int) {
	var err error
	c := &s.Config{Name: port, Baud: baud}

	SerialPort, err = s.OpenPort(c)

	if err != nil {
		log.Fatal(err)
	}
}

func Close() {
	SerialPort.Close()
}

// Reads data from the serial port delimited by slashes
func ReadFromSerial() ([]byte, error) {
	buf := make([]byte, 1)
	data := make([]byte, 32)

	// Wait for the first slash
	for {
		_, err := SerialPort.Read(buf)
		if err != nil {
			return nil, nil
		}

		if string(buf[0]) == "/" {
			break
		}
	}

	// Append bytes until another slash is recieved
	for {
		_, err := SerialPort.Read(buf)
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

// Turns pump on or off
func TurnPump(state string) error {
	var cmd string

	if state == "on" {
		cmd = "l"
	} else if state == "off" {
		cmd = "d"
	}

	_, err := SerialPort.Write([]byte(cmd))

	if err != nil {
		return err
	}

	return nil
}

// Reads temperature and humidity from the serial port
func ReadTempHumFromSerial() (float64, float64, error) {
	// Tell the microcontroller to send the data
	_, err := SerialPort.Write([]byte("e"))
	if err != nil {
		return 0.0, 0.0, err
	}

	// Read the data sent
	bytes, err := ReadFromSerial()
	if err != nil {
		return 0.0, 0.0, err
	}

	s := strings.TrimSpace(string(bytes))

	// Values are seperated by ;
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
