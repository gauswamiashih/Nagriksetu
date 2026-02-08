INSERT INTO categories (name, description) VALUES
('Roads', 'Pottholes, damaged roads, and construction issues'),
('Water Supply', 'Pipeline leakage, no water supply, contaminated water'),
('Sanitation', 'Garbage collection, sewage issues, public toilets'),
('Electricity', 'Street lights not working, power cuts'),
('Public Safety', 'Theft, harassment, suspicious activities')
ON CONFLICT (name) DO NOTHING;
