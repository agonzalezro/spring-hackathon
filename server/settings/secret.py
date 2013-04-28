import socket


class SecretConfig(object):
    TWILIO_ACCOUNT = 'AC7387657bfd3273c3d368260420daba86'
    TWILIO_TOKEN = 'eb8f07c320a2ca8fc2067cef9975e889'
    TWILIO_NUMBER = '+441702806169'

    def __init__(self):
        hostname = socket.gethostname()
        is_local = hostname in ['Alexs-MacBook-Pro.local', 'foeric-ep01.local']
        if not is_local:
            self.SERVER_NAME = 'spring-hackaton.herokuapp.com'
