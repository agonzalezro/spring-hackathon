import json
import unittest

from .. import main


class MainTestCase(unittest.TestCase):
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

    def test_police_json_with_limits(self):
        """If limits are added on the query params, the json should be filtered
        like the limits say.
        """
        response = self.client.get('/police?limit=100')
        stations = json.loads(response.data)

        self.assertTrue(len(stations) == 100)

    def test_police_json_with_limit_not_being_int(self):
        """If the limit is not an integer, a 400 response will be raised."""
        response = self.client.get('/police?limit=breakit')

        self.assertEqual(response.status_code, 400)

    def test_police_json_with_offset_but_no_limit(self):
        """Test that if offset is sent, but no limit, a 400 is raised."""
        response = self.client.get('/police?offset=1')

        self.assertEqual(response.status_code, 400)

    def test_police_json_with_offset_non_integer(self):
        """If the offset is not an integer a 400 will be raised"""
        response = self.client.get('/police?offset=breakit&limit=1')

        self.assertEqual(response.status_code, 400)

    def test_police_json_with_offset_and_limit(self):
        """Test that if the args are sent ok, the response is a list.

        We are checking that the offset is working, making 2 request. In the
        first request, the second element should be the same that the one
        with offset=1.

        """
        response1 = self.client.get('/police?limit=2')
        response2 = self.client.get('/police?limit=1&offset=1')

        expected_result = json.loads(response1.data)[1]
        self.assertEqual(json.loads(response2.data)[0], expected_result)
