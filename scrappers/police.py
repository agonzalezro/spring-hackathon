import json
import logging
from urlparse import urljoin
import os

import requests


logger = logging.getLogger(__file__)


API_URL = 'http://data.police.uk/api/'
FORCES_URL = urljoin(API_URL, 'forces')
NEIGHBOURHOODS_BASE_URL = urljoin(API_URL, '{force_id}/neighbourhoods')
SPECIFIC_NEIGHBOURHOOD_BASE_URL = urljoin(
    API_URL, '{force_id}/{neighbourhood_id}'
)


def forces_ids():
    forces = requests.get(FORCES_URL)

    for force in json.loads(forces.content):
        yield force['id']


def neighbourhoods_ids(force_id):
    url = NEIGHBOURHOODS_BASE_URL.format(force_id=force_id)

    neighbourhoods = requests.get(url)
    for neighbourhood in json.loads(neighbourhoods.content):
        yield neighbourhood['id']


def neighbourhood_info(force_id, neighbourhood_id):
    url = SPECIFIC_NEIGHBOURHOOD_BASE_URL.format(
        force_id=force_id,
        neighbourhood_id=neighbourhood_id
    )

    neighbourhood = requests.get(url)

    return neighbourhood.content


def write_police_json_to_stream(stream=None):
    """You can use a response as a stream, but this API calls will take a long
    time, so, I don't recommend this solution.

    """
    chars = 0
    stream.write('[')

    for force_id in forces_ids():
        for neighbourhood_id in neighbourhoods_ids(force_id):
            info = neighbourhood_info(force_id, neighbourhood_id)
            stream.write(info)
            stream.write(',')

            chars += len(info) + 1  # For the comma

    # TODO (agonzalezro): didn't try, perhaps works, perhaps doesn't :D
    stream.seek(chars)  # Remove last comma
    stream.write(']')


def get_filename():
    return os.path.join(
        os.path.dirname(__file__), '..', 'data', 'police.json'
    )


if __name__ == '__main__':
    logger.info('Starting scrapping @ police...')

    filename = get_filename()
    with open(filename, 'w') as stream:
        write_police_json_to_stream(stream)

    logger.info('Finished police scrapping, saved file at {}'.format(file))
