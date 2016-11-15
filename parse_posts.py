import glob
import re

pattern = re.compile('!\[[\w ]+\]\((?P<url>.*/[\w:/\.]*)\)')

files = glob.glob('_posts/*.md')

for f in files:
    print(f)
    with open(f, 'r') as processor:
        lines = processor.read()
        matches = pattern.findall(lines)
        print('Found ' + str(len(matches)) + ' matches')
        export = pattern.sub(r'{% image name="\g<url>" %}', lines)
    with open(f, 'w') as processor:
        processor.write(export)
