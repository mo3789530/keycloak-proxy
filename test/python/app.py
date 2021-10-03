import uuid
import json
import requests
import time


BASE_URL = "http://localhost:8080"


def get_token():
    # BASE_URL = "http://192.168.11.11:8081"
    username = "admin"
    password = "Testing#1"
    realm = "test101"
    url = f"{BASE_URL}/auth/realms/{realm}/protocol/openid-connect/token"

    payload = f'client_secret={realm}&username={username}&password={password}&grant_type=password&client_id=admin-cli'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    # print(response.text)
    print("token: " + str(response.elapsed.total_seconds()))
    return response.json()['access_token']


def get_token2():
    # BASE_URL = "http://192.168.11.11:8080"
    username = "admin"
    password = "Testing#1"
    realm = "test001"
    url = f"{BASE_URL}/auth/realms/{realm}/protocol/openid-connect/token"

    payload = f'client_secret={realm}&username={username}&password={password}&grant_type=password&client_id=admin-cli'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    # print(response.text)
    print("token: " + str(response.elapsed.total_seconds()))
    return response.json()['access_token']


def main():
    print("start")

    while True:
        token = get_token()
        get_token2()
        time.sleep(3)


if __name__ == '__main__':
    main()
