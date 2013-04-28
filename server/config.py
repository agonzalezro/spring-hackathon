import os


class Config(object):
    # KeyError will be raised if this variables doesn't exist
    TWILIO_ACCOUNT = os.environ['TWILIO_ACCOUNT']
    TWILIO_TOKEN = os.environ['TWILIO_TOKEN']
    TWILIO_NUMBER = os.environ['TWILIO_NUMBER']

    def __init__(self):
        server_name = os.environ.get('SERVER_NAME')
        if server_name:
            self.SERVER_NAME = server_name
