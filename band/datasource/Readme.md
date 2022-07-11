# Installation

virtualenv -p python3 venv

venv/Scripts/activate

pip install -r requirements.txt

# Sample run command

python datasource.py 214152 "93h4srm3bnhqkvx3mc84dzc6" "d3d4b41ec509f88be6c4eb66137a43da9054f632a4f757eb2513b1a095a1e510"

## Run Parameters

- player_id - player id from stats perform (e.g. 214152)
- api_key - public api key for stats perform (e.g. 93h4srm3bnhqkvx3mc84dzc6)
- sig - generated signature for stats perform based on the private key and the current time (e.g. d3d4b41ec509f88be6c4eb66137a43da9054f632a4f757eb2513b1a095a1e510)

Note that the signature expires after a few minutes. A new one should ideally generated for every call.

# Expected Response

```
{
  'id': 214152, //Player ID
  'season': 2020, //Season the data was retrieved from, it is from the current season by default
  'points': 1126,
  'rebounds': 346,
  'assists': 350,
  'blocks': 25,
  'steals': 48,
  'turnovers': 168
}
```

# Alternative run command to use keys stored in .env file

`python datasource_env.py 214152`

Don't forget to install requirements.txt and to setup the .env file. Use .env.sample for reference.
