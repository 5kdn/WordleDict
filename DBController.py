#!/usr/bin/env python3

import os
import re
import sqlite3
import urllib.request
import urllib.parse
import urllib.error
from typing import List, Dict, Tuple, Any

from bs4 import BeautifulSoup


class DBController(object):
    """データベースコントローラ"""
    __base_url = 'https://www.nytimes.com/games/wordle/'
    __headers = {"User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0"}

    def __init__(self, dbpath: str = './dict.sqlite') -> None:
        """constructor
        DBに接続する。
        DBが無ければ作成し、Wordleから単語群を取得する。

        Args:
            dbpath (str, optional): path to database. Defaults to './dict.sqlite'.
        """
        _is_create_DB = False
        self.__dbpath = dbpath

        if not os.path.isfile(dbpath):
            _is_create_DB = True
            self._create_db()
        if _is_create_DB:
            self.update_db()

    def _create_db(self) -> None:
        """Create DB and table.
        """
        with sqlite3.connect(self.__dbpath) as conn:
            cur = conn.cursor()
            queue = """\
CREATE TABLE words(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL
);"""
            cur.execute(queue)
            queue = """\
CREATE TABLE jsversion(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    date TIMESTAMP DEFAULT(STRFTIME('%Y-%m-%d', DATETIME('now','localtime')))
)"""
            cur.execute(queue)
            conn.commit()
            cur.close()

    def search_words(
        self,
        in_: List[str] = [],
        in_not_position: List[Dict[str, List[int]]] = [],
        notin: List[str] = [],
        fixed: str = '') -> List[Any]:
        """DBから条件にあった単語を探す.

        Args:
            in_ (List[str], optional): 単語中に含むことが確定しているアルファベットのリスト (黄). Defaults to [].
            in_not_position (List[Dict[str, List[int]]], optional): 単語中に含むことが確定しているアルファベットが入らない場所. Defaults to [].
            notin (List[str], optional): 単語中に含まないアルファベットのリスト (灰色). Defaults to [].
            fixed (str, optional): 位置を固定するアルファベットのリスト(LIKE方式) (緑). Defaults to ''.

        Raises:
            Exception: エラー

        Returns:
            List[Any]: 条件に一致した単語.
        """
        # 入力のチェック
        if type(in_) == list and len(in_) > 5:
            raise Exception
        if type(in_not_position) == list and len(in_) > 5:
            raise Exception
        if type(notin) == list and len(notin) > 26:
            raise Exception
        if type(fixed) == str and len(fixed) > 5:
            raise Exception

        subquery: List[str] = []
        arg: List[str] = []

        # not in
        if len(notin) > 0:
            subquery.append(' word NOT GLOB ?')
            arg.append(f'*[{"".join(notin)}]*')

        # in
        for i in in_:
            if len(i) != 1 and type(i) == str:
                raise Exception
            subquery.append(' word LIKE ?')
            arg.append(f'%{i}%')

        # fixed position
        if len(fixed) > 0:
            subquery.append(f' word LIKE ?')
            arg.append(fixed)

        # generate query
        query: str = f'SELECT word FROM words'
        if len(subquery) > 0:
            query += " WHERE"
        for i, q in enumerate(subquery):
            prefix: str = ''
            if i != 0:
                prefix = ' AND'
            query += prefix + q
        query += ' ORDER BY word ASC'

        ret: List[Any] = []
        with sqlite3.connect(self.__dbpath) as conn:
            cur = conn.cursor()
            ret = [r for (r,) in cur.execute(query, tuple(arg)).fetchall()]
            if ret == None:
                ret = []
        return ret


    def _get_new_wordlist(self, js_url: str) -> Dict[str, Tuple[str]]:
        """jsファイルからワードリストを抽出する

        Args:
            js_url (str): jsファイルのurl(main.[hash].js)

        Raises:
            Exception: _description_

        Returns:
            Dict[str, Tuple[str]]:
                'in': 正解が含まれる単語のリスト
                'not_in': 正解が含まれないが入力が許可されている単語のリスト
        """
        r_in = re.compile(r'\[(\"(?:[a-z]{5})\",?){1000,5000}\]')
        r_notin = re.compile(r'\[(\"(?:[a-z]{5})\",?){5001,20000}\]')
        req = urllib.request.Request(js_url, headers=self.__headers)
        with urllib.request.urlopen(req) as res:
            body = res.read().decode('utf-8')
            list_in = r_in.search(body)
            list_notin = r_notin.search(body)
            if list_in is None or list_notin is None:
                raise Exception('listがNone')
            in_ = tuple(sorted(list_in.group()[2:-2].split('","')))
            not_in = tuple(sorted(list_notin.group()[2:-2].split('","')))
            return {'in': in_, 'not_in': not_in}

    def _get_js_name(self) -> str:
        """Wordleからjavascriptのファイル名を取得する.

        Raises:
            Exception:

        Returns:
            str: file name of Wordle's javascript.
        """
        soup = None
        req = urllib.request.Request(self.__base_url, headers=self.__headers)
        with urllib.request.urlopen(req) as res:
            soup = BeautifulSoup(res, 'html.parser')
        js_elem = soup.select_one("body > script:nth-of-type(2)")
        if js_elem is None:
            raise Exception
        ret = js_elem['src']
        if type(ret) is not str:
            raise Exception
        return ret

    def _is_same_version(self, hash: str) -> bool:
        """Javascriptのハッシュと記録しているハッシュを確認し、最新かどうかを判定する.

        Args:
            hash (str): jsのハッシュ値 (main.[hash].js)

        Returns:
            bool:
                True: 同一
                False: 不一致
        """
        with sqlite3.connect(self.__dbpath) as conn:
            cur = conn.cursor()
            queue = 'SELECT count(version) FROM jsversion'
            cnt = cur.execute(queue).fetchone()
            if cnt[0] == 0:
                return False
            queue = 'SELECT version FROM jsversion WHERE id=1'
            saved_hash = cur.execute(queue).fetchone()
            if saved_hash != hash:
                return False
        return True

    def update_db(self) -> None:
        # get new wordlist
        js_name: str = self._get_js_name()
        if self._is_same_version(js_name):
            return
        js_url: str = urllib.parse.urljoin(self.__base_url, js_name)
        wordlist = self._get_new_wordlist(js_url)

        # add to DB
        with sqlite3.connect(self.__dbpath) as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM words')
            queue = 'INSERT INTO words (word) values (?)'
            cur.executemany(queue, map(lambda x: (x,), wordlist["in"]))
            queue = 'INSERT INTO jsversion(version) values(?)'
            conn.execute(queue, (js_name,))
            conn.commit()

    def get_version(self) -> str:
        """DBから最新のjsversionを取得する.

        Returns:
            str: 最新のjsversion
        """
        res: str = ''
        with sqlite3.connect(self.__dbpath) as conn:
            cur = conn.cursor()
            queue = 'SELECT version FROM jsversion WHERE id = (select max(id) from jsversion)'
            res = cur.execute(queue).fetchone()[0]
        return res.split('.')[1]
