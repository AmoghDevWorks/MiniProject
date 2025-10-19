from flask import Flask, jsonify

# Initialize the Flask app
app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return "Hello, Flask!"

# API route returning JSON
@app.route('/api/data')
def api_data():
    return jsonify({"message": "This is a JSON response"})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
