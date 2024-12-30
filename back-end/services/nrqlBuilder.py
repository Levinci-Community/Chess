YESTERDAY = "YESTERDAY"
LAST_WEEK = "LAST WEEK"

class NrqlBuilder:
    def __init__(self):
        pass

    def build_ajax_request_http_method(self, time_period: str):
        return f"SELECT count(*) FROM AjaxRequest FACET httpMethod SINCE {time_period}"

    def build_ajax_request_hostname(self, time_period: str):
        return f"SELECT count(*) FROM AjaxRequest FACET hostname SINCE {time_period}"

    def build_ajax_request_page_url(self, time_period: str):
        return f"SELECT average(timeToSettle) FROM AjaxRequest FACET pageUrl SINCE {time_period}"

    def build_browser_interaction(self, time_period: str):
        return f"SELECT average(duration), percentile(duration, 50) as 'Median', percentile(duration, 75) FROM BrowserInteraction TIMESERIES SINCE {time_period}"

    def build_ajax_request_http_response_code_hostname(self, time_period: str):
        return f"SELECT count(*) FROM AjaxRequest WHERE hostname='chess.workon.space' FACET httpResponseCode SINCE {time_period}"

    def build_transaction_summary(self, time_period: str):
        return (f"FROM Transaction SELECT count(*) as 'Total transactions', "
                f"average(duration) as 'Average duration (s)', "
                f"percentile(duration, 90) as 'Slowest 10%/duration', "
                f"percentage(count(*), WHERE error is false) AS 'Success rate' "
                f"SINCE {time_period}")

    def build_failed_transactions(self, time_period: str):
        return (f"FROM Transaction SELECT count(*) as 'Total transactions', "
                f"percentage(count(*), WHERE error IS true) as 'Failed transactions in %', "
                f"count(*) * percentage(count(*), WHERE error IS true) / 100 as 'Failed transactions' "
                f"SINCE {time_period}")

    def build_metric_summary(self, time_period: str):
        return (f"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as 'Average CPU utilization ', "
                f"average(apm.service.memory.physical) as 'Average physical memory' "
                f"WHERE appName like '%' SINCE {time_period}")

    def build_apdex(self, time_period: str):
        return f"SELECT apdex(apm.service.apdex) FROM Metric WHERE (entity.guid = 'NDQxNzA2NnxBUE18QVBQTElDQVRJT058NTQzMjM1MDA5') FACET dateOf(timestamp) LIMIT MAX SINCE {time_period}"

    def build_web_transaction_facet_name(self, time_period: str):
        return f"SELECT count(*) FROM Transaction WHERE (transactionType = 'Web') SINCE {time_period} EXTRAPOLATE FACET name"
