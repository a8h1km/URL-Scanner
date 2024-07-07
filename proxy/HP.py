import requests
import time

print("Created by HARSH:\n\n\n")
def get_virustotal_report(api_key, url):
    scan_url_endpoint = "https://www.virustotal.com/vtapi/v2/url/scan"
    report_url_endpoint = "https://www.virustotal.com/vtapi/v2/url/report"  

    scan_params = {'apikey': api_key, 'url': url}
    scan_response = requests.post(scan_url_endpoint, data=scan_params)
    
    if scan_response.status_code != 200:
        print(f"Error in scanning URL: {scan_response.status_code}")
        return None

    scan_result = scan_response.json()
    if 'scan_id' not in scan_result:
        print("Error: scan_id not found in the scan response")
        return None

    scan_id = scan_result['scan_id']
    print(f"Scan ID: {scan_id}")

    
    time.sleep(15)  


    report_params = {'apikey': api_key, 'resource': scan_id}
    report_response = requests.get(report_url_endpoint, params=report_params)
    
    if report_response.status_code != 200:
        print(f"Error in retrieving report: {report_response.status_code}")
        return None

    report_result = report_response.json()
    return report_result

def display_report(report):
    if not report:
        print("No report to display.")
        return

    print(f"Scan Date: {report.get('scan_date')}")
    print(f"URL: {report.get('url')}")
    print(f"Permalink: {report.get('permalink')}")
    print(f"Positives: {report.get('positives')}")
    print("Detailed Results:")
    
    scans = report.get('scans', {})
    for scanner, result in scans.items():
        detected = result.get('detected', False)
        scan_result = result.get('result', 'Unknown')
        print(f"  {scanner}: Detected={detected}, Result={scan_result}")

if __name__ == "__main__":
    api_key = input("Enter your VirusTotal API key: ")
    url = input("Enter the URL to scan: ")
    
    report = get_virustotal_report(api_key, url)
    
    display_report(report)