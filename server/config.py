import os


class Config(object):
    # KeyError will be raised if this variables doesn't exist
    TWILIO_ACCOUNT = os.environ['TWILIO_ACCOUNT']
    TWILIO_TOKEN = os.environ['TWILIO_TOKEN']
    TWILIO_NUMBER = os.environ['TWILIO_NUMBER']
    SERVER_NAME = os.environ['SERVER_NAME']
