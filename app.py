from flask import Flask, render_template, request, redirect, url_for, flash, session
import pymysql.cursors
import traceback

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
                session['user'] = {
                    'id': user[0],
                    'email': user[1],
                    'password': user[2]
                }
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
    connection = pymysql.connect(**db_params)
    try:
        with connection.cursor() as cursor:
            # Retrieve the top 20 highest scores with corresponding emails
            sql_query = "SELECT email, score FROM game_scores ORDER BY score DESC LIMIT 20"
            cursor.execute(sql_query)
            highscores = cursor.fetchall()

        usernames = []
        for highscore in highscores:
            email = highscore[0]
            username = email.split('@')[0]  # Extract the username from the email
            usernames.append(username)

    finally:
        connection.close()

    return render_template('highscore.html', highscores=highscores, usernames=usernames)


# added this for storing scores 

@app.route('/store_score', methods=['POST'])
def store_score():
    try:
        print(request.data)  # Print the raw request data
        print(request.json)  # Print the parsed JSON data
        # Retrieve data from the POST request
        data = request.get_json()
        print(data)
        score = data.get('score')
        user = session.get('user')
        print(f"Session data: {session}")  # Print the session data for debugging

        if user and isinstance(user, dict) and 'email' in user:
            user_email = user['email']
            print(f"User email: {user_email}")  # Print the user's email for debugging
            print(f"Score: {score}")  # Print the score for debugging

            connection = pymysql.connect(**db_params)
            try:
                with connection.cursor() as cursor:
                    # Insert new score into the database
                    sql_query = "INSERT INTO game_scores (email, score) VALUES (%s, %s)"
                    cursor.execute(sql_query, (user_email, score))
                    connection.commit()
                return {"status": "success"}, 200
            except Exception as e:
                traceback.print_exc()  # Print the exception traceback
                return {"status": "error", "message": str(e)}, 400
            finally:
                connection.close()
        else:
            return {"status": "error", "message": "User session data is invalid or incomplete."}, 400
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}, 400


if __name__ == '__main__':
    app.run(debug=True)