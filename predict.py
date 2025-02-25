import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
with open('models/blood_model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get the file from the request
        file = request.files['file']
        
        # Read the CSV file
        data = np.genfromtxt(file, delimiter=',', skip_header=1)
        
        # Make prediction
        prediction = model.predict(data.reshape(1, -1))
        probability = model.predict_proba(data.reshape(1, -1))[0][1]
        
        return jsonify({
            'prediction': 'Positive' if prediction[0] == 1 else 'Negative',
            'probability': float(probability)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)