import requests
import json

api_keys = ['NR', 'AK', '-', '1AK22GUN', 'F2Q51UNRF', 'NKQJZCNKHR']
account_id = 4417066
endpoint = "https://api.newrelic.com/graphql"
headers = {'Api-Key': ''.join(api_keys)}

class NerdGraph:
    def get(self, query: str):
        payload = {
            "query": f'''
                query {{
                    actor {{
                        nrql(
                            accounts: {account_id}
                            query: "{query}"
                            async: true) 
                        {{
                            results
                        }}
                    }}
                }}
            '''
        }

        response = requests.post(endpoint, headers=headers, json=payload)
        if response.status_code == 200: 
            dict_response = json.loads(response.content)
            return dict_response["data"]["actor"]["nrql"]["results"]
        else:
            raise Exception(f'Nerdgraph query failed with a {response.status_code}.')