from services.nerdgraph import NerdGraph
from services.nrqlBuilder import NrqlBuilder, YESTERDAY, LAST_WEEK
from database.redis import get_redis
import json

from datetime import datetime, timedelta

nerdGraph = NerdGraph()
nrqlBuilder = NrqlBuilder()

class AdminDashboardService():
    def __init__(self) -> None:
        self.redis = get_redis()

    def get_data_from_redis(self, key: str):
        cached_data = self.redis.get(name=key)
        if cached_data is None:
            return None
        return json.loads(cached_data)

    def set_data_to_redis(self, key: str, data):
        serialized_data = json.dumps(data)
        tomorrow = datetime.today() + timedelta(days=1)
        expiration = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
        self.redis.set(name=key, value=serialized_data)
        self.redis.expireat(name=key, when=expiration)

    def get_ajax_request_http_method(self):
        cached_data = self.get_data_from_redis('ajax_request_http_method')
        if cached_data:
            return cached_data
        
        query_yesterday = nrqlBuilder.build_ajax_request_http_method(YESTERDAY)
        query_last_week = nrqlBuilder.build_ajax_request_http_method(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }

        self.set_data_to_redis('ajax_request_http_method', data)
        return data
    
    def get_ajax_request_hostname(self):
        cached_data = self.get_data_from_redis('ajax_request_hostname')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_ajax_request_hostname(YESTERDAY)
        query_last_week = nrqlBuilder.build_ajax_request_hostname(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('ajax_request_hostname', data)
        return data
    
    def get_ajax_request_page_url(self):
        cached_data = self.get_data_from_redis('ajax_request_page_url')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_ajax_request_page_url(YESTERDAY)
        query_last_week = nrqlBuilder.build_ajax_request_page_url(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('ajax_request_page_url', data)
        return data
    
    def get_browser_interaction(self):
        cached_data = self.get_data_from_redis('browser_interaction')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_browser_interaction(YESTERDAY)
        query_last_week = nrqlBuilder.build_browser_interaction(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('browser_interaction', data)
        return data
    
    
    def get_ajax_request_http_response_code_hostname(self):
        cached_data = self.get_data_from_redis('ajax_request_http_response_code_hostname')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_ajax_request_http_response_code_hostname(YESTERDAY)
        query_last_week = nrqlBuilder.build_ajax_request_http_response_code_hostname(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('ajax_request_http_response_code_hostname', data)
        return data
    
    def get_transaction_summary(self):
        cached_data = self.get_data_from_redis('transaction_summary')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_transaction_summary(YESTERDAY)
        query_last_week = nrqlBuilder.build_transaction_summary(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('transaction_summary', data)
        return data
    
    def get_failed_transactions(self):
        cached_data = self.get_data_from_redis('failed_transactions')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_failed_transactions(YESTERDAY)
        query_last_week = nrqlBuilder.build_failed_transactions(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('failed_transactions', data)
        return data
    
    def get_metric_summary(self):
        cached_data = self.get_data_from_redis('metric_summary')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_metric_summary(YESTERDAY)
        query_last_week = nrqlBuilder.build_metric_summary(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('metric_summary', data)
        return data
    
    def get_apdex(self):
        cached_data = self.get_data_from_redis('apdex')
        if cached_data:
            return cached_data

        query_last_week = nrqlBuilder.build_apdex(LAST_WEEK)

        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('apdex', data)
        return data
    
    def get_web_transaction_facet_name(self):
        cached_data = self.get_data_from_redis('web_transaction_facet_name')
        if cached_data:
            return cached_data

        query_yesterday = nrqlBuilder.build_web_transaction_facet_name(YESTERDAY)
        query_last_week = nrqlBuilder.build_web_transaction_facet_name(LAST_WEEK)

        data_yesterday = nerdGraph.get(query_yesterday)
        data_last_week = nerdGraph.get(query_last_week)

        data =  {
            "data_yesterday": data_yesterday,
            "data_last_week": data_last_week,
        }
        
        self.set_data_to_redis('web_transaction_facet_name', data)
        return data