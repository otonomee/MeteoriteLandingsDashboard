from flask import Flask, jsonify
import sqlite3
import pandas as pd
from ast import literal_eval
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
#add
def query_db(query, args=(), one=False):
    con = sqlite3.connect('meteorites.db')
    cur = con.execute(query, args)
    rv = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    con.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/total_meteorites', methods=['GET'])
def total_meteorites():
    total = len(query_db('SELECT name FROM meteorites'))
    return jsonify(total=total)

@app.route('/average_mass', methods=['GET'])
def average_mass():
    avg_mass = query_db('SELECT AVG("mass (g)") FROM meteorites')[0]['AVG("mass (g)")']
    return jsonify(average_mass=avg_mass)

@app.route('/meteorites_per_year', methods=['GET'])
def meteorites_per_year():
    per_year = query_db('SELECT year, COUNT(*) as count FROM meteorites WHERE YEAR >= 1980 GROUP BY year')
    return jsonify(per_year)

from ast import literal_eval

@app.route('/meteorites_with_coordinates', methods=['GET'])
def meteorites_with_coordinates():
    per_location = query_db('SELECT GeoLocation, name, "mass (g)" as mass, year, COUNT(*) as count FROM meteorites GROUP BY GeoLocation, name, "mass (g)", year')
    for location in per_location:
        if location['GeoLocation'] is not None:
            lat, lon = literal_eval(location['GeoLocation'])
            location['latitude'] = lat
            location['longitude'] = lon
    return jsonify(per_location)

@app.route('/heaviest_meteorite', methods=['GET'])
def heaviest_meteorite():
    heaviest = query_db('SELECT name FROM meteorites ORDER BY mass DESC LIMIT 1')[0]['name']
    return jsonify(heaviest_meteorite=heaviest)

@app.route('/oldest_meteorite', methods=['GET'])
def oldest_meteorite():
    oldest = query_db('SELECT name FROM meteorites ORDER BY year ASC LIMIT 1')[0]['name']
    return jsonify(oldest_meteorite=oldest)

if __name__ == '__main__':
    app.run(debug=True)