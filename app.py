from flask import Flask, request, jsonify, render_template  # permite manejar archivos json
from pymongo import MongoClient  # Conectarnos a la BDD

app = Flask(__name__)  # Definir el nombre de nuestra aplicacion

# Credenciales de la BDD
mongo_uri = "mongodb+srv://lsagnay:Ur9EcG84r3GJNegi@cluster0.ljtbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client['espe']
students_collection = db['estudiantes']

@app.route('/')
def home():
    return render_template('index.html')

# Definición de rutas
@app.route('/students', methods=['GET'])  # la ruta con el método GET
def get_students():
    students = list(students_collection.find({}, {'_id': 0}))
    return jsonify(students)


@app.route('/students/<student_id>', methods=['GET'])
def get_students_by_id(student_id):
    student = students_collection.find_one({"student_id": student_id}, {'_id': 0})
    if student:
        return jsonify(student)
    else:

        return jsonify({"message": "Estudiante no encontrado en la BDD"}), 404

@app.route('/students/', methods=['POST'])
def add_student():
    student = request.json
    if not student.get('student_id') or students_collection.find_one({"student_id": student["student_id"]}):
        return jsonify({"message": "ID de estudiante es obligatorio y debe ser único"}), 400

    students_collection.insert_one(student)
    return jsonify({"message": "Estudiante insertado"}), 201

@app.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    student = request.json
    result = students_collection.update_one({"student_id": student_id},{"$set":student})
    
    if result.modified_count:
        return jsonify({"message": "Estudiante actualizado"}),200
    else:
        return jsonify({"message": "No se pudo encontrar al estudiante"}),404


@app.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    result = students_collection.delete_one({"student_id": student_id})

    if result.deleted_count:
        return jsonify({"message": "Estudiante eliminado de la BDD"}), 200
    else:
        return jsonify({"message": "No se pudo encontrar un estudiante"}), 404


if __name__ == '__main__':
    app.run(debug=True)
