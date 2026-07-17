import json
import random
import uuid

categories = ['otc', 'antibiotics', 'chronic', 'vet', 'allergies']

# Base medicine combinations
prefixes = ['Paracetamol', 'Amoxicillin', 'Azithromycin', 'Pantoprazole', 'Rabeprazole', 'Metformin', 'Amlodipine', 'Levocetirizine', 'Ibuprofen', 'Diclofenac', 'Cefixime', 'Ofloxacin', 'Bravecto', 'Drontal', 'NexGard', 'Heartgard', 'Dolo', 'Calpol', 'Benadryl', 'Corex', 'Honitus', 'Digene', 'Gelusil']
suffixes = ['500mg', '250mg', '100mg', '625 Duo', '40mg', '20mg', 'Syrup 100ml', 'Syrup 200ml', 'Ointment 20g', 'Drops 10ml', 'Injection', 'Plus', 'Forte', 'Chewable', 'Spray']
brands = ['Cipla', 'Sun Pharma', 'Mankind', 'Dr. Reddys', 'Torrent', 'Lupin', 'Zoetis', 'Bayer', 'Himalaya', 'Patanjali', 'GSK', 'Pfizer', 'Abbott']

medicines = []

# Ensure specific items the UI mocks rely on exist exactly
must_haves = [
    {"name": "Augmentin 625 Duo", "salt": "Amoxicillin + Clavulanic Acid", "cat": "antibiotics", "rx": True, "price": 200.0},
    {"name": "Amoxicillin 500mg", "salt": "Amoxicillin", "cat": "antibiotics", "rx": True, "price": 120.0},
    {"name": "Bravecto 1000mg", "salt": "Fluralaner", "cat": "vet", "rx": True, "price": 1500.0},
    {"name": "Paracetamol 500mg", "salt": "Paracetamol", "cat": "otc", "rx": False, "price": 20.0},
    {"name": "Pan 40", "salt": "Pantoprazole", "cat": "otc", "rx": False, "price": 55.0},
]

for item in must_haves:
    medicines.append({
        "id": str(uuid.uuid4()),
        "name": item['name'],
        "molecule_salt": item['salt'],
        "category": item['cat'],
        "rx_required": item['rx'],
        "price": item['price'],
        "brand": random.choice(brands)
    })

# Generate the rest up to 300
count = len(medicines)
while count < 300:
    pref = random.choice(prefixes)
    suff = random.choice(suffixes)
    name = f"{pref} {suff}"
    
    # Determine category and rx reasonably
    cat = random.choice(categories)
    rx = False
    
    if 'Amoxicillin' in name or 'Azithromycin' in name or 'Cefixime' in name or 'Ofloxacin' in name:
        cat = 'antibiotics'
        rx = True
    elif 'Metformin' in name or 'Amlodipine' in name:
        cat = 'chronic'
        rx = True
    elif 'Bravecto' in name or 'Drontal' in name or 'NexGard' in name or 'Heartgard' in name:
        cat = 'vet'
        rx = random.choice([True, False])
    elif 'Syrup' in name or 'Dolo' in name or 'Calpol' in name or 'Benadryl' in name:
        cat = 'otc'
        rx = False
    
    price = round(random.uniform(10.0, 800.0), 2)
    if cat == 'vet': price = round(random.uniform(100.0, 2500.0), 2)
    
    # Avoid duplicates by name
    if not any(m['name'] == name for m in medicines):
        medicines.append({
            "id": str(uuid.uuid4()),
            "name": name,
            "molecule_salt": pref,
            "category": cat,
            "rx_required": rx,
            "price": price,
            "brand": random.choice(brands)
        })
        count += 1

# Output to JSON
import os
os.makedirs('d:/medico/src/data', exist_ok=True)
with open('d:/medico/src/data/medicinesDB.json', 'w') as f:
    json.dump(medicines, f, indent=2)

print(f"Generated {len(medicines)} medicines!")
