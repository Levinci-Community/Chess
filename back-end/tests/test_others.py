import json
import pytest
from flask_jwt_extended import create_access_token
from unittest.mock import patch, MagicMock
from datetime import datetime
import uuid
import io
# Helper function to get a JWT token for a given user_id
def get_jwt_token(user_id, app):
    with app.test_request_context():
        token = create_access_token(identity=str(user_id))
    return token

@pytest.fixture(scope='module')
def new_calendar():
    return {
        "time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "location": "Test Location"
    }

@pytest.fixture(scope='module')
def momo_payment_data():
    return {
        "amount": "1000"
    }

@pytest.fixture(scope='module')
def vnpay_payment_data():
    return {
        "amount": 1000
    }

@patch('services.image.ImageService.save_file')
def test_update_book(mock_save_file, test_client):
    mock_save_file.return_value = True
    token = get_jwt_token("test_user_id", test_client.application)
    
    data = {
        'image': (io.BytesIO(b"fake image data"), 'test.jpg')
    }
    
    response = test_client.put('/api/donate', data=data,
                               headers={'Authorization': f'Bearer {token}'},
                               content_type='multipart/form-data')
    
    assert response.status_code == 200

def test_get_offline_calendar(test_client):
    response = test_client.get('/api/offline-calendar')
    assert response.status_code == 200
    assert "offline_calendar" in response.json

@patch('services.other.OtherService.set_offline_calendar')
def test_set_offline_calendar(mock_set_offline_calendar, test_client, new_calendar):
    mock_set_offline_calendar.return_value = True
    token = get_jwt_token("test_user_id", test_client.application)
    
    response = test_client.put('/api/offline-calendar',
                               data=json.dumps(new_calendar),
                               headers={'Authorization': f'Bearer {token}'},
                               content_type='application/json')
    
    assert response.status_code == 200

@patch('requests.post')
@patch('services.other.OtherService.log_payment')
def test_create_momo_payment(mock_log_payment, mock_post, test_client, momo_payment_data):
    mock_response = MagicMock()
    mock_response.json.return_value = {"resultCode": 0}
    mock_post.return_value = mock_response
    
    response = test_client.post('/api/momo_payment',
                                data=json.dumps(momo_payment_data),
                                content_type='application/json')
    
    assert response.status_code == 200
    assert "resultCode" in response.json

@patch('requests.post')
@patch('services.other.OtherService.log_payment')
def test_query_momo_payment_status(mock_log_payment, mock_post, test_client):
    mock_response = MagicMock()
    mock_response.json.return_value = {"resultCode": 0}
    mock_post.return_value = mock_response
    
    data = {"orderId": str(uuid.uuid4())}
    
    response = test_client.post('/api/momo_payment_status',
                                data=json.dumps(data),
                                content_type='application/json')
    
    assert response.status_code == 200
    assert "resultCode" in response.json

def test_create_vnpay_payment(test_client, vnpay_payment_data):
    response = test_client.post('/api/vnpay_payment',
                                data=json.dumps(vnpay_payment_data),
                                content_type='application/json')
    
    assert response.status_code == 200
    assert "payUrl" in response.json

@patch('services.other.OtherService.get_all_payments')
def test_get_all_payments(mock_get_all_payments, test_client):
    mock_get_all_payments.return_value = [{"payment_id": 1, "amount": 1000}]
    token = get_jwt_token("test_user_id", test_client.application)
    
    response = test_client.get('/api/payments',
                               headers={'Authorization': f'Bearer {token}'})
    
    assert response.status_code == 200
    assert len(response.json) > 0
    assert "payment_id" in response.json[0]
