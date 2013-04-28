import json
import os

from flask import abort
from flask import Flask
from flask import Response
from flask import render_template
from flask import request
from flask import url_for
from twilio.rest import TwilioRestClient


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

    It can be filtered with the `limit` and `offset` arguments.

    .. note:: Some data will be null.
    """
    def _get_police_json_filename():
        return os.path.join(
            os.path.dirname(__file__), '..', 'data', 'police.json'
        )

    limit = request.args.get('limit')
    if limit:
        try:
            limit = int(limit)
        except ValueError:
            abort(403)

    offset = request.args.get('offset')
    if offset and limit:
        try:
            offset = int(offset)
        except ValueError:
            abort(403)
    elif offset:
        # Offset can just be used with the limit option
        abort(403)

    with open(_get_police_json_filename()) as stream:
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

    # Yes... we could filter this before load all the json data in a dict
    if offset:
        result_stations = result_stations[offset:]

    if limit:
        result_stations = result_stations[:limit]

    return Response(
        json.dumps(result_stations),
        mimetype='application/json'
    )


@app.route('/call', methods=['POST'])
def call():
    """Make a call from twilio. For that you will need to post this:

        - from: the number of the client that is calling.
        - to: the number of the station that you want to call.

    """
    client = TwilioRestClient(
        app.config['TWILIO_ACCOUNT'], app.config['TWILIO_TOKEN']
    )
    #print request.get('from')
    call = client.calls.create(
        to=request.form['to'],  # who to call?
        from_=app.config['TWILIO_NUMBER'],
        url= 'http://acalustra:5000{}'.format(url_for('callback',number=request.form['from']))  # our user number
    )
    return call.sid


@app.route('/callback/<string:number>')
def callback(number):
    """Generate a XML for twilio that will allow it to call the user back."""
    xml_data = render_template('callback_twilio.xml', number=number)
    return Response(xml_data, mimetype='text/xml')


if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
