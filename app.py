#!/usr/bin/env python3

import os
from typing import List, Dict

from flask import Flask, render_template, request, jsonify, redirect, abort

from DBController import DBController


dbc = DBController('./dict.sqlite')
app = Flask(__name__,
            static_folder='./static/',
            static_url_path='',
            template_folder='./templates/'
            )


""" Rooting. """
@app.route('/')
def index():
    version = dbc.get_version()
    words = dbc.search_words()
    return render_template('index.html', version=version, words=words)


@app.route('/search', methods=['POST'])
def search_words():
    if request.headers['Content-Type'] != 'application/json':
        jsonify(res='error'), 400
    form = request.json
    if form == None:
        words = dbc.search_words()
        res = {
            'result': words,
            'option': ''
        }
        return jsonify(res), 200

    in_: List[str] = form['in'] if 'in' in form else []
    in_not_position: List[Dict[str, List[int]]] = form['in_not_positions'] if 'in_not_positions' in form else []
    notin: List[str] = form['not_in'] if 'not_in' in form else []
    fixed: str = form['fixed'] if 'fixed' in form else ''
    words = dbc.search_words(in_, in_not_position, notin, fixed)
    res = {
        'result': words,
        'option': ''
    }
    return jsonify(res), 200


@app.route('/update')
def dbupdate():
    """Force update database
    """
    dbc.update_db()
    return redirect('/')


# static files ---
@app.route('/css/<name>.css')
def css(name: str):
    """Stylesheet."""
    fpath: str = os.path.join('.', 'templates', 'css', f'{name}.css')
    if not os.path.isfile(fpath):
        return abort(404)
    with open(fpath, 'r', encoding='utf-8') as f:
        return f.read(), 200, {"Content-Type": 'text/css; charset=utf-8'}


@app.route('/js/<script>.js')
def js(script: str):
    """Javascript."""
    fpath: str = os.path.join('.', 'templates', 'js', f'{script}.js')
    if not os.path.isfile(fpath):
        return abort(404)
    with open(fpath, 'r', encoding='utf-8') as f:
        return f.read(), 200, {"Content-Type": 'text/javascript; charset=utf-8'}


if __name__ == "__main__":
    app.run()
