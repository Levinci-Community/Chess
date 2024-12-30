# import pytest
# import json

# def test_get_ajax_request_http_method(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/ajax_request_http_method', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_ajax_request_hostname(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/ajax_request_hostname', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_ajax_request_page_url(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/ajax_request_page_url', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_browser_interaction(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/browser_interaction', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_ajax_request_http_response_code_hostname(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/ajax_request_http_response_code_hostname', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_transaction_summary(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/transaction_summary', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_failed_transactions(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/failed_transactions', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_metric_summary(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/metric_summary', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_apdex(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/apdex', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"

# def test_get_web_transaction_facet_name(test_client, admin_access_token):
#     response = test_client.get('/api/dashboard/web_transaction_facet_name', headers={
#         'Authorization': f'Bearer {admin_access_token}'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert "data" in data
#     assert data["message"] == "success"
