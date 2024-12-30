from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.image import ImageService
from services.other import OtherService
import requests
import hmac
import hashlib
import uuid
from datetime import datetime
other_bp = Blueprint('other', __name__)

images_service = ImageService()
others_service = OtherService()

@other_bp.route('/api/donate', methods=['PUT'])
@jwt_required()
def update_book():
    try:
        image = request.files.get('image')
        updated = images_service.save_file(image, "donate", image.filename.split(".")[-1])
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'Book not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@other_bp.route('/api/offline-calendar', methods=['GET'])
def get_offline_calendar():
    try:
        offline_calendar = others_service.get_offline_calendar()
        return jsonify({
            "message": "success",
            "offline_calendar": offline_calendar
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@other_bp.route('/api/offline-calendar', methods=['PUT'])
@jwt_required()
def set_offline_calendar():
    try:
        data = request.get_json()
        
        updated = others_service.set_offline_calendar(data["time"], data["location"])
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'Fail to set value'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@other_bp.route('/api/momo_payment', methods=['POST'])
def create_payment():
    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    accessKey = "F8BBA842ECF85"
    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
    orderInfo = "pay with MoMo"
    partnerCode = "MOMO"
    redirectUrl = "https://chess.workon.space/billing"
    ipnUrl = "https://chess.workon.space/billing"
    amount = request.json.get('amount')
    orderId = str(uuid.uuid4())
    requestId = str(uuid.uuid4())
    extraData = ""  # pass empty value or Encode base64 JsonString
    rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=captureWallet"
    h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
    signature = h.hexdigest()

    data = {
        'partnerCode': partnerCode,
        'partnerName': "Test",
        'storeId': "MomoTestStore",
        'requestId': requestId,
        'amount': amount,
        'orderId': orderId,
        'orderInfo': orderInfo,
        'redirectUrl': redirectUrl,
        'ipnUrl': ipnUrl,
        'lang': "vi",
        'extraData': extraData,
        'requestType': "captureWallet",
        'signature': signature
    }

    response = requests.post(endpoint, json=data, headers={'Content-Type': 'application/json'})
    
    # Log the payment
    others_service.log_payment('create_payment', response.json().get('resultCode'), orderId, response.json())

    return jsonify(response.json())

@other_bp.route('/api/momo_payment_status', methods=['POST'])
def query_momo_payment_status():
    endpoint = "https://test-payment.momo.vn/v2/gateway/api/query"
    accessKey = "F8BBA842ECF85"
    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
    partnerCode = "MOMO"
    orderId = request.json.get('orderId')
    requestId = str(uuid.uuid4())

    rawSignature = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId
    h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
    signature = h.hexdigest()

    data = {
        'partnerCode': partnerCode,
        'requestId': requestId,
        'orderId': orderId,
        'signature': signature,
        'lang': 'vi'
    }

    response = requests.post(endpoint, json=data, headers={'Content-Type': 'application/json'})
    others_service.log_payment('query_payment_status', response.json().get('resultCode'), orderId, response.json())

    return jsonify(response.json())
@other_bp.route('/api/vnpay_payment', methods=['POST'])
def create_vnpay_payment():
    vnp_TmnCode = 'F8BBA842ECF85'  # Test TMN Code
    vnp_HashSecret = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'  # Test Hash Secret
    vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    vnp_Returnurl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'
    vnp_IpnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'
    vnp_TxnRef = str(uuid.uuid4())
    vnp_OrderInfo = 'pay with VNPAY'
    vnp_OrderType = 'other'
    vnp_Amount = int(request.json.get('amount')) * 100  # VNPAY requires the amount in VND x 100
    vnp_Locale = 'vn'
    vnp_BankCode = ''

    inputData = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_Amount': vnp_Amount,
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_OrderType': vnp_OrderType,
        'vnp_Locale': vnp_Locale,
        'vnp_ReturnUrl': vnp_Returnurl,
        'vnp_IpnUrl': vnp_IpnUrl,
        'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S')
    }
    if vnp_BankCode:
        inputData['vnp_BankCode'] = vnp_BankCode

    inputData = {k: v for k, v in sorted(inputData.items())}

    queryString = '&'.join([f"{key}={value}" for key, value in inputData.items()])
    hashData = '&'.join([f"{key}={value}" for key, value in inputData.items() if key.startswith('vnp_')])

    vnp_SecureHash = hashlib.sha256((vnp_HashSecret + hashData).encode('utf-8')).hexdigest()
    paymentUrl = f"{vnp_Url}?{queryString}&vnp_SecureHashType=SHA256&vnp_SecureHash={vnp_SecureHash}"

    return jsonify({'payUrl': paymentUrl})


@other_bp.route('/api/payments', methods=['GET'])
@jwt_required()
def get_all_payments():
    try:
        payments = others_service.get_all_payments()
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    


@other_bp.route('/api/get-all-database', methods=['GET'])
def get_all_database():
    try:
        data = others_service.get_all_data()
        # Debug log
        for collection_name, documents in data.items():
            for document in documents:
                try:
                    jsonify(document)
                except Exception as e:
                    print(f"Error serializing document in {collection_name}: {document}")
                    print(f"Exception: {e}")
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    
