import json

from flask import Flask
from flask import Response
from flask import jsonify
from flask import render_template
from twilio.rest import TwilioRestClient


from scrappers.police import get_filename as get_police_json_filename
from settings import secret

app = Flask(__name__)
app.config.from_object(secret.SecretConfig())


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/police')
def police():
    """Filter the data from the dumped json file into this format:

        [
            {
                'name': 'the_name',
                'latitude': 'the_latitude',
                'longitude': 'the_latitude',
                'telephone': 'the_telephone',
                'email': 'the_email'
            },
            ...
        ]

    .. note:: Some data will be null.
    """
    with open(get_police_json_filename()) as stream:
        stations = json.loads(stream.read())

    result_stations = []
    for station in stations:
        result_stations.append({
            'name': station.get('name'),
            'telephone': station['contact_details'].get('telephone'),
            'email': station['contact_details'].get('email'),
            'latitude': station['centre'].get('latitude'),
            'longitude': station['centre'].get('longitude')
        })
    return jsonify(results=result_stations)


@app.route('/call/<int:number>', methods=['POST'])
def call(number):
    client = TwilioRestClient(
        app.config['TWILIO_ACCOUNT'], app.config['TWILIO_TOKEN']
    )

    call = client.calls.create(
        to=number,
        from_=app.config['TWILIO_NUMBER'],
        url="http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient"
    )
    return call.sid


@app.route('/callback/<string:number>')
def send_xml_data(number):
    xml_data = render_template('callback_twilio.html', number=number)
    return Response(xml_data, mimetype='text/xml')

if __name__ == '__main__':
    app.debug = True
    app.run()
