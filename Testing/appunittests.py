import unittest
from flask import Flask, session
from app import app

class AppTestCase(unittest.TestCase):

    def setUp(self):
        """ Create a test client """
        self.app = app.test_client()
        self.app.testing = True

    def tearDown(self):
        pass

    def test_login_valid_credentials(self):
        """ Test login with valid credentials """
        response = self.app.post('/login', data={'email': 'user@example.com', 'password': 'password'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/main')

    def test_login_invalid_credentials(self):
        """ Test login with invalid credentials """
        response = self.app.post('/login', data={'email': 'user@example.com', 'password': 'wrong_password'})
        self.assertEqual(response.status_code, 200) 
        self.assertIn(b'Invalid email or password.', response.data) 

    def test_register_existing_email(self):
        """ Test registration with an existing email """
        response = self.app.post('/register', data={'reg_email': 'user@example.com', 'reg_password': 'password'})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'A user with this email already exists.', response.data)

    def test_register_new_email(self):
        """ Test registration with a new email """
        response = self.app.post('/register', data={'reg_email': 'newuser@example.com', 'reg_password': 'password'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/login')

    def test_logout(self):
        """ Test logout """
        with self.app.session_transaction() as session:
            session['user'] = {'id': 1, 'email': 'user@example.com', 'password': 'password'}

        response = self.app.get('/logout')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/login')

    def test_home_redirect(self):
        """ Test home page redirection """
        response = self.app.get('/')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/login')

    def test_main_page_authenticated(self):
        """ Test accessing the main page when authenticated """
        with self.app.session_transaction() as session:
            session['user'] = {'id': 1, 'email': 'user@example.com', 'password': 'password'}

        response = self.app.get('/main')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'user@example.com', response.data)

    def test_main_page_unauthenticated(self):
        """ Test accessing the main page when not authenticated """
        response = self.app.get('/main')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/login')

    def test_guest_login(self):
        """ Test guest login """
        response = self.app.post('/guest_login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"status": "success"', response.data)

    def test_highscores(self):
        """ Test accessing the highscores page """
        response = self.app.get('/highscores')
        self.assertEqual(response.status_code, 200)

    def test_store_score_authenticated(self):
        """ Test storing a score when authenticated """
        with self.app.session_transaction() as session:
            session['user'] = {'email': 'user@example.com'}

        response = self.app.post('/store_score', json={'score': 100})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"status": "success"', response.data)

    def test_store_score_unauthenticated(self):
        """ Test storing a score when not authenticated """
        response = self.app.post('/store_score', json={'score': 100})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'"status": "error"', response.data)

if __name__ == '__main__':
    unittest.main()