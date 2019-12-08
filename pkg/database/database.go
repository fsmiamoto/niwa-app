package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type TempHumPoint struct {
	Temp      float64
	Hum       float64
	Timestamp string
}

var Db *sql.DB

func Init(file string) {
	var err error

	Db, err = sql.Open("sqlite3", file)

	stmt := `
		CREATE TABLE IF NOT EXISTS 
		temp_hum (
			id INTEGER NOT NULL PRIMARY KEY, 
			temp REAL NOT NULL, 
			hum REAL NOT NULL, 
			timestamp TEXT NOT NULL
		);
	`
	_, err = Db.Exec(stmt)

	if err != nil {
		log.Fatal(err)
	}
}

func Close() {
	Db.Close()
}

func InsertPoint(p TempHumPoint) {
	stmt := `
		INSERT INTO temp_hum(temp,hum,timestamp) VALUES (?,?,?)
	`
	_, err := Db.Exec(stmt, p.Temp, p.Hum, p.Timestamp)

	if err != nil {
		log.Print(err)
	}
}

func GetPoints(limit int) []TempHumPoint {
	var points []TempHumPoint

	query := `
		SELECT * FROM temp_hum ORDER BY id DESC LIMIT ?;
	`

	rows, err := Db.Query(query, limit)

	if err != nil {
		log.Print(err)
		return points
	}

	defer rows.Close()

	for rows.Next() {
		var id int
		var temp, hum float64
		var timestamp string

		err = rows.Scan(&id, &temp, &hum, &timestamp)
		if err != nil {
			log.Print(err)
		}

		p := TempHumPoint{
			Temp:      temp,
			Hum:       hum,
			Timestamp: timestamp,
		}

		points = append(points, p)
	}

	return points
}
