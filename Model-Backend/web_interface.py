from flask import Flask, request, redirect
app = Flask('web_content_classification')
import zmq, json


@app.route('/')
def home():
    return 'WEB content classification.'


@app.route('/get_topic', methods=['POST'])
def get_topic():
    
    data = request.data
    #text = text.encode("ascii", "ignore")
    print "IN COMMING QUERY: " + data

    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect('tcp://127.0.0.1:5555')
    socket.send(data)
    result = socket.recv()
    return json.dumps(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, threaded=False, debug=False)
