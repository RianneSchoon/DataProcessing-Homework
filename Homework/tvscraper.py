#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry contains the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    
    # output
    outputlistoflists = []

    # for each TV series
    for e in dom.by_class('lister-item-content'):
        
        sublist = []

        # title
        sublist.append(e.by_class('lister-item-header')[0].by_tag('a')[0]. \
            content.encode('utf8'))
        
        # rating
        sublist.append(e.by_class('ratings-bar')[0].by_class('inline-block')[0]. \
            by_tag('strong')[0].content.encode('utf8'))

        # genres (comma seperated if more than one)
        sublist.append(e.by_class('text-muted ')[0].by_class('genre')[0]. \
            content.strip('\n').strip().encode('utf8'))

        # actors (comma seperated if more than one)
        actors = ''
        for actor in e.by_tag('p')[2].by_tag('a'):
            actors += actor.content + ', '
        actors_csv = actors[:-2].encode('utf8')
        sublist.append(actors_csv)

        # runtime (only by number)
        sublist.append(e.by_class('text-muted ')[0].by_class('runtime')[0]. \
            content.split(" ")[0].encode('utf8'))

        # put this list in output
        outputlistoflists.append(sublist)

    return outputlistoflists

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    # write CSV file (including a header)
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    writer.writerows(tvseries)

if __name__ == '__main__':
    
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
