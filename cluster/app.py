import os
import time
import datetime
import yaml
import psycopg2
from pathlib import Path
from kubernetes import client, config
from logging import getLogger
import logging

from flask import Flask, request, make_response, jsonify

from flask.wrappers import Response

app = Flask(__name__)

# ログレベルを INFO に変更
logging.basicConfig(level=logging.INFO)

# limit upload file size is 10MB
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

@app.route('/')
def hello():
    name = "Hello World"
    return name

@app.route('/good')
def good():
    name = "Good"
    return name

@app.route('/api/health')
def health():
    return Response(status=200)

# Create new database for new keycloak 
def create_database(new_database_name):
    host     = os.getenv('DB_HOST')
    port     = os.getenv('DB_PORT')
    user     = os.getenv('DB_USER')
    dbname   = os.getenv('DB_ROOTNAME')
    password = os.getenv('DB_PASSWORD')
    keycloakUser = os.getenv('DB_KEYCLOAK_USER')
    try:
        conn = psycopg2.connect(
            host = host,
            port = str(port),
            user = user,
            password = password,
            database = dbname)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(f'CREATE DATABASE {new_database_name};')
        cur.execute(f'GRANT ALL PRIVILEGES ON DATABASE {new_database_name} TO {keycloakUser};')
    except Exception as e:
        logger.error(e)
        raise e
    finally:
        cur.close()
        conn.close()

# Deploy Keycloak worklaod and service via k8s rest api
def deploy_instance():
    logger.info("start deploy")
    namespace = os.getenv('K8S_NAMESPACE')
    config.load_incluster_config()
    k8s_apps_v1 = client.AppsV1Api()
    k8s_v1 = client.CoreV1Api()
    # Load yaml files
    try:
        with open('./template/deployment.yaml', 'r') as yml:
            deployment = yaml.safe_load(yml)
            print(deployment)
            resp = k8s_apps_v1.create_namespaced_deployment(
                body=deployment, namespace=namespace)
            print("Deployment created. status='%s'" % resp.metadata.name)
        with open('./template/service.yaml', 'r') as yml:
            service = yaml.safe_load(yml)
            print(service)
            resp = k8s_v1.create_namespaced_service(
                body=service, namespace=namespace)
            print("Service created. status='%s'" % resp.metadata.name)
    except Exception as e:
        logger.error(e)
        raise e

# POST
@app.route('/api/instance/keycloak')
def create_instance():
    today = datetime.date.today()
    now = datetime.datetime.now()
    instanceName = 'keycloak' + str(today) + '-' + str(now.hour) + ':' + str(now.minute)
    isCreateDb = os.getenv('IS_CREATE_DB')
    if isCreateDb == True:
        create_database(instanceName)
    deploy_instance()

# # GET
# @app.route('/api/instance/keycloak')
# def get_instances():
#     deploy_instance()
#     return Response(status=200)

if __name__ == "__main__":
    logger = getLogger()

    app.run(debug=True,  host='0.0.0.0', port=8080)
