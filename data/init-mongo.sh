#!/bin/bash

mongoimport --host=localhost --db=db_mongo_inmunobio --collection=db_mongo_inmunobio --file=/baseMongo.json --jsonArray
