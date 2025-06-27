import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import json
import queue

event_queue = queue.Queue()

class FSEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        event_data = {
          "eventType" : event.event_type,
          "srcPath" : event.src_path,
          "destPath" : event.dest_path
        }
        stringified = json.dumps(event_data)
        event_queue.put(stringified)

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    event_handler = FSEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            if not event_queue.empty():
              event_data = event_queue.get()
              sys.stdout.write(event_data)
              sys.stdout.flush()
    finally:
        observer.stop()
        observer.join() 