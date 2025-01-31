from google.cloud import storage
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file('./keys/buzz-market-440617-6f1d1c2dd4a8.json')
storage_client = storage.Client(credentials=credentials)

bucket_name = "buzz_market_images"
bucket_folder = 'listings'

def upload(name, bytes):

    try:
        bucket = storage_client.get_bucket(bucket_name)

        blob = bucket.blob(f'{bucket_folder}/{name}')
        
        blob.upload_from_string(bytes)

    except Exception as e:
        print(f"{e}")

def download(img_name):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(f"{bucket_folder}/{img_name}")  # Construct full path of file in the bucket
        
        k = blob.download_as_bytes()

        return k

    except Exception as e:
        print(f"{e}")


