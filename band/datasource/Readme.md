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
