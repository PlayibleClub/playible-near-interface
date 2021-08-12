import sys
import requests

HEADERS = {"Content-Type": "application/json"}
URL = "http://api.stats.com/v1/stats/basketball/nba/"


def main(path):
    print((URL + path))
    result = requests.request(
        "GET", (URL + path)
    )
    print(result)
    json_result = result.json()
    print(json_result)

    if "apiResults" in json_result:
        final_value = json_result["apiResults"]
        return final_value

    raise ValueError('key "apiResults" not found')


if __name__ == "__main__":
    try:
        print(sys.argv)
        print(main(*sys.argv[1:]))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)