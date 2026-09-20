-- Feature flags (everything monetary is OFF in beta)
insert into public.feature_flags (key, enabled) values
  ('ads_enabled', false), ('video_calls', false), ('paid_plans', false),
  ('live_space', true), ('college_tab', true)
on conflict (key) do nothing;

-- Optional profile questions
insert into public.attribute_definitions (key, label, category, input_type, is_sensitive, is_filterable, sort_order) values
  ('political_views',   'Political views',   'beliefs',     'single', true,  false, 1),
  ('religion',          'Religion',          'beliefs',     'single', true,  true,  2),
  ('smoking',           'Smoking',           'lifestyle',   'single', false, true,  3),
  ('drinking',          'Drinking',          'lifestyle',   'single', false, true,  4),
  ('cannabis',          'Cannabis',          'lifestyle',   'single', false, true,  5),
  ('diet',              'Diet',              'lifestyle',   'single', false, true,  6),
  ('sleep_pattern',     'Sleep pattern',     'lifestyle',   'single', false, false, 7),
  ('pets',              'Pets',              'lifestyle',   'multi',  false, false, 8),
  ('living_situation',  'Living situation',  'lifestyle',   'single', false, false, 9),
  ('family_plans',      'Family plans',      'family',      'single', false, true,  10),
  ('ethnicity',         'Ethnicity',         'physical',    'multi',  true,  false, 11),
  ('health_badge',      'Health badge',      'health',      'multi',  true,  false, 12),
  ('love_language',     'Love language',     'personality', 'multi',  false, false, 13),
  ('social_battery',    'Social battery',    'personality', 'single', false, false, 14),
  ('texting_style',     'Texting style',     'personality', 'single', false, false, 15),
  ('relationship_goal', 'Relationship goal', 'dating',      'single', false, true,  16),
  ('relationship_type', 'Relationship type', 'dating',      'multi',  false, true,  17)
on conflict (key) do nothing;

-- Dropdown options. Labels are auto-generated from codes; edit them later in the DB.
do $$
declare k text; v jsonb; opt text; i int;
begin
  for k, v in select * from jsonb_each('{
    "gender": ["man","woman","non_binary","trans_man","trans_woman","other"],
    "orientation": ["straight","gay","lesbian","bisexual","pansexual","asexual","queer","questioning","other"],
    "education_level": ["high_school","diploma","bachelors","masters","doctorate","other"],
    "attr:political_views": ["liberal","moderate","conservative","apolitical","other","prefer_not_to_say"],
    "attr:religion": ["hindu","muslim","christian","sikh","buddhist","jain","spiritual","agnostic","atheist","other","prefer_not_to_say"],
    "attr:smoking": ["non_smoker","socially","regularly","vape","trying_to_quit"],
    "attr:drinking": ["sober","rarely","socially","frequently"],
    "attr:cannabis": ["never","occasionally","regularly","prefer_not_to_say"],
    "attr:diet": ["vegetarian","eggetarian","non_vegetarian","vegan","pescatarian","jain","keto","other"],
    "attr:sleep_pattern": ["early_bird","night_owl","it_depends"],
    "attr:pets": ["dog","cat","other_pets","no_pets","want_pets"],
    "attr:living_situation": ["alone","with_roommates","with_family","hostel_or_pg"],
    "attr:family_plans": ["want_children","dont_want_children","have_children_want_more","have_children_dont_want_more","not_sure"],
    "attr:ethnicity": ["south_asian","east_asian","southeast_asian","middle_eastern","black","white","latino","mixed","other","prefer_not_to_say"],
    "attr:health_badge": ["vaccinated","prefer_not_to_say"],
    "attr:love_language": ["words_of_affirmation","quality_time","physical_touch","acts_of_service","gifts"],
    "attr:social_battery": ["introvert","ambivert","extrovert"],
    "attr:texting_style": ["heavy_texter","prefers_calls","slow_replier","hates_small_talk","voice_notes"],
    "attr:relationship_goal": ["long_term_partner","long_term_open_to_short","short_term_open_to_long","short_term_fun","new_friends","still_figuring_it_out"],
    "attr:relationship_type": ["monogamy","ethical_non_monogamy","open_relationship","polyamory","open_to_exploring"]
  }'::jsonb) loop
    i := 0;
    for opt in select jsonb_array_elements_text(v) loop
      i := i + 1;
      insert into public.lookup_values (list_key, code, label, sort_order)
      values (k, opt, initcap(replace(opt, '_', ' ')), i)
      on conflict (list_key, code) do nothing;
    end loop;
  end loop;
end $$;

-- Pronouns with proper labels
insert into public.lookup_values (list_key, code, label, sort_order) values
  ('pronoun','he_him','He/Him',1), ('pronoun','she_her','She/Her',2),
  ('pronoun','they_them','They/Them',3), ('pronoun','other','Other',4)
on conflict (list_key, code) do nothing;

-- Nicer labels for a few options
update public.lookup_values set label = 'Long-term partner' where code = 'long_term_partner';
update public.lookup_values set label = 'Long-term, open to short' where code = 'long_term_open_to_short';
update public.lookup_values set label = 'Short-term, open to long' where code = 'short_term_open_to_long';
update public.lookup_values set label = 'Ethical non-monogamy (ENM)' where code = 'ethical_non_monogamy';
update public.lookup_values set label = 'Still figuring it out' where code = 'still_figuring_it_out';
update public.lookup_values set label = 'Prefer not to say' where code = 'prefer_not_to_say';

-- Starter interests
insert into public.interests (label, category) values
  ('Music','arts'),('Movies','arts'),('Reading','arts'),('Travel','outdoors'),
  ('Trekking','outdoors'),('Gym','fitness'),('Cricket','sports'),('Football','sports'),
  ('Gaming','tech'),('Coding','tech'),('Cooking','food'),('Coffee','food'),
  ('Photography','arts'),('Dancing','arts'),('Pets','lifestyle')
on conflict (label) do nothing;