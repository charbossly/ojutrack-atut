import requests
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
# import cv2

from deepface import DeepFace

import pandas as pd
import numpy as np
from flask import send_from_directory

app = Flask(__name__)
CORS(app)


app.config['SESSION_TYPE'] = 'filesystem'

# Dossier où les images téléchargées seront stockées
UPLOAD_FOLDER = 'static/uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Limite de la taille des fichiers (par exemple, 16 Mo)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Types de fichiers autorisés (par exemple, JPG, PNG)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
models = [
  "VGG-Face", 
  "Facenet", 
  "Facenet512", 
  "OpenFace", 
  "DeepFace", 
  "DeepID", 
  "ArcFace", 
  "Dlib", 
  "SFace",
  "GhostFaceNet",
]


#@app.route("/test", methods=['GET'])
def matching(img,path):
    print("img", img)
    print("path", path)

    images = {
    }

    try:
        results = DeepFace.find(
        # img_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test/155839.jpeg",
        # db_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test",
        # img_path ="static/Test/" + img,
         img_path ="static/uploads/" + img,
        #img_path = "static/Test/82_01M18.JPG",
        db_path = path,

        # img2_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test",
        model_name = models[2]
        )
    except ValueError as e:
        # Vérification si l'erreur est liée à la non-détection du visage
        if "Face could not be detected" in str(e):
            print("Nous n'avons pas pu détecter le visage dans une des images.")
            return jsonify({"error": "Nous n'avons pas pu détecter le visage dans une des images."}), 404
        else:
            # Gestion d'autres erreurs possibles
            print(f"Une erreur s'est produite: {e}")
            return jsonify({"error": "Une erreur s'est produite"}), 500

    # results = DeepFace.find(
    # # img_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test/155839.jpeg",
    # # db_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test",
    # # img_path ="static/Test/" + img,
    #  img_path ="static/uploads/" + img,
    # #img_path = "static/Test/82_01M18.JPG",
    # db_path = path,

    # # img2_path = "/home/lunix/Documents/ATUT/Bootcamp/base/MORPH-2/Dataset/Images/Test",
    # model_name = models[2]
    # )

    

    print(results[0]['identity'])
    print(results[0]['distance'])
    images['identity']= results[0]['identity']
    images['distance']= results[0]['distance']
    # for result in results:
    #     print(result.identity)
    #     images.append(result.identity)

    print(type(images))
    #return json.dumps(images)


    data = {
        'distance': ((1-images['distance'])).to_dict(),
        'identity': images['identity'].to_dict()
    }

    

    return [(data['distance'][key], data['identity'][key]) for key in data['distance'].keys()]

@app.route("/")
def test():
    return "<p>It works!</p>"


def comparer_images_histogramme(image1, image2):
    # Calculer l'histogramme des deux images
    hist1 = cv2.calcHist([image1], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    hist2 = cv2.calcHist([image2], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])

    # Normaliser les histogrammes
    cv2.normalize(hist1, hist1)
    cv2.normalize(hist2, hist2)

    # Comparer les histogrammes avec la méthode de corrélation
    score = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
    return score

def chercher_images_similaires(image_cible_path, dossier_images, seuil_similarite=0.7):
    # Charger l'image cible
    image_cible = cv2.imread(image_cible_path)
    
    if image_cible is None:
        print("Erreur : L'image cible n'a pas pu être chargée.")
        return
    
    # Convertir l'image cible en RGB
    image_cible_rgb = cv2.cvtColor(image_cible, cv2.COLOR_BGR2RGB)

    # Liste pour garder les images similaires
    images_similaires = []

    # Parcourir toutes les images du dossier
    for fichier in os.listdir(dossier_images):
        chemin_image = os.path.join(dossier_images, fichier)
        #chemin_image = fichier

        # Vérifier que c'est bien un fichier image
        if os.path.isfile(chemin_image) and fichier.lower().endswith(('.png', '.jpg', '.jpeg')):
        #if fichier.lower().endswith(('.png', '.jpg', '.jpeg')):
            # Charger l'image du dossier
            image_a_comparer = cv2.imread(chemin_image)

            # Convertir en RGB
            image_a_comparer_rgb = cv2.cvtColor(image_a_comparer, cv2.COLOR_BGR2RGB)

            # Comparer l'image avec l'image cible
            score = comparer_images_histogramme(image_cible_rgb, image_a_comparer_rgb)

            # Si le score de similarité est supérieur au seuil (95%)
            if score >= seuil_similarite:
                images_similaires.append([chemin_image, score])
                print(f"Image similaire trouvée : {fichier} avec un score de {score * 100:.2f}%")

    # Afficher les résultats
    if images_similaires:
        print(f"{len(images_similaires)} images similaires trouvées avec une similarité supérieure à {seuil_similarite*100}%.")
        #print(images_similaires)
        # for image in images_similaires:
        #     img1= cv2.imread(image[0])
        #     plt.imshow(img1[:,:,::-1])
        #     plt.show()
    else:
        print("Aucune image similaire trouvée.")
    
    return images_similaires


# Fonction pour vérifier si l'extension est autorisée
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def select_score(array_items,score):
    scores = []

    for item in array_items:
        if item['score'] >= score:
            scores.append(item)
            
@app.route('/api/upload_image', methods=['POST'])
def upload_image():

    # Vérifier si le fichier est dans la requête
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    # Vérifier si le fichier a un nom valide et une extension autorisée
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        # Sauvegarder le fichier dans le dossier UPLOAD_FOLDER
        file_path = "static/uploads/" +  file.filename
        # file_path = "static/uploads".join(app.config['UPLOAD_FOLDER'], file.filename)

        file.save(file_path)

        print(file_path)

        infos = merge(file_path.split("/")[-1])

        #return jsonify({"message": "Image uploaded successfully", "infos": "resutats"}), 200
        return infos
    
    return jsonify({"error": "File type not allowed"}), 400



    


# @app.route('/api/merge/<int:faceid>', methods=['GET'])
#def merge(faceid: str):
#@app.route('/api/merge', methods=['GET'])
def merge(faceid):
    #faceid = session["image_path"]
    image_cible = faceid
    # dossier_images = "static/Test"
    dossier_images = "static/Test01"
    #similar_images = chercher_images_similaires(image_cible, dossier_images, seuil_similarite=0.75)
    
    similar_images = matching(image_cible, dossier_images)
    
    # Remplacez 'fichier.csv' par le chemin de votre fichier CSV
    df1 = pd.read_csv("static/dataset1.csv")
    df2 = pd.read_csv("static/dataset2.csv")
    merged_items =[] 
    
    
    if similar_images:
        #images.append("test")
        for image in similar_images:
            #images.append(image)
            # Chercher l'élément par ID
            #img = image[0].split("/")[-1]

           # if image == 200:
            img = image[1].split("/")[-1]  # Assuming `response[0]` contains the image URL
            #else:
                
                # error_message = "Pas d'image similaire"
                # print(f"Error: {error_message}")  # Print error to the console
                # return jsonify({"error": error_message}), 404
        
            

           # img = image[1].split("/")[-1]
            

            item1 = df1[df1['image_paths'] == img].to_dict(orient='records')
            
            item2 = df2[df2['image_paths'] == img].to_dict(orient='records')
           
            print(df1['image_paths'])
            print("img", img)
            print("item1", item1)
            print("item2", item2)
           
            if item1 and item2:
                merged_item = {**item1[0], **item2[0]}
                merged_item['score'] = image[0]
                merged_items.append(merged_item)
            elif item1:
                merged_item = {**item1[0]}
                merged_item['score'] = image[0]
                merged_items.append(merged_item)
            elif item2:
                merged_item = {**item2[0]}
                merged_item['score'] = image[0]
                merged_items.append(merged_item)

            # else:
            #     return jsonify({"error": "Pas d'information"}), 404
    else:        
        return jsonify({"error": "Pas d'mage similaire"}), 404


    
    # Retourner les données sous forme de JSON
    #return jsonify(merged_item)
    print("merged_items", merged_items)
    return jsonify(merged_items)

@app.route('/image/<filename>', methods=['GET'])
def image(filename):
    # return send_from_directory('static/Test', filename)
    return send_from_directory('static/Test01', filename)



if __name__ == '__main__':
    # app.run(host='192.168.1.101', port=5000)
    app.run(debug=True)