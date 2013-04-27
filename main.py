from flask import Flask
from flask import jsonify
from flask import render_template
from twilio.rest import TwilioRestClient
from flask import Response


from settings import secret

app = Flask(__name__)
app.config.from_object(secret.SecretConfig())


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/police')
def police():
    return 'todo'


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

@app.route('/callback/<string:number>', methods=['POST','GET'])
def send_xml_data(number):
    xmlData =  render_template('callback_twilio.html', number=number)
    return Response(xmlData, mimetype='text/xml')

if __name__ == '__main__':
    app.debug = True
    app.run()
