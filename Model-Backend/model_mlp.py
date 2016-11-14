'''Trains and evaluate a simple MLP
on the news20 dataset:
http://www.cs.cmu.edu/afs/cs.cmu.edu/project/theo-20/www/data/news20.html.
'''

from __future__ import print_function
import numpy as np
np.random.seed(1337)

from keras.datasets import reuters
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation
from keras.utils import np_utils
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils.np_utils import to_categorical
from random import shuffle
import keras
import json, os, sys
import zmq



class WebProcessModel():
    def load_data(self):
        BASE_DIR = '.'
        TEXT_DATA_DIR = BASE_DIR + '/20_newsgroup/'
        MAX_NB_WORDS = self.max_words
        VALIDATION_SPLIT = 0.2
        print('Processing text dataset')

        texts = []  # list of text samples
        labels_index = {}  # dictionary mapping label name to numeric id
        labels = []  # list of label ids
        for name in sorted(os.listdir(TEXT_DATA_DIR)):
            path = os.path.join(TEXT_DATA_DIR, name)
            if os.path.isdir(path):
                label_id = len(labels_index)
                print(label_id, name)
                labels_index[name] = label_id
                for fname in sorted(os.listdir(path)):
                    if fname.isdigit():
                        fpath = os.path.join(path, fname)
                        f = open(fpath)
                        texts.append(f.read())
                        f.close()
                        labels.append(label_id)

        print('Found %s texts.' % len(texts))

        # finally, vectorize the text samples into a 2D integer tensor
        self.tokenizer = Tokenizer(nb_words=MAX_NB_WORDS)
        self.tokenizer.fit_on_texts(texts)
        sequences = self.tokenizer.texts_to_sequences(texts)

        self.word_index = self.tokenizer.word_index
        print('Found %s unique tokens.' % len(self.word_index))

        print('Shuffling the data...')
        data = []
        labels_shuf = []
        index_shuf = range(len(sequences))
        shuffle(index_shuf)
        for i in index_shuf:
            data.append(sequences[i])
            labels_shuf.append(labels[i])
            
        nb_validation_samples = int(VALIDATION_SPLIT * len(data))
    
        x_train = data[:-nb_validation_samples]
        y_train = labels_shuf[:-nb_validation_samples]
        x_val = data[-nb_validation_samples:]
        y_val = labels_shuf[-nb_validation_samples:]

        return (x_train, y_train), (x_val, y_val)

    def __init__(self):
        max_words = 1000
        self.max_words = max_words
        batch_size = 32
        nb_epoch = 50

        print('Loading data...')
        (X_train, y_train), (X_test, y_test) = self.load_data()
        
        print(len(X_train), 'train sequences')
        print(len(X_test), 'test sequences')
        
        nb_classes = np.max(y_train)+1
        print(nb_classes, 'classes')

        print('Vectorizing sequence data...')
        X_train = self.tokenizer.sequences_to_matrix(X_train, mode='binary')
        X_test = self.tokenizer.sequences_to_matrix(X_test, mode='binary')

        print('X_train shape:', X_train.shape)
        print('X_test shape:', X_test.shape)

        print('Convert class vector to binary class matrix (for use with categorical_crossentropy)')
        print(y_train[4])
        Y_train = np_utils.to_categorical(y_train, nb_classes)
        Y_test = np_utils.to_categorical(y_test, nb_classes)
        print('Y_train shape:', Y_train.shape)
        print('Y_test shape:', Y_test.shape)

        print('Building self.model...')
        self.model = Sequential()
        self.model.add(Dense(512, input_shape=(max_words,)))
        self.model.add(Activation('sigmoid'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(nb_classes))
        self.model.add(Activation('softmax'))        
        self.model.compile(loss='categorical_crossentropy',
                      optimizer='adam',
                      metrics=['accuracy'])
    
        history = self.model.fit(X_train, Y_train,
                            nb_epoch=nb_epoch, batch_size=batch_size,
                            verbose=1, validation_split=0.1)
        score = self.model.evaluate(X_test, Y_test,
                               batch_size=batch_size, verbose=1)

        print('Test score:', score[0])
        print('Test accuracy:', score[1])


    def get_text_sequence(self, text):
        return self.tokenizer.texts_to_sequences([text])


    def get_predict(self, text, id):
        text_seq = self.get_text_sequence(text)
        X = self.tokenizer.sequences_to_matrix(text_seq, mode='binary')
        Y = self.model.predict(X)
        print(Y)
        result = Y.tolist()[0]
        tuple_result = [(result[idx], idx) for idx in xrange(len(result))]
        tuple_result.sort(reverse=True)
        
        result_json = {
            'id': id,
            'text': text,
            'topics': [
                {
                    'topic': str(tuple_result[0][1]),
                    "score": str(tuple_result[0][0])
                },
                {
                    'topic': str(tuple_result[1][1]),
                    'score': str(tuple_result[1][0])
                },
                {
                    'topic': str(tuple_result[2][1]),
                    'score': str(tuple_result[2][0])
                }
            ]
        }

        return json.dumps(result_json)

if __name__ == '__main__':
    web_model = WebProcessModel()
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind('tcp://127.0.0.1:5555')
    while True:
        data = socket.recv()
        try:
            jsondata = json.loads(data)
        except:
            print("Malformed JSON: \n%s"%(data))
            jsondata = {"text": "NA", "id": 0}
        text = jsondata["text"]
        text = text.encode("ascii", "ignore")
        id = jsondata["id"]
        print(id, text)
        socket.send(web_model.get_predict(text, id))
        
