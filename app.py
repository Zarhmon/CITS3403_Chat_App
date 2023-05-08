from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'your_mysql_user'
app.config['MYSQL_PASSWORD'] = 'your_mysql_password'
app.config['MYSQL_DB'] = 'your_database_name'

mysql = MySQL(app)

# Secret key for flash messages
app.secret_key = 'your_secret_key'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_details = request.form
        email = user_details['email']
        password = user_details['password']

        # Check if the user exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cur.fetchone()
        cur.close()

        if user:
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

        # Check if the user already exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", [email])
        user = cur.fetchone()

        if user:
            flash('A user with this email already exists.', 'danger')
        else:
            # Insert the new user into the database
            cur.execute("INSERT INTO users(email, password) VALUES(%s, %s)", (email, password))
            mysql.connection.commit()
            cur.close()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/main')
def main():
    return render_template('main.html')

if __name__ == '__main__':
    app.run(debug=True)