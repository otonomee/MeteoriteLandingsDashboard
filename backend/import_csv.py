import sqlite3
import pandas as pd

# Read the data from the CSV file
df = pd.read_csv('Meteorite_Landings.csv')

# Create a connection to the SQLite database
# If the database does not exist, it will be created
conn = sqlite3.connect('meteorites.db')

# Write the data to a table in the database
df.to_sql('meteorites', conn, if_exists='replace', index=False)

# Close the connection to the database
conn.close()
