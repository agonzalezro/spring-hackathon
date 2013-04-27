spring-hackathon
================

This project was created by `@eloycoto <http://twitter.com/eloycoto>`_ and me
for the Sprint Hackathon @ Google campus.

We are using three of the services from the organizers:

- `openstreetmap <http://openstreetmap.org>`_ for showing the maps.
- `twilio <http://twilio.org>` for making the call.
- http://data.police.uk/api to get the information to be displayed.

Usage
-----

You will need to create a file `settings/secret.py` with an object like this::

    class SecretConfig(object):
        ...

And the following attributes:

`TWILIO_ACCOUNT`
    your twilio account sid.
`TWILIO_TOKEN`
    you twilio account token.
`TWILIO_NUMBER`
    the number that you want to show on the from field.
