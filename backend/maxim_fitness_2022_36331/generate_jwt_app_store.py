from datetime import datetime, timedelta
from time import time, mktime
import jwt
import requests
import stripe
from django.conf import settings
from djstripe.settings import STRIPE_SECRET_KEY


def get_app_store_jwt_token():
    try:
        dt = datetime.now() + timedelta(minutes=19)

        headers = {
            "alg": "ES256",
            "kid": settings.APPLE_APP_STORE_KEY_ID,
            "typ": "JWT",
        }

        payload = {
            "iss": settings.APPLE_APP_STORE_ISSUER_ID,
            "iat": int(time()),
            "exp": int(mktime(dt.timetuple())),
            "aud": "appstoreconnect-v1",
            "bid": "com.orumtraining"
        }


        gen_jwt = jwt.encode(payload, settings.APPLE_APP_STORE_PRIVATE_KEY, algorithm="ES256", headers=headers)

        return gen_jwt.decode()
    except Exception as e:
        print(str(e))



def get_app_store_subscription_status(transaction_id, jwt_token):
    try:
        if settings.APPLE_STORE_LIVE_MODE:
            url = f"https://api.storekit.itunes.apple.com/inApps/v1/subscriptions/{transaction_id}/"
        else:
            url = f"https://api.storekit-sandbox.itunes.apple.com/inApps/v1/subscriptions/{transaction_id}/"

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Bearer {jwt_token}'
        }

        response = requests.get(url, headers=headers)
        res = response.json()
        if res:
            status = res.get("data")[0].get("lastTransactions")[0].get("status")
            if status and status == 2:
                return {"success":  True}
        return {"success": False}
    except Exception as e:
        return {"success": False, "error": str(e)}


def check_subscription_status(subscription_id):
    try:
        stripe.api_key = STRIPE_SECRET_KEY
        status = stripe.Subscription.retrieve(subscription_id).status

        # Extract and return the status
        if status == 'active':
            return {"success": True}
        else:
            return {"success": False}
    except Exception as e:
        return {"success": False, "error": str(e)}