import sys
import requests

HEADERS = {"Content-Type": "application/json"}
BASE_URL = "http://api.stats.com/v1/stats/basketball/nba/stats/players/"


def main(player_id, api_key, sig):
    url = BASE_URL + player_id + "?api_key=" + api_key + "&sig=" + sig
    result = requests.request(
        "GET", (url)
    )
    json_result = result.json()

    if "apiResults" in json_result:
        data = json_result.get("apiResults")[0].get("league").get("players")[0]
        season_data = data.get("seasons")[0]
        player_data = season_data.get("eventType")[0].get("splits")[0].get("playerStats")

        return_data = {
            "id": data.get("playerId"),
            "season": season_data.get("season"),
            "points": player_data.get("points"),
            "rebounds": player_data.get("rebounds").get("total"),
            "assists": player_data.get("assists"),
            "blocks": player_data.get("blockedShots"),
            "steals": player_data.get("steals"),
            "turnovers": player_data.get("turnovers")
        }

        return return_data

    raise ValueError('key "apiResults" not found')


if __name__ == "__main__":
    try:
        print(main(*sys.argv[1:]))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)