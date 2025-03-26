To Make
1.Download Ollama:
https://ollama.com/

2.Run ollama and open cmd to install the model
ollama run deepseek-r1:14b

3.Close the terminal after the model is intalled and running

4.Start the Ollama server
ollama serve

5.Run run.bat
 - This will keep generating questions until you stop the server/program.

To Upload:
1.Create a file dbconfig.py with the following variable
    db_config = {
        "host": "HOSTNAME",
        "user": "USERNAME",
        "password": "PASSWORD",
        "database": "DBNAME"
    }
2.Run upload.py to add to Database