from flask import Flask, render_template, request, redirect, url_for, flash, session
import pymysql.cursors

app = Flask(__name__)
app.secret_key = 'CITS_Secret_Key_3403'

db_params = {
    'host': 'localhost',
    'user': 'root',
    'password': 'SQLPASSWORD',
    'db': 'CITS3403_CHAT_APP'
}

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request.method)  # Print out the HTTP method used
    if request.method == 'POST':
        try:
            user_details = request.form
            email = user_details['email']
            password = user_details['password']

            connection = pymysql.connect(**db_params)
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
                    user = cursor.fetchone()
            finally:
                connection.close()

            if user:
                session['user'] = user
                print(session['user'])  # Add this line for debugging
                flash('Logged in successfully!', 'success')
                return redirect(url_for('main'))
            else:
                flash('Invalid email or password.', 'danger')
        except Exception as e:
            flash('An error occurred while logging in: {}'.format(str(e)), 'danger')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user_details = request.form
        email = user_details['reg_email']
        password = user_details['reg_password']

        connection = pymysql.connect(**db_params)
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE email = %s", [email])
                user = cursor.fetchone()

                if user:
                    flash('A user with this email already exists.', 'danger')
                else:
                    cursor.execute("INSERT INTO users(email, password) VALUES(%s, %s)", (email, password))
                    connection.commit()
                    flash('Account created successfully! Please log in.', 'success')
                    return redirect(url_for('login'))

        except Exception as e:
            flash('An error occurred while registering the user: {}'.format(str(e)), 'danger')
        finally:
            connection.close()

    return render_template('login.html')

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/main')
def main():
    print(session)  # Add this line for debugging
    if 'user' not in session:
        return redirect(url_for('login'))

    return render_template('main.html', user=session['user'])

@app.route('/guest_login', methods=['POST'])
def guest_login():
    session['user'] = {"username": "Guest"}
    return {"status": "success"}, 200

@app.route('/highscores')
def highscores():
    return render_template('highscore.html')

if __name__ == '__main__':
    app.run(debug=True)