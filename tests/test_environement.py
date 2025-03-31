import unittest
from unittest.mock import patch
import requests
import os

class TestEnvironmentVariables(unittest.TestCase):

    def setUp(self):
        self.token = os.getenv("CLIENT_TOKEN")
        self.application_id = os.getenv("APPLICATION_ID")
        self.url = "https://discord.com/api/v10/users/@me"
        self.headers = {
            "Authorization" : f"Bot {self.token}"
        }

        self.assertIsNotNone(self.token, "CLIENT_TOKEN not found in environment variables or .env file")
        self.assertIsNotNone(self.application_id, "APPLICATION_ID not found in environment variables or .env file")
    
    def mock_api_request(self, mock_get, status_code, json_data):
        mock_response = mock_get.return_value
        mock_response.status_code = status_code
        mock_response.json.return_value = json_data

    @patch("requests.get")
    def test_token(self, mock_get):
        """Test if token is valid"""
        self.mock_api_request(mock_get=mock_get, status_code=200, json_data={})
        response = requests.get(self.url, headers=self.headers)
        self.assertEqual(response.status_code, 200, "Token is invalid")

    @patch("requests.get")
    def test_application_id(self, mock_get):
        """Test if application id is correct"""
        self.mock_api_request(mock_get=mock_get, status_code=200, json_data={"id" : self.application_id})
        response = requests.get(self.url, headers=self.headers)
        bot_infos = response.json()
        self.assertEqual(bot_infos["id"], self.application_id, "Application id is incorrect")

    