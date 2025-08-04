from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient
from scraper import scrape_deal

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
db = client.dealdetector

@app.route('/')
def index():
    deals = list(db.deals.find())
    return render_template('index.html', deals=deals)

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        url = request.form['url']
        deal = scrape_deal(url)
        if deal:
            db.deals.insert_one(deal)
        return redirect(url_for('index'))
    return render_template('deals.html')

if __name__ == '__main__':
    app.run(debug=True)
