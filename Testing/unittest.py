import unittest
from flask import session
from app import app

class AppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'CITS_Secret_Key_3403'
        self.app = app.test_client()
        with app.app_context():
            session.clear()

    def test_login_valid_credentials(self):
        response = self.app.post('/login', data={'email': 'test@example.com', 'password': 'password'}, follow_redirects=True)
        self.assertIn(b'Logged in successfully!', response.data)
        self.assertEqual(session['user']['email'], 'test@example.com')

    def test_login_invalid_credentials(self):
        response = self.app.post('/login', data={'email': 'test@example.com', 'password': 'wrong_password'}, follow_redirects=True)
        self.assertIn(b'Invalid email or password.', response.data)
        self.assertNotIn('user', session)

    def test_register_existing_user(self):
        response = self.app.post('/register', data={'reg_email': 'test@example.com', 'reg_password': 'password'}, follow_redirects=True)
        self.assertIn(b'A user with this email already exists.', response.data)
        self.assertNotIn('user', session)

    def test_register_new_user(self):
        response = self.app.post('/register', data={'reg_email': 'newuser@example.com', 'reg_password': 'password'}, follow_redirects=True)
        self.assertIn(b'Account created successfully!', response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Please log in.', response.data)

    def test_logout(self):
        with self.app:
            self.app.post('/login', data={'email': 'test@example.com', 'password': 'password'}, follow_redirects=True)
            response = self.app.get('/logout', follow_redirects=True)
            self.assertIn(b'You have been logged out.', response.data)
            self.assertNotIn('user', session)

    def test_home_redirect(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, 'http://localhost/login')

    def test_main_page_without_login(self):
        response = self.app.get('/main', follow_redirects=True)
        self.assertIn(b'Please log in.', response.data)

    def test_main_page_with_login(self):
        with self.app:
            self.app.post('/login', data={'email': 'test@example.com', 'password': 'password'}, follow_redirects=True)
            response = self.app.get('/main')
            self.assertIn(b'Welcome, test@example.com', response.data)

    def test_guest_login(self):
        response = self.app.post('/guest_login', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"status": "success"', response.data)
        self.assertEqual(session['user']['username'], 'Guest')

    def test_highscores_page(self):
        response = self.app.get('/highscores')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'High Scores', response.data)


if __name__ == '__main__':
    unittest.main()