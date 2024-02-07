print("This line will be printed.")

map = []

# Open the file in read mode ('r')
with open('input.txt', 'r') as file:
    # Read file line by line
    for line in file:
        # Remove newline characters and split the line into characters
        chars = list(line.strip())
        
        # Append the characters as a row to the matrix
        map.append(chars)

# for index, row in enumerate(map):

for i in range(len(map) - 1, -1, -1):
    if '#' not in map[i]:
        map.insert(i, map[i][:])

for i in range(len(map[0]) - 1, -1, -1):
    columns = [row[i] for row in map]
    if '#' not in columns:
        for row in map:
            row.insert(i, '.')

coords = []
for y, row in enumerate(map):
    for x, value in enumerate(row):
        if value == '#':
            coords.append({'x': x, 'y': y})

for hej in coords:
    print(hej)
print(coords[0]['x'])
sum = 0
for i, coord in enumerate(coords):
    for ii in range(i+1, len(coords)):
        sum += abs(coords[ii]['y'] - coords[i]['y']) + abs(coords[ii]['x'] - coords[i]['x'])

print(sum)