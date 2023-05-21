import unittest
import pymysql
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from flask import Flask, session
from app import app

class AppTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """ Create a test client, start the web driver, and set up the test table """
        cls.app = app.test_client()
        cls.app.testing = True

        # Configure ChromeOptions
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run Chrome in headless mode (without GUI)
        chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
        chrome_options.add_argument("--disable-dev-shm-usage")  # Disable /dev/shm usage

        # Start ChromeDriver
        cls.driver = webdriver.Chrome(options=chrome_options)

        # Set up the test table
        db_params = {
            'host': 'localhost',
            'user': 'root',
            'password': 'SQLPASSWORD',
            'db': 'CITS3403_CHAT_APP'
        }
        connection = pymysql.connect(**db_params)
        try:
            with connection.cursor() as cursor:
                cursor.execute("CREATE TABLE IF NOT EXISTS test_users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), password VARCHAR(255))")
                cursor.execute("INSERT INTO test_users (email, password) VALUES ('user@example.com', 'password')")
                connection.commit()
        finally:
            connection.close()

    @classmethod
    def tearDownClass(cls):
        """ Quit the web driver and tear down the test table """
        cls.driver.quit()

        # Tear down the test table
        db_params = {
            'host': 'localhost',
            'user': 'root',
            'password': 'SQLPASSWORD',
            'db': 'CITS3403_CHAT_APP'
        }
        connection = pymysql.connect(**db_params)
        try:
            with connection.cursor() as cursor:
                cursor.execute("DROP TABLE IF EXISTS test_users")
                connection.commit()
        finally:
            connection.close()

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_login_valid_credentials(self):
        """ Test login with valid credentials """
        self.driver.get('http://localhost/login')
        email_input = self.driver.find_element_by_name('email')
        password_input = self.driver.find_element_by_name('password')
        submit_button = self.driver.find_element_by_css_selector('button[type="submit"]')

        email_input.send_keys('user@example.com')
        password_input.send_keys('password')
        submit_button.click()

        self.assertEqual(self.driver.current_url, 'http://localhost/main')

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