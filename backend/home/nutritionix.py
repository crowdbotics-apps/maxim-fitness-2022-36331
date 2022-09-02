import requests
import json

from rest_framework import status
from rest_framework.response import Response


class Nutritionix:

    def __init__(self, app_id, api_key):
        self.app_id = app_id
        self.api_key = api_key

    def search(self, query):
        return requests.get('https://trackapi.nutritionix.com/v2/search/instant/?query=' + query,
                            headers={
                                'x-app-id': self.app_id,
                                'x-app-key': self.api_key,
                            }
                            ).json()

    def item_detail(self, item_id=None, upc=None):
        if item_id:
            return requests.get('https://trackapi.nutritionix.com/v2/search/item/?nix_item_id=' + item_id,
                                headers={
                                    'x-app-id': self.app_id,
                                    'x-app-key': self.api_key,
                                }
                                ).json()
        elif upc:
            return requests.get('https://trackapi.nutritionix.com/v2/search/item/?upc=' + upc,
                                headers={
                                    'x-app-id': self.app_id,
                                    'x-app-key': self.api_key,
                                }
                                ).json()

    def food_detail(self, query):
        payload = {'query': query}
        try:
            return requests.post('https://trackapi.nutritionix.com/v2/natural/nutrients',
                                 headers={
                                     'x-app-id': self.app_id,
                                     'x-app-key': self.api_key,
                                 },
                                 json=payload
                                 ).json()
        except requests.RequestException as e:
            print(e)
            # return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)
