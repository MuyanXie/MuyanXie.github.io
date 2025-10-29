# this python script will do the following:
# 1. read the /notes folder for the list of all .md files
# 2. for each .md file, check if it exists in the notes/db.sqlite3 database
# remove record in db.sqlite3 if the file does not exist in /notes folder
# add record in db.sqlite3 if the file exists in /notes folder but not in db.sqlite3

# db.sqlite3 schema:
# create table notes (note_id integer primary key autoincrement, filename TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);

import os
import sqlite3
from datetime import datetime
import json

NOTES_FOLDER = 'notes'
DB_PATH = 'notes/db.sqlite3'
MD_EXTENSION = '.md'

def get_md_files(folder):
    """Get a set of all .md files in the specified folder."""
    return {f for f in os.listdir(folder) if f.endswith(MD_EXTENSION)}

def get_db_files(conn):
    """Get a set of all filenames in the notes table."""
    with conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes")
        rows = cursor.fetchall()
        return rows
    return set()

def sync_notes():
    """Sync the .md files in the notes folder with the database."""
    md_files = get_md_files(NOTES_FOLDER)

    conn = sqlite3.connect(DB_PATH)
    db_files = get_db_files(conn)
    db_files = {row[1] for row in db_files}

    # Files to remove from the database
    files_to_remove = db_files - md_files
    # Files to add to the database
    files_to_add = md_files - db_files

    with conn:
        cursor = conn.cursor()

        # Remove records for files that no longer exist
        for filename in files_to_remove:
            cursor.execute("DELETE FROM notes WHERE filename = ?", (filename,))
            print(f"Removed from DB: {filename}")

        # Add records for new files
        for filename in files_to_add:
            now = datetime.now().isoformat()
            cursor.execute("INSERT INTO notes (filename, created_at, updated_at) VALUES (?, ?, ?)",
                           (filename, now, now))
            print(f"Added to DB: {filename}")



    # copy the verified files into public/notes
    PUBLIC_NOTES_FOLDER = 'public/notes'
    os.makedirs(PUBLIC_NOTES_FOLDER, exist_ok=True)
    for filename in md_files:
        src_path = os.path.join(NOTES_FOLDER, filename)
        dest_path = os.path.join(PUBLIC_NOTES_FOLDER, filename)
        with open(src_path, 'rb') as src_file:
            with open(dest_path, 'wb') as dest_file:
                dest_file.write(src_file.read())

    # copy the metadata into public/notes/metadata.json
    metadata = get_db_files(conn)

    metadata_list = []
    for row in metadata:
        metadata_list.append({
            'note_id': row[0],
            'filename': row[1],
            'created_at': row[2],
            'updated_at': row[3]
        })
    metadata_path = os.path.join(PUBLIC_NOTES_FOLDER, 'metadata.json')
    with open(metadata_path, 'w') as metadata_file:
        json.dump(metadata_list, metadata_file, indent=4)
    
    conn.close()
    
    
        
    
    
if __name__ == "__main__":
    sync_notes()