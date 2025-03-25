import json
import jwt
import requests
from jwt.algorithms import RSAAlgorithm
import os

COGNITO_USER_POOL_ID = os.environ["COGNITO_USER_POOL_ID"]
COGNITO_REGION = os.environ["COGNITO_REGION"]
COGNITO_ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"

def get_cognito_public_keys():
    """Fetch Cognito User Pool's public keys"""
    url = f"{COGNITO_ISSUER}/.well-known/jwks.json"
    response = requests.get(url)
    return {key["kid"]: key for key in response.json()["keys"]}

def verify_jwt(token):
    """Verify JWT Token"""
    headers = jwt.get_unverified_header(token)
    public_keys = get_cognito_public_keys()

    if headers["kid"] not in public_keys:
        raise Exception("Invalid token: Key ID not found")

    key = public_keys[headers["kid"]]
    public_key = RSAAlgorithm.from_jwk(json.dumps(key))

    return jwt.decode(token, public_key, algorithms=["RS256"], issuer=COGNITO_ISSUER, options={"verify_aud": False})

def lambda_handler(event, context):
    """Lambda Authorizer"""
    try:
        authorization_token = event.get("authorizationToken", "")
        if authorization_token.startswith("Bearer "):
            token = authorization_token.split("Bearer ")[1]
        else:
            raise ValueError("Authorization token format is incorrect")
        
        claims = verify_jwt(token)

        return {
            "principalId": claims["sub"],
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "execute-api:Invoke",
                        "Effect": "Allow",
                        "Resource": event["methodArn"]
                    }
                ]
            },
            "context": claims
        }
    except Exception as e:
        print(f"Authorization failed: {str(e)}")
        return {
            "principalId": "unauthorized",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "execute-api:Invoke",
                        "Effect": "Deny",
                        "Resource": event["methodArn"]
                    }
                ]
            }
        }
