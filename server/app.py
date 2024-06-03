from config import create_app,db

app=create_app()

@app.route('/')
def Home():
    return "Repay API"

if __name__ == '__main__':
    app.run(port=5555, debug=True)