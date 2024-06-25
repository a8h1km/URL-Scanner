import requests
import time
import json

api_key = 'c16d75cc089baa9c4b4a7ac5dfe0f1351c77908a41ce4479ecd2ac5cc0c98844'

print("\t\t\t\t\tCreated by HARSH:\n")

def scan_url(url):
    print("\t\t\t\t\tScan started: ")

    scan_url = 'https://www.virustotal.com/vtapi/v2/url/scan'
    report_url = 'https://www.virustotal.com/vtapi/v2/url/report'

    params = {'apikey': api_key, 'url': url}
    response = requests.post(scan_url, params=params)
    response_json = response.json()
    scan_id = response_json['scan_id']

    time.sleep(2)

    params = {'apikey': api_key, 'resource': scan_id}
    response = requests.get(report_url, params=params)
    response_json = response.json()

    if 'positives' in response_json and response_json['response_code'] == 1:
        if response_json["positives"] <= 0:
            result = "NOT MALICIOUS\n"
        elif 1 <= response_json['positives'] <= 3:
            result = "MAYBE MALICIOUS\n"
        elif response_json['positives'] >= 4:
            result = "MALICIOUS\n"
    else:
        result = "URL NOT FOUND"

    print("\t\t\t\t\tAnalysis completed!")
    return result

url = input("\t\t\t\t\tEnter a URL: ")
result = scan_url(url)
print(f"\t\t\t\t\tThe URL {url} is {result}")