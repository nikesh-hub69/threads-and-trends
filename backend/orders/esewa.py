import base64
import hashlib
import hmac
import json
import requests
from django.conf import settings


def _b64_hmac_sha256(message: str, secret: str) -> str:
    digest = hmac.new(
        secret.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).digest()
    return base64.b64encode(digest).decode("utf-8")


def make_esewa_form_fields(total_amount: str, transaction_uuid: str):
    product_code = settings.ESEWA_PRODUCT_CODE

    signed_field_names = "total_amount,transaction_uuid,product_code"
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"

    signature = _b64_hmac_sha256(message, settings.ESEWA_SECRET_KEY)

    if settings.ESEWA_ENV == "PROD":
        form_url = "https://epay.esewa.com.np/api/epay/main/v2/form"
        status_url = "https://epay.esewa.com.np/api/epay/transaction/status/"
    else:
        form_url = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        status_url = "https://rc.esewa.com.np/api/epay/transaction/status/"

    fields = {
        "amount": total_amount,
        "tax_amount": "0",
        "total_amount": total_amount,
        "transaction_uuid": transaction_uuid,
        "product_code": product_code,
        "product_service_charge": "0",
        "product_delivery_charge": "0",
        "signed_field_names": signed_field_names,
        "signature": signature,
        "success_url": f"{settings.BACKEND_BASE_URL}/api/payments/esewa/success/",
        "failure_url": f"{settings.BACKEND_BASE_URL}/api/payments/esewa/failure/",
    }

    return form_url, status_url, fields


def decode_esewa_success_data(data_b64: str) -> dict:
    decoded = base64.b64decode(data_b64).decode("utf-8")
    return json.loads(decoded)


def status_check(status_url: str, product_code: str, total_amount: str, transaction_uuid: str):
    r = requests.get(
        status_url,
        params={
            "product_code": product_code,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
        },
        timeout=15
    )
    r.raise_for_status()
    return r.json()