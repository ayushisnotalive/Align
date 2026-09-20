-- Seed Geo Data
-- States
INSERT INTO public.states (name, code) VALUES ('Andhra Pradesh', 'AP') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Arunachal Pradesh', 'AR') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Assam', 'AS') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Bihar', 'BR') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Chhattisgarh', 'CG') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Goa', 'GA') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Gujarat', 'GJ') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Haryana', 'HR') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Himachal Pradesh', 'HP') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Jharkhand', 'JH') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Karnataka', 'KA') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Kerala', 'KL') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Madhya Pradesh', 'MP') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Maharashtra', 'MH') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Manipur', 'MN') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Meghalaya', 'ML') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Mizoram', 'MZ') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Nagaland', 'NL') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Odisha', 'OR') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Punjab', 'PB') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Rajasthan', 'RJ') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Sikkim', 'SK') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Tamil Nadu', 'TN') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Telangana', 'TG') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Tripura', 'TR') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Uttar Pradesh', 'UP') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Uttarakhand', 'UK') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('West Bengal', 'WB') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Andaman and Nicobar Islands', 'AN') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Chandigarh', 'CH') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Dadra and Nagar Haveli and Daman and Diu', 'DN') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Delhi', 'DL') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Jammu and Kashmir', 'JK') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Ladakh', 'LA') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Lakshadweep', 'LD') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.states (name, code) VALUES ('Puducherry', 'PY') ON CONFLICT (code) DO NOTHING;

-- Cities (100 total)
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'Mumbai', ST_Point(72.8777, 19.076)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'Delhi', ST_Point(77.1025, 28.7041)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'Bengaluru', ST_Point(77.5946, 12.9716)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'Hyderabad', ST_Point(78.4867, 17.385)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'Ahmedabad', ST_Point(72.5714, 23.0225)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'Chennai', ST_Point(80.2707, 13.0827)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'Kolkata', ST_Point(88.3639, 22.5726)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'Pune', ST_Point(73.8567, 18.5204)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'Jaipur', ST_Point(75.7873, 26.9124)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'Surat', ST_Point(72.8311, 21.1702)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 1', ST_Point(77.15438246664054, 28.7337890480625)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 2', ST_Point(77.60198526506274, 13.019129216924961)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 3', ST_Point(78.57796762314315, 17.47002133725617)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 4', ST_Point(72.65277393062773, 23.042817459293058)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 5', ST_Point(80.27465840010427, 13.126653640239397)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 6', ST_Point(88.41129467493703, 22.577771423759433)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 7', ST_Point(73.90650633126558, 18.609970672118227)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 8', ST_Point(75.85886300161188, 26.951878409283907)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 9', ST_Point(72.84974967095484, 21.202482871032586)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 10', ST_Point(77.25169337810829, 28.753269661531018)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 11', ST_Point(77.6891717220836, 13.043305754410452)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 12', ST_Point(78.65151442519787, 17.523423301152626)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 13', ST_Point(72.74078432776517, 23.084261419611227)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 14', ST_Point(80.31970336686648, 13.150642932764448)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 15', ST_Point(88.45758098409782, 22.582976557475767)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 16', ST_Point(73.96783166845464, 18.690718702177374)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 17', ST_Point(75.88291797825974, 26.959447141242006)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 18', ST_Point(72.86761375291132, 21.289516249376117)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 19', ST_Point(77.25245355419167, 28.764742839564015)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 20', ST_Point(77.7042184613487, 13.13009954379952)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 21', ST_Point(78.67930317923566, 17.60050931162956)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 22', ST_Point(72.78098018673303, 23.101167045204235)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 23', ST_Point(80.34011426849774, 13.233586999306052)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 24', ST_Point(88.47087485574336, 22.664834539082843)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 25', ST_Point(74.02251480272344, 18.73421188498648)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 26', ST_Point(75.88891856992207, 27.01886331001592)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 27', ST_Point(72.9244517907698, 21.35749636268756)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 28', ST_Point(77.25461778704766, 28.823588152882834)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 29', ST_Point(77.7985800120813, 13.169115897176141)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 30', ST_Point(78.69286756323042, 17.68296173109476)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 31', ST_Point(72.80074037197443, 23.142939525297503)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 32', ST_Point(80.37685634291341, 13.329134540396575)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 33', ST_Point(88.53543086930706, 22.750913454454615)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 34', ST_Point(74.10830637893336, 18.781323968492227)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 35', ST_Point(75.94970802011343, 27.112099354697513)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 36', ST_Point(72.95195924673588, 21.4056164566906)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 37', ST_Point(77.33731843385323, 28.87639132032344)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 38', ST_Point(77.88551853524032, 13.25876682247633)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 39', ST_Point(78.75378631133962, 17.75770172987244)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 40', ST_Point(72.8665580483725, 23.23577639150219)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 41', ST_Point(80.3868691575881, 13.374459547773492)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 42', ST_Point(88.53674422474211, 22.766453628587815)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 43', ST_Point(74.11276182025618, 18.83518386607681)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 44', ST_Point(76.02224223925332, 27.21128812949445)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 45', ST_Point(73.04728992250111, 21.504123798081274)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 46', ST_Point(77.41993843070713, 28.931811868316103)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 47', ST_Point(77.92854114676297, 13.311413600658105)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 48', ST_Point(78.77372380291084, 17.79460557271897)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 49', ST_Point(72.8842210318222, 23.279296269987586)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 50', ST_Point(80.41204451272822, 13.446213287615233)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 51', ST_Point(88.57693594238943, 22.817535613312074)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 52', ST_Point(74.14426331401316, 18.924658460725063)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 53', ST_Point(76.04790324266561, 27.30392222737958)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 54', ST_Point(73.11285375930531, 21.56827410804782)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 55', ST_Point(77.51167688598584, 28.948620427731655)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 56', ST_Point(77.94442295872344, 13.330424382222644)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 57', ST_Point(78.82592063656689, 17.837864650551904)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 58', ST_Point(72.93210741272132, 23.301324964441726)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 59', ST_Point(80.4393099083474, 13.455249153104068)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 60', ST_Point(88.58518333100297, 22.846071517110346)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 61', ST_Point(74.23336472903082, 18.985841385862297)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 62', ST_Point(76.08613812697516, 27.31235950834767)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 63', ST_Point(73.13582535070394, 21.629150345634134)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 64', ST_Point(77.55839366744335, 29.03923718174987)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 65', ST_Point(78.02509571101191, 13.378191065939781)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 66', ST_Point(78.83215453514272, 17.8948904186566)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 67', ST_Point(72.95013037361377, 23.36845500807056)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 68', ST_Point(80.44289328272251, 13.46689388122329)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 69', ST_Point(88.66772941589109, 22.909139462463585)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 70', ST_Point(74.28878291851301, 19.081023310039573)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 71', ST_Point(76.09868002911688, 27.3796958151656)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 72', ST_Point(73.14403433043624, 21.637139151332185)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 73', ST_Point(77.65772780523227, 29.09184659597849)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 74', ST_Point(78.1124057994001, 13.396539286960248)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 75', ST_Point(78.84098710910453, 17.973250359019957)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 76', ST_Point(73.02679716716307, 23.37634395448339)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 77', ST_Point(80.50334625347364, 13.555606051357723)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 78', ST_Point(88.67978040295401, 22.96715117223909)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 79', ST_Point(74.29729562849822, 19.16461110402933)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 80', ST_Point(76.19472796051981, 27.43798066209227)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 81', ST_Point(73.20826249934026, 21.637558367272927)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'DL'), 'City 82', ST_Point(77.71991018764643, 29.13755700245323)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'KA'), 'City 83', ST_Point(78.20581153360168, 13.454529259714242)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TG'), 'City 84', ST_Point(78.84492581874983, 17.978170394245627)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 85', ST_Point(73.0284637936828, 23.456686173281312)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'TN'), 'City 86', ST_Point(80.54546731125602, 13.5570427472924)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'WB'), 'City 87', ST_Point(88.76984990434173, 23.059102310165176)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'MH'), 'City 88', ST_Point(74.36965395517306, 19.189172189725138)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'RJ'), 'City 89', ST_Point(76.20514268681345, 27.458180505794072)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;
INSERT INTO public.cities (state_id, name, center) VALUES ((SELECT id FROM public.states WHERE code = 'GJ'), 'City 90', ST_Point(73.22793267465654, 21.718224335986218)) ON CONFLICT ON CONSTRAINT cities_state_id_name_key DO NOTHING;

-- Colleges (200 total)
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'Delhi' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 1', 'college', true, ST_Point(77.1025, 28.7041), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'Bengaluru' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 2', 'college', true, ST_Point(77.5946, 12.9716), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'Hyderabad' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 3', 'college', true, ST_Point(78.4867, 17.385), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'Ahmedabad' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 4', 'college', true, ST_Point(72.5714, 23.0225), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'Chennai' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 5', 'college', true, ST_Point(80.2707, 13.0827), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'Kolkata' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 6', 'college', true, ST_Point(88.3639, 22.5726), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'Pune' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 7', 'college', true, ST_Point(73.8567, 18.5204), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'Jaipur' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 8', 'college', true, ST_Point(75.7873, 26.9124), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'Surat' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 9', 'college', true, ST_Point(72.8311, 21.1702), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 1' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 10', 'college', true, ST_Point(77.15438246664054, 28.7337890480625), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 2' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 11', 'college', true, ST_Point(77.60198526506274, 13.019129216924961), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 3' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 12', 'college', true, ST_Point(78.57796762314315, 17.47002133725617), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 4' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 13', 'college', true, ST_Point(72.65277393062773, 23.042817459293058), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 5' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 14', 'college', true, ST_Point(80.27465840010427, 13.126653640239397), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 6' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 15', 'college', true, ST_Point(88.41129467493703, 22.577771423759433), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 7' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 16', 'college', true, ST_Point(73.90650633126558, 18.609970672118227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 8' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 17', 'college', true, ST_Point(75.85886300161188, 26.951878409283907), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 9' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 18', 'college', true, ST_Point(72.84974967095484, 21.202482871032586), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 10' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 19', 'college', true, ST_Point(77.25169337810829, 28.753269661531018), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 11' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 20', 'college', true, ST_Point(77.6891717220836, 13.043305754410452), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 12' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 21', 'college', true, ST_Point(78.65151442519787, 17.523423301152626), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 13' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 22', 'college', true, ST_Point(72.74078432776517, 23.084261419611227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 14' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 23', 'college', true, ST_Point(80.31970336686648, 13.150642932764448), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 15' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 24', 'college', true, ST_Point(88.45758098409782, 22.582976557475767), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 16' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 25', 'college', true, ST_Point(73.96783166845464, 18.690718702177374), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 17' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 26', 'college', true, ST_Point(75.88291797825974, 26.959447141242006), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 18' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 27', 'college', true, ST_Point(72.86761375291132, 21.289516249376117), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 19' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 28', 'college', true, ST_Point(77.25245355419167, 28.764742839564015), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 20' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 29', 'college', true, ST_Point(77.7042184613487, 13.13009954379952), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 21' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 30', 'college', true, ST_Point(78.67930317923566, 17.60050931162956), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 22' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 31', 'college', true, ST_Point(72.78098018673303, 23.101167045204235), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 23' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 32', 'college', true, ST_Point(80.34011426849774, 13.233586999306052), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 24' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 33', 'college', true, ST_Point(88.47087485574336, 22.664834539082843), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 25' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 34', 'college', true, ST_Point(74.02251480272344, 18.73421188498648), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 26' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 35', 'college', true, ST_Point(75.88891856992207, 27.01886331001592), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 27' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 36', 'college', true, ST_Point(72.9244517907698, 21.35749636268756), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 28' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 37', 'college', true, ST_Point(77.25461778704766, 28.823588152882834), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 29' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 38', 'college', true, ST_Point(77.7985800120813, 13.169115897176141), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 30' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 39', 'college', true, ST_Point(78.69286756323042, 17.68296173109476), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 31' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 40', 'college', true, ST_Point(72.80074037197443, 23.142939525297503), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 32' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 41', 'college', true, ST_Point(80.37685634291341, 13.329134540396575), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 33' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 42', 'college', true, ST_Point(88.53543086930706, 22.750913454454615), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 34' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 43', 'college', true, ST_Point(74.10830637893336, 18.781323968492227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 35' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 44', 'college', true, ST_Point(75.94970802011343, 27.112099354697513), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 36' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 45', 'college', true, ST_Point(72.95195924673588, 21.4056164566906), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 37' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 46', 'college', true, ST_Point(77.33731843385323, 28.87639132032344), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 38' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 47', 'college', true, ST_Point(77.88551853524032, 13.25876682247633), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 39' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 48', 'college', true, ST_Point(78.75378631133962, 17.75770172987244), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 40' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 49', 'college', true, ST_Point(72.8665580483725, 23.23577639150219), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 41' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 50', 'college', true, ST_Point(80.3868691575881, 13.374459547773492), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 42' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 51', 'college', true, ST_Point(88.53674422474211, 22.766453628587815), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 43' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 52', 'college', true, ST_Point(74.11276182025618, 18.83518386607681), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 44' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 53', 'college', true, ST_Point(76.02224223925332, 27.21128812949445), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 45' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 54', 'college', true, ST_Point(73.04728992250111, 21.504123798081274), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 46' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 55', 'college', true, ST_Point(77.41993843070713, 28.931811868316103), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 47' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 56', 'college', true, ST_Point(77.92854114676297, 13.311413600658105), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 48' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 57', 'college', true, ST_Point(78.77372380291084, 17.79460557271897), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 49' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 58', 'college', true, ST_Point(72.8842210318222, 23.279296269987586), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 50' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 59', 'college', true, ST_Point(80.41204451272822, 13.446213287615233), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 51' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 60', 'college', true, ST_Point(88.57693594238943, 22.817535613312074), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 52' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 61', 'college', true, ST_Point(74.14426331401316, 18.924658460725063), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 53' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 62', 'college', true, ST_Point(76.04790324266561, 27.30392222737958), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 54' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 63', 'college', true, ST_Point(73.11285375930531, 21.56827410804782), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 55' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 64', 'college', true, ST_Point(77.51167688598584, 28.948620427731655), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 56' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 65', 'college', true, ST_Point(77.94442295872344, 13.330424382222644), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 57' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 66', 'college', true, ST_Point(78.82592063656689, 17.837864650551904), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 58' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 67', 'college', true, ST_Point(72.93210741272132, 23.301324964441726), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 59' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 68', 'college', true, ST_Point(80.4393099083474, 13.455249153104068), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 60' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 69', 'college', true, ST_Point(88.58518333100297, 22.846071517110346), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 61' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 70', 'college', true, ST_Point(74.23336472903082, 18.985841385862297), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 62' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 71', 'college', true, ST_Point(76.08613812697516, 27.31235950834767), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 63' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 72', 'college', true, ST_Point(73.13582535070394, 21.629150345634134), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 64' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 73', 'college', true, ST_Point(77.55839366744335, 29.03923718174987), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 65' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 74', 'college', true, ST_Point(78.02509571101191, 13.378191065939781), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 66' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 75', 'college', true, ST_Point(78.83215453514272, 17.8948904186566), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 67' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 76', 'college', true, ST_Point(72.95013037361377, 23.36845500807056), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 68' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 77', 'college', true, ST_Point(80.44289328272251, 13.46689388122329), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 69' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 78', 'college', true, ST_Point(88.66772941589109, 22.909139462463585), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 70' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 79', 'college', true, ST_Point(74.28878291851301, 19.081023310039573), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 71' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 80', 'college', true, ST_Point(76.09868002911688, 27.3796958151656), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 72' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 81', 'college', true, ST_Point(73.14403433043624, 21.637139151332185), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 73' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 82', 'college', true, ST_Point(77.65772780523227, 29.09184659597849), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 74' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 83', 'college', true, ST_Point(78.1124057994001, 13.396539286960248), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 75' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 84', 'college', true, ST_Point(78.84098710910453, 17.973250359019957), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 76' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 85', 'college', true, ST_Point(73.02679716716307, 23.37634395448339), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 77' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 86', 'college', true, ST_Point(80.50334625347364, 13.555606051357723), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 78' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 87', 'college', true, ST_Point(88.67978040295401, 22.96715117223909), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 79' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 88', 'college', true, ST_Point(74.29729562849822, 19.16461110402933), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 80' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 89', 'college', true, ST_Point(76.19472796051981, 27.43798066209227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 81' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 90', 'college', true, ST_Point(73.20826249934026, 21.637558367272927), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 82' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 91', 'college', true, ST_Point(77.71991018764643, 29.13755700245323), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 83' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 92', 'college', true, ST_Point(78.20581153360168, 13.454529259714242), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 84' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 93', 'college', true, ST_Point(78.84492581874983, 17.978170394245627), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 85' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 94', 'college', true, ST_Point(73.0284637936828, 23.456686173281312), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 86' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 95', 'college', true, ST_Point(80.54546731125602, 13.5570427472924), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 87' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 96', 'college', true, ST_Point(88.76984990434173, 23.059102310165176), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 88' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 97', 'college', true, ST_Point(74.36965395517306, 19.189172189725138), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 89' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 98', 'college', true, ST_Point(76.20514268681345, 27.458180505794072), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 90' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 99', 'college', true, ST_Point(73.22793267465654, 21.718224335986218), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'Mumbai' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 100', 'college', true, ST_Point(72.8777, 19.076), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'Delhi' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 101', 'college', true, ST_Point(77.1025, 28.7041), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'Bengaluru' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 102', 'college', true, ST_Point(77.5946, 12.9716), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'Hyderabad' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 103', 'college', true, ST_Point(78.4867, 17.385), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'Ahmedabad' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 104', 'college', true, ST_Point(72.5714, 23.0225), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'Chennai' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 105', 'college', true, ST_Point(80.2707, 13.0827), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'Kolkata' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 106', 'college', true, ST_Point(88.3639, 22.5726), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'Pune' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 107', 'college', true, ST_Point(73.8567, 18.5204), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'Jaipur' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 108', 'college', true, ST_Point(75.7873, 26.9124), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'Surat' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 109', 'college', true, ST_Point(72.8311, 21.1702), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 1' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 110', 'college', true, ST_Point(77.15438246664054, 28.7337890480625), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 2' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 111', 'college', true, ST_Point(77.60198526506274, 13.019129216924961), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 3' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 112', 'college', true, ST_Point(78.57796762314315, 17.47002133725617), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 4' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 113', 'college', true, ST_Point(72.65277393062773, 23.042817459293058), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 5' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 114', 'college', true, ST_Point(80.27465840010427, 13.126653640239397), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 6' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 115', 'college', true, ST_Point(88.41129467493703, 22.577771423759433), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 7' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 116', 'college', true, ST_Point(73.90650633126558, 18.609970672118227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 8' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 117', 'college', true, ST_Point(75.85886300161188, 26.951878409283907), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 9' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 118', 'college', true, ST_Point(72.84974967095484, 21.202482871032586), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 10' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 119', 'college', true, ST_Point(77.25169337810829, 28.753269661531018), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 11' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 120', 'college', true, ST_Point(77.6891717220836, 13.043305754410452), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 12' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 121', 'college', true, ST_Point(78.65151442519787, 17.523423301152626), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 13' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 122', 'college', true, ST_Point(72.74078432776517, 23.084261419611227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 14' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 123', 'college', true, ST_Point(80.31970336686648, 13.150642932764448), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 15' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 124', 'college', true, ST_Point(88.45758098409782, 22.582976557475767), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 16' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 125', 'college', true, ST_Point(73.96783166845464, 18.690718702177374), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 17' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 126', 'college', true, ST_Point(75.88291797825974, 26.959447141242006), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 18' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 127', 'college', true, ST_Point(72.86761375291132, 21.289516249376117), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 19' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 128', 'college', true, ST_Point(77.25245355419167, 28.764742839564015), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 20' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 129', 'college', true, ST_Point(77.7042184613487, 13.13009954379952), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 21' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 130', 'college', true, ST_Point(78.67930317923566, 17.60050931162956), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 22' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 131', 'college', true, ST_Point(72.78098018673303, 23.101167045204235), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 23' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 132', 'college', true, ST_Point(80.34011426849774, 13.233586999306052), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 24' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 133', 'college', true, ST_Point(88.47087485574336, 22.664834539082843), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 25' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 134', 'college', true, ST_Point(74.02251480272344, 18.73421188498648), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 26' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 135', 'college', true, ST_Point(75.88891856992207, 27.01886331001592), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 27' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 136', 'college', true, ST_Point(72.9244517907698, 21.35749636268756), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 28' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 137', 'college', true, ST_Point(77.25461778704766, 28.823588152882834), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 29' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 138', 'college', true, ST_Point(77.7985800120813, 13.169115897176141), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 30' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 139', 'college', true, ST_Point(78.69286756323042, 17.68296173109476), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 31' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 140', 'college', true, ST_Point(72.80074037197443, 23.142939525297503), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 32' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 141', 'college', true, ST_Point(80.37685634291341, 13.329134540396575), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 33' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 142', 'college', true, ST_Point(88.53543086930706, 22.750913454454615), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 34' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 143', 'college', true, ST_Point(74.10830637893336, 18.781323968492227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 35' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 144', 'college', true, ST_Point(75.94970802011343, 27.112099354697513), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 36' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 145', 'college', true, ST_Point(72.95195924673588, 21.4056164566906), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 37' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 146', 'college', true, ST_Point(77.33731843385323, 28.87639132032344), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 38' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 147', 'college', true, ST_Point(77.88551853524032, 13.25876682247633), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 39' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 148', 'college', true, ST_Point(78.75378631133962, 17.75770172987244), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 40' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 149', 'college', true, ST_Point(72.8665580483725, 23.23577639150219), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 41' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 150', 'college', true, ST_Point(80.3868691575881, 13.374459547773492), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 42' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 151', 'college', true, ST_Point(88.53674422474211, 22.766453628587815), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 43' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 152', 'college', true, ST_Point(74.11276182025618, 18.83518386607681), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 44' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 153', 'college', true, ST_Point(76.02224223925332, 27.21128812949445), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 45' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 154', 'college', true, ST_Point(73.04728992250111, 21.504123798081274), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 46' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 155', 'college', true, ST_Point(77.41993843070713, 28.931811868316103), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 47' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 156', 'college', true, ST_Point(77.92854114676297, 13.311413600658105), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 48' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 157', 'college', true, ST_Point(78.77372380291084, 17.79460557271897), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 49' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 158', 'college', true, ST_Point(72.8842210318222, 23.279296269987586), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 50' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 159', 'college', true, ST_Point(80.41204451272822, 13.446213287615233), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 51' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 160', 'college', true, ST_Point(88.57693594238943, 22.817535613312074), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 52' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 161', 'college', true, ST_Point(74.14426331401316, 18.924658460725063), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 53' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 162', 'college', true, ST_Point(76.04790324266561, 27.30392222737958), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 54' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 163', 'college', true, ST_Point(73.11285375930531, 21.56827410804782), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 55' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 164', 'college', true, ST_Point(77.51167688598584, 28.948620427731655), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 56' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 165', 'college', true, ST_Point(77.94442295872344, 13.330424382222644), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 57' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 166', 'college', true, ST_Point(78.82592063656689, 17.837864650551904), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 58' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 167', 'college', true, ST_Point(72.93210741272132, 23.301324964441726), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 59' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 168', 'college', true, ST_Point(80.4393099083474, 13.455249153104068), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 60' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 169', 'college', true, ST_Point(88.58518333100297, 22.846071517110346), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 61' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 170', 'college', true, ST_Point(74.23336472903082, 18.985841385862297), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 62' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 171', 'college', true, ST_Point(76.08613812697516, 27.31235950834767), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 63' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 172', 'college', true, ST_Point(73.13582535070394, 21.629150345634134), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 64' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 173', 'college', true, ST_Point(77.55839366744335, 29.03923718174987), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 65' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 174', 'college', true, ST_Point(78.02509571101191, 13.378191065939781), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 66' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 175', 'college', true, ST_Point(78.83215453514272, 17.8948904186566), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 67' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 176', 'college', true, ST_Point(72.95013037361377, 23.36845500807056), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 68' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 177', 'college', true, ST_Point(80.44289328272251, 13.46689388122329), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 69' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 178', 'college', true, ST_Point(88.66772941589109, 22.909139462463585), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 70' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 179', 'college', true, ST_Point(74.28878291851301, 19.081023310039573), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 71' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 180', 'college', true, ST_Point(76.09868002911688, 27.3796958151656), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 72' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 181', 'college', true, ST_Point(73.14403433043624, 21.637139151332185), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 73' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 182', 'college', true, ST_Point(77.65772780523227, 29.09184659597849), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 74' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 183', 'college', true, ST_Point(78.1124057994001, 13.396539286960248), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 75' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 184', 'college', true, ST_Point(78.84098710910453, 17.973250359019957), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 76' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 185', 'college', true, ST_Point(73.02679716716307, 23.37634395448339), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 77' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 186', 'college', true, ST_Point(80.50334625347364, 13.555606051357723), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 78' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 187', 'college', true, ST_Point(88.67978040295401, 22.96715117223909), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 79' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 188', 'college', true, ST_Point(74.29729562849822, 19.16461110402933), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 80' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 189', 'college', true, ST_Point(76.19472796051981, 27.43798066209227), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 81' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 190', 'college', true, ST_Point(73.20826249934026, 21.637558367272927), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'DL'), 
    (SELECT id FROM public.cities WHERE name = 'City 82' AND state_id = (SELECT id FROM public.states WHERE code = 'DL')), 
    'Engineering College 191', 'college', true, ST_Point(77.71991018764643, 29.13755700245323), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'KA'), 
    (SELECT id FROM public.cities WHERE name = 'City 83' AND state_id = (SELECT id FROM public.states WHERE code = 'KA')), 
    'Engineering College 192', 'college', true, ST_Point(78.20581153360168, 13.454529259714242), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TG'), 
    (SELECT id FROM public.cities WHERE name = 'City 84' AND state_id = (SELECT id FROM public.states WHERE code = 'TG')), 
    'Engineering College 193', 'college', true, ST_Point(78.84492581874983, 17.978170394245627), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 85' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 194', 'college', true, ST_Point(73.0284637936828, 23.456686173281312), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'TN'), 
    (SELECT id FROM public.cities WHERE name = 'City 86' AND state_id = (SELECT id FROM public.states WHERE code = 'TN')), 
    'Engineering College 195', 'college', true, ST_Point(80.54546731125602, 13.5570427472924), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'WB'), 
    (SELECT id FROM public.cities WHERE name = 'City 87' AND state_id = (SELECT id FROM public.states WHERE code = 'WB')), 
    'Engineering College 196', 'college', true, ST_Point(88.76984990434173, 23.059102310165176), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'City 88' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 197', 'college', true, ST_Point(74.36965395517306, 19.189172189725138), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'RJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 89' AND state_id = (SELECT id FROM public.states WHERE code = 'RJ')), 
    'Engineering College 198', 'college', true, ST_Point(76.20514268681345, 27.458180505794072), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'GJ'), 
    (SELECT id FROM public.cities WHERE name = 'City 90' AND state_id = (SELECT id FROM public.states WHERE code = 'GJ')), 
    'Engineering College 199', 'college', true, ST_Point(73.22793267465654, 21.718224335986218), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
INSERT INTO public.colleges (state_id, city_id, name, type, is_approved, location, source) 
  VALUES (
    (SELECT id FROM public.states WHERE code = 'MH'), 
    (SELECT id FROM public.cities WHERE name = 'Mumbai' AND state_id = (SELECT id FROM public.states WHERE code = 'MH')), 
    'Engineering College 200', 'college', true, ST_Point(72.8777, 19.076), 'seed'
  ) ON CONFLICT ON CONSTRAINT colleges_city_id_name_key DO NOTHING;
