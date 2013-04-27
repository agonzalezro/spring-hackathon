import json
import unittest

from .. import main


class FlaskrTestCase(unittest.TestCase):
    def setUp(self):
        self.client = main.app.test_client()

    def test_index(self):
        """Test that the index is returning a 200 status code.

        .. note:: This is a crappy test just to check that the templates are
            in a proper place.

        """
        response = self.client.get('/')

        self.assertEqual(response.status_code, 200)

    def test_police_json(self):
        """Assert that the police handler is returning a list with proper
        results.

        """
        response = self.client.get('/police')
        stations = json.loads(response.data)

        self.assertIsInstance(stations, list)
        self.assertTrue(len(stations) > 0)
