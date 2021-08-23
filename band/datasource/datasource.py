import sys
import requests

HEADERS = {"Content-Type": "application/json"}
BASE_URL = "http://api.stats.com/v1/stats/basketball/nba/"


def main(path):
    result = requests.request(
        "GET", (BASE_URL + path)
    )
    print(result)
    json_result = result.json()

    if "apiResults" in json_result:
        final_value = json_result["apiResults"]
        return final_value

    raise ValueError('key "apiResults" not found')


if __name__ == "__main__":
    try:
        print(main(*sys.argv[1:]))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)