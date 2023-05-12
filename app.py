from flask import Flask, render_template, request, redirect, url_for, flash
import pymysql.cursors
from flask import session

app = Flask(__name__)

# MySQL configurations
db_params = {
    'host': 'localhost',
    'user': 'root',  
    'password': 'SQLPASSWORD',  
    'db': 'CITS3403_CHAT_APP'  
}

# Secret key for flash messages
app.secret_key = 'CITS_Secret_Key_3403'

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request.method)  # Print out the HTTP method used
    if request.method == 'POST':
        user_details = request.form
        email = user_details['email']
        password = user_details['password']

        # Check if the user exists in the database
        connection = pymysql.connect(**db_params)
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
                user = cursor.fetchone()
        finally:
            connection.close()

        if user:
            # Store the user's information in the session
            session['user'] = user
            flash('Logged in successfully!', 'success')
            return redirect(url_for('main'))
        else:
            flash('Invalid email or password.', 'danger')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user_details = request.form
        email = user_details['reg_email']
        password = user_details['reg_password']

        # Connect to the database
        connection = pymysql.connect(**db_params)
        try:
            with connection.cursor() as cursor:
                # Check if the user already exists in the database
                cursor.execute("SELECT * FROM users WHERE email = %s", [email])
                user = cursor.fetchone()

                if user:
                    flash('A user with this email already exists.', 'danger')
                else:
                    # Insert the new user into the database
                    cursor.execute("INSERT INTO users(email, password) VALUES(%s, %s)", (email, password))
                    connection.commit()
                    flash('Account created successfully! Please log in.', 'success')
                    return redirect(url_for('login'))

        except Exception as e:
            flash('An error occurred while registering the user: {}'.format(str(e)), 'danger')
        finally:
            connection.close()

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/main')
def main():
    if 'user' not in session:
        # User is not logged in
        return redirect(url_for('login'))

    return render_template('main.html')

if __name__ == '__main__':
    app.run(debug=True)







