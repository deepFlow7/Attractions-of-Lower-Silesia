--USAGE: psql -f inserty_bazowe.sql

\c maps

-- Inserting sample data into the attractions table
INSERT INTO attractions (name, coords, type, subtype, interactivity, time_it_takes, rating, description) VALUES

    ('Zamek Książ', POINT(50.8418, 16.2902), 'urbanistyka', 'zamek', 9, 180, 7, 'Zamek Książ to jedna z największych atrakcji Dolnego Śląska, położona w malowniczym parku krajobrazowym. Zamek oferuje bogatą historię, piękną architekturę i możliwość eksploracji na długie godziny.'),
    ('Kościół Pokoju w Świdnicy', POINT(50.8522, 16.4850), 'urbanistyka', 'kościół', 8, 90, 8, 'Kościół Pokoju w Świdnicy to unikatowe dzieło architektury sakralnej, wpisane na Listę Światowego Dziedzictwa UNESCO. Jego wnętrze zachwyca bogatym wystrojem i atmosferą pokoju i spokoju.'),
    ('Panorama Racławicka', POINT(51.1079, 17.0478), 'urbanistyka', 'muzeum', 7, 60, 1, 'Panorama Racławicka to monumentalne dzieło sztuki, przedstawiające Bitwę pod Racławicami. Jest to niezwykłe doświadczenie dla miłośników historii i sztuki.'),
    ('Śnieżka', POINT(50.7365, 15.7400), 'natura', 'szczyt górski', 10, 240, 6, 'Śnieżka to najwyższy szczyt Karkonoszy, oferujący zapierające dech w piersiach widoki i możliwość aktywnego wypoczynku w otoczeniu przyrody.'),
    ('Szczeliniec Wielki', POINT(50.4817, 16.3425), 'natura', 'formacja skalna', 9, 120, 10, 'Szczeliniec Wielki to unikatowa formacja skalna w Górach Stołowych, stanowiąca doskonałą trasę wspinaczkową i punkt widokowy.'),
    ('Błędne Skały', POINT(50.4819, 16.3442), 'natura', 'formacja skalna', 8, 60, 9, 'Błędne Skały to grupa unikalnych formacji skalnych, które zachwycają swoją różnorodnością i kształtem.'),
    ('Zamek Czocha', POINT(51.0350, 15.3050), 'urbanistyka', 'zamek', 9, 120, 10, 'Zamek Czocha to imponująca warownia położona nad Jeziorem Leśniańskim, która zachwyca swoją architekturą i bogatą historią.'),
    ('Kopalnia Złota w Złotym Stoku', POINT(50.4431, 16.8672), 'urbanistyka', 'kopalnia', 7, 120, 9, 'Kopalnia Złota w Złotym Stoku to fascynujące miejsce, gdzie można poznać historię górnictwa i poszukiwać skarbów pod ziemią.'),
    ('Jaskinia Niedźwiedzia', POINT(50.4472, 16.8450), 'natura', 'jaskinia', 9, 90, 9, 'Jaskinia Niedźwiedzia to malownicza jaskinia w Górach Sowich, która zachwyca bogactwem formacji skalnych i tajemniczą atmosferą.'),
    ('Twierdza Kłodzko', POINT(50.4347, 16.6616), 'urbanistyka', 'twierdza', 8, 120, 10, 'Twierdza Kłodzko to imponująca warownia, która ma bogatą historię i stanowi doskonały przykład architektury obronnej.'),
    ('Zamek Grodno', POINT(50.6845, 16.3640), 'urbanistyka', 'zamek', 7, 90, 7, 'Zamek Grodno to malownicza warownia położona na wzgórzu nad Bobrem, oferująca piękne widoki na okolicę.'),
    ('Sanktuarium w Krzeszowie', POINT(50.8644, 16.2922), 'urbanistyka', 'sanktuarium', 8, 60, 5, 'Sanktuarium w Krzeszowie to ważne miejsce pielgrzymkowe, które przyciąga wiernych swoją piękną architekturą i atmosferą skupienia.'),
    ('Muzeum Papiernictwa w Dusznikach-Zdroju', POINT(50.4030, 16.3909), 'urbanistyka', 'muzeum', 7, 90, 3, 'Muzeum Papiernictwa w Dusznikach-Zdroju to fascynujące miejsce, gdzie można poznać historię produkcji papieru i techniki związane z papiernictwem.'),
    ('Wodospad Kamieńczyka', POINT(50.7975, 15.4891), 'natura', 'wodospad', 8, 60, 2, 'Wodospad Kamieńczyka to malowniczy wodospad położony w sercu Karkonoszy, oferujący przyjemne wrażenia wizualne i możliwość relaksu w otoczeniu natury.'),
    ('Zamek Chojnik', POINT(50.8673, 15.6823), 'urbanistyka', 'ruiny', 7, 90, 7, 'Zamek Chojnik to malownicza ruina zamku położona na szczycie góry Chojnik w Górach Izerskich. Mimo że zamek nie jest w pełni zrekonstruowany, to wciąż przyciąga turystów swoją historią i zapierającymi dech w piersiach widokami na okolicę.'),
    ('Podziemne Miasta Riese', POINT(50.6253, 16.5095), 'urbanistyka', 'kompleks podziemny', 8, 120, 8, 'Podziemne Miasta Riese to tajemniczy kompleks podziemnych tuneli i korytarzy z czasów II wojny światowej. Jest to fascynujące miejsce dla miłośników historii i tajemniczych zagadek.'),
    ('Arboretum Wojsławice', POINT(50.7078, 16.8550), 'natura', 'ogród botaniczny', 9, 120, 10, 'Arboretum Wojsławice to piękny ogród botaniczny, który zachwyca różnorodnością roślin i malowniczym otoczeniem. Jest to doskonałe miejsce na spokojny spacer i relaks na łonie natury.'),
    ('Hala Stulecia we Wrocławiu', POINT(51.1065, 17.0775), 'urbanistyka', 'zabytek architektury', 8, 60, 2, 'Hala Stulecia we Wrocławiu to imponujący zabytek architektury, będący symbolem miasta. Jest to miejsce organizacji różnorodnych wydarzeń kulturalnych i sportowych.'),
    ('Ogród Japoński we Wrocławiu', POINT(51.1070, 17.0753), 'natura', 'ogród', 7, 60, 4, 'Ogród Japoński we Wrocławiu to spokojne miejsce, gdzie można odpocząć wśród pięknie zaprojektowanych stawów, mostków i roślinności charakterystycznej dla ogrodów japońskich.'),
    ('Kolejkowo we Wrocławiu', POINT(51.1094, 17.0223), 'urbanistyka', 'makieta kolejowa', 7, 60, 1, 'Kolejkowo we Wrocławiu to unikatowa makieta kolejowa, prezentująca krajobraz i życie miasta we wspaniałych detalach.'),
    ('Hydropolis we Wrocławiu', POINT(51.1104, 17.0475), 'urbanistyka', 'centrum edukacyjne', 8, 90, 1, 'Hydropolis we Wrocławiu to interaktywne centrum edukacyjne poświęcone wodzie i jej roli w życiu na Ziemi. Jest to fascynujące miejsce dla osób w każdym wieku.'),
    ('ZOO Wrocław', POINT(51.1042, 17.0769), 'urbanistyka', 'ogród zoologiczny', 9, 180, 10, 'ZOO Wrocław to jedno z największych i najbardziej atrakcyjnych ogrodów zoologicznych w Polsce. Oferuje ono możliwość obserwacji bogatej fauny z całego świata.'),
    ('Kolorowe Jeziorka', POINT(50.8172, 15.7540), 'natura', 'zbiorniki wodne', 7, 90, 9, 'Kolorowe Jeziorka to grupa malowniczych zbiorników wodnych w Karkonoszach, których niezwykły kolor przyciąga wielu turystów.'),
    ('Bazylika w Bardzie', POINT(50.5128, 16.8959), 'urbanistyka', 'bazylika', 8, 60, 3, 'Bazylika w Bardzie to imponujący zabytek sakralnej architektury, który przyciąga wiernych i turystów swoim pięknem i duchową atmosferą.'),
    ('Zamek Bolczów', POINT(50.8694, 15.8890), 'urbanistyka', 'ruiny', 6, 90, 7, 'Zamek Bolczów to malownicza ruina zamku w Kotlinie Kamiennogórskiej, która zachwyca swoją historią i położeniem wśród górskich krajobrazów.'),
    ('Zamek w Leśnicy', POINT(51.1142, 16.9896), 'urbanistyka', 'zamek', 7, 90, 3, 'Zamek w Leśnicy to urokliwa warownia wznosząca się na wzgórzu w Górach Kaczawskich. Oferuje ona możliwość poznania historii regionu oraz piękne widoki na okolicę.'),
    ('Zamek w Świebodzicach', POINT(50.8622, 16.3199), 'urbanistyka', 'zamek', 7, 90, 2, 'Zamek w Świebodzicach to historyczna warownia, która stanowi ważny element dziedzictwa kulturowego Dolnego Śląska. Oferuje ona możliwość eksploracji oraz podziwiania malowniczej okolicy.'),
    ('Zamek w Niemczy', POINT(50.7275, 16.8356), 'urbanistyka', 'zamek', 6, 60, 5, 'Zamek w Niemczy to malownicza warownia, która pełniła ważną rolę w historii regionu. Dzisiaj stanowi ona atrakcyjny punkt turystyczny, przyciągając miłośników historii i architektury.'),
    ('Zamek w Siedlęcinie', POINT(50.9769, 15.8755), 'urbanistyka', 'zamek', 7, 60, 7, 'Zamek w Siedlęcinie to urokliwa warownia, która stanowi doskonały przykład średniowiecznej architektury obronnej. Jest to fascynujące miejsce dla miłośników historii i romantycznych krajobrazów.'),
    ('Zamek w Bolkowie', POINT(50.9189, 16.0997), 'urbanistyka', 'zamek', 7, 90, 9, 'Zamek w Bolkowie to imponująca średniowieczna warownia, która dominuje nad miastem. Z jego murów roztacza się piękny widok na okolicę, a bogata historia przyciąga wielu turystów.'),
    ('Zamek w Oławie', POINT(50.9450, 17.2922), 'urbanistyka', 'zamek', 6, 60, 5, 'Zamek w Oławie to historyczna rezydencja książąt oławskich, która zachwyca swoją architekturą i malowniczym położeniem. Jest to doskonałe miejsce na spacer i poznanie historii regionu.'),
    ('Zamek w Grodźcu', POINT(50.6845, 16.3640), 'urbanistyka', 'zamek', 7, 90, 10, 'Zamek w Grodźcu to imponująca warownia na wzgórzu, znana z licznych imprez kulturalnych i rekonstrukcji historycznych. Zamek oferuje piękne widoki i fascynującą podróż w przeszłość.'),
    ('Zamek w Pieskowej Skale', POINT(50.2079, 19.8069), 'urbanistyka', 'zamek', 8, 90, 8, 'Zamek w Pieskowej Skale to perła renesansowej architektury, malowniczo położona w Dolinie Prądnika. Jest częścią Ojcowskiego Parku Narodowego i oferuje bogate zbiory muzealne oraz piękne ogrody.'),
    ('Zamek w Mosznej', POINT(50.4325, 17.7836), 'urbanistyka', 'zamek', 9, 120, 10, 'Zamek w Mosznej to jedna z najbardziej rozpoznawalnych rezydencji w Polsce, znana ze swojej bajkowej architektury i pięknych ogrodów. Jest to doskonałe miejsce na dłuższy spacer i zwiedzanie.'),
    ('Zamek w Karpnikach', POINT(50.8336, 15.7503), 'urbanistyka', 'zamek', 7, 90, 9, 'Zamek w Karpnikach to elegancka rezydencja, otoczona malowniczym parkiem krajobrazowym. Jest to miejsce o bogatej historii, idealne na romantyczny weekend lub kulturalne wydarzenie.'),
    ('Zamek w Starej Kamienicy', POINT(50.9167, 15.5000), 'urbanistyka', 'zamek', 6, 60, 8, 'Zamek w Starej Kamienicy to malownicza ruina położona wśród górskich krajobrazów. Choć zamek nie jest w pełni zrekonstruowany, to jego historia i położenie przyciągają wielu turystów.'),
    ('Zamek w Wojcieszowie', POINT(50.9167, 15.8333), 'urbanistyka', 'zamek', 6, 60, 6, 'Zamek w Wojcieszowie to urokliwa warownia położona na wzgórzu, oferująca piękne widoki na okolicę. Jest to doskonałe miejsce na spokojny spacer i poznanie lokalnej historii.'),
    ('Zamek w Książęcej Górze', POINT(50.9167, 15.8333), 'urbanistyka', 'zamek', 6, 60, 1, 'Zamek w Książęcej Górze to malownicza warownia, która zachwyca swoją architekturą i położeniem w otoczeniu górskich krajobrazów. Jest to miejsce pełne historii i pięknych widoków.'),
    ('Zamek w Rogowie Sobóckim', POINT(51.1333, 17.2000), 'urbanistyka', 'zamek', 6, 60, 1, 'Zamek w Rogowie Sobóckim to historyczna rezydencja położona w malowniczym otoczeniu. Jest to doskonałe miejsce na spacer i poznanie historii regionu.'),
    ('Zamek w Bystrzycy Kłodzkiej', POINT(50.3000, 16.6500), 'urbanistyka', 'zamek', 7, 90, 10, 'Zamek w Bystrzycy Kłodzkiej to malownicza warownia, która oferuje fascynującą podróż w przeszłość. Zamek jest doskonałym punktem widokowym na miasto i okolice.'),
    ('Zamek w Ścinawce Średniej', POINT(50.6167, 16.5167), 'urbanistyka', 'zamek', 6, 60, 2, 'Zamek w Ścinawce Średniej to malownicza warownia położona wśród górskich krajobrazów. Jest to miejsce o bogatej historii, idealne na spokojny spacer i poznanie lokalnej kultury.');

INSERT INTO attractions (name, coords, type, subtype, interactivity, time_it_takes, rating, description) VALUES
    ('Papa Krasnal', POINT(51.1139, 17.0334), 'urbanistyka', 'krasnal', 2, 5, 3, 'Najstarszy i największy krasnal, znajduje się przy placu Dominikańskim. Upamiętnia ruch Pomarańczowej Alternatywy.'),
    ('Fechmistrz', POINT(51.1142, 17.0326), 'urbanistyka', 'krasnal', 2, 5, 3, 'Stoi obok Uniwersytetu Wrocławskiego.'),
    ('Rzeźnik', POINT(51.1097, 17.0375), 'urbanistyka', 'krasnal', 2, 5, 3, 'Znajduje się w Starych Jatkach.'),
    ('Syzyfki', POINT(51.1087, 17.0305), 'urbanistyka', 'krasnal', 2, 5, 3, 'Dwie figurki na ulicy Świdnickiej.'),
    ('Krasnal Pracz', POINT(51.1071, 17.0422), 'urbanistyka', 'krasnal', 2, 5, 3, 'Blisko Mostu Piaskowego.'),
    ('Niemowa i Niewidoma', POINT(51.1081, 17.0319), 'urbanistyka', 'krasnal', 2, 5, 3, 'Reprezentują osoby niepełnosprawne i są częścią kampanii “Wrocław bez barier”.'),
    ('Marzenka', POINT(51.1100, 17.0322), 'urbanistyka', 'krasnal', 2, 5, 3, 'Trzecia żeńska figurka, inspirowana logo fundacji Mam Marzenie.'),
    ('Automator', POINT(51.1108, 17.0337), 'urbanistyka', 'krasnal', 2, 5, 3, 'Automatyzuje różne zadania.'),
    ('ATMers', POINT(51.1095, 17.0321), 'urbanistyka', 'krasnal', 2, 5, 3, 'Krasnal przy bankomacie.'),
    ('Chrapacz', POINT(51.1055, 17.0414), 'urbanistyka', 'krasnal', 2, 5, 3, 'Znajduje się w okolicach Hematologii i Onkologii Dziecięcej.'),
    ('Programista', POINT(51.1074, 17.0339), 'urbanistyka', 'krasnal', 2, 5, 3, 'Związany z technologią.'),
    ('Capgeminiusz', POINT(51.1089, 17.0344), 'urbanistyka', 'krasnal', 2, 5, 3, 'Przy siedzibie firmy Capgemini.'),
    ('Długi', POINT(51.1065, 17.0327), 'urbanistyka', 'krasnal', 2, 5, 3, 'Wydłużony krasnal.'),
    ('Printer', POINT(51.1072, 17.0335), 'urbanistyka', 'krasnal', 2, 5, 3, 'Związany z drukowaniem.'),
    ('Kacper Florianek', POINT(51.1092, 17.0323), 'urbanistyka', 'krasnal', 2, 5, 3, 'Postać z legendy o Kacperku.'),
    ('Gazuś', POINT(51.1083, 17.0367), 'urbanistyka', 'krasnal', 2, 5, 3, 'Przy stacji benzynowej.'),
    ('Wymieniacz', POINT(51.1080, 17.0314), 'urbanistyka', 'krasnal', 2, 5, 3, 'Związany z wymianą walut.'),
    ('Gołąbek', POINT(51.1068, 17.0340), 'urbanistyka', 'krasnal', 2, 5, 3, 'Krasnal z gołębiem na ramieniu.'),
    ('Meloman', POINT(51.1077, 17.0348), 'urbanistyka', 'krasnal', 2, 5, 3, 'Krasnal z gitarą.'),
    ('Janinek', POINT(51.1103, 17.0325), 'urbanistyka', 'krasnal', 2, 5, 3, 'Przy stacji pocztowej.');

-- Inserting sample data into the users table
INSERT INTO users (name, surname, mail) 
VALUES 
  ('John', 'Doe', 'john.doe@example.com'),
  ('Alice', 'Smith', 'alice.smith@example.com');

-- Inserting sample data into the logins table
INSERT INTO logins (user_id, login, password, role) 
VALUES 
  (1, 'johndoe', 'password123', 'admin'),
  (2, 'alicesmith', 'password456', 'user');

-- Inserting sample data into the comments table
INSERT INTO comments (author, content, votes, attraction) 
VALUES 
  (1, 'Robi wrażenie', 10, 1),
  (2, 'Ciekawy budynek', 8, 2),
  (1, 'Wspaniały obraz.', 5, 3);

-- Inserting sample data into the challenges table
INSERT INTO challenges (name, description, coords, zoom) VALUES
    ('Dolnośląskie Zamki', 'Odwiedź wszystkie zamki na Dolnym Śląsku, aby odkryć bogatą historię regionu.', '(50.5, 15.0)', 8),
    ('Górskie Wyprawy', 'Zdobądź najpiękniejsze szczyty i formacje skalne w Dolnym Śląsku.', '(50.0, 16.15)', 9),
    ('Kulturalne Dziedzictwo', 'Zwiedź najważniejsze muzea, kościoły i zabytki architektury w regionie.', '(50.8, 17.15)', 9),
    ('Krasnalowa przygoda', 'Zbierz wrocławskie krasnale.', '(51.109, 17.032)', 15);

-- Inserting sample data into the challenge_attractions table
INSERT INTO challenge_attractions (challenge_id, attraction_id, points) VALUES
    -- Dolnośląskie Zamki
    (1,  1, 50), -- Zamek Książ
    (1,  7, 60), -- Zamek Czocha
    (1, 10, 70), -- Twierdza Kłodzko
    (1, 11, 80), -- Zamek Grodno
    (1, 14, 90), -- Zamek Chojnik
    (1, 26, 10), -- Zamek w Leśnicy
    (1, 27, 40), -- Zamek w Świebodzicach
    (1, 28, 30), -- Zamek w Niemczy
    (1, 29, 20), -- Zamek w Siedlęcinie
    (1, 30, 10), -- Zamek w Bolkowie
    (1, 31, 60), -- Zamek w Oławie
    (1, 32, 70), -- Zamek w Grodźcu
    (1, 33, 80), -- Zamek w Pieskowej Skale
    (1, 34, 90), -- Zamek w Mosznej
    (1, 35, 10), -- Zamek w Karpnikach
    (1, 36, 40), -- Zamek w Starej Kamienicy
    (1, 37, 30), -- Zamek w Wojcieszowie
    (1, 38, 20), -- Zamek w Książęcej Górze
    (1, 39, 10), -- Zamek w Rogowie Sobóckim
    (1, 40, 50), -- Zamek w Bystrzycy Kłodzkiej
    (1, 41, 60), -- Zamek w Ścinawce Średniej

    -- Górskie Wyprawy
    (2,  4, 70), -- Śnieżka
    (2,  5, 80), -- Szczeliniec Wielki
    (2,  6, 90), -- Błędne Skały
    (2, 13, 10), -- Wodospad Kamieńczyka
    (2, 24, 40), -- Kolorowe Jeziorka

    -- Kulturalne Dziedzictwo
    (3,  2, 30), -- Kościół Pokoju w Świdnicy
    (3,  3, 20), -- Panorama Racławicka
    (3, 15, 10), -- Podziemne Miasta Riese
    (3, 16, 60), -- Arboretum Wojsławice
    (3, 17, 70), -- Hala Stulecia we Wrocławiu
    (3, 18, 80), -- Ogród Japoński we Wrocławiu
    (3, 19, 90), -- Kolejkowo we Wrocławiu
    (3, 20, 10), -- Hydropolis we Wrocławiu
    (3, 21, 40), -- ZOO Wrocław
    (3, 22, 30), -- Bazylika w Bardzie
    (3, 23, 20), -- Muzeum Papiernictwa w Dusznikach-Zdroju

    -- Krasnalowa przygoda
    (4, 42, 30), -- Papa Krasnal
    (4, 43, 20), -- Fechmistrz
    (4, 44, 10), -- Rzeźnik
    (4, 45, 60), -- Syzyfki
    (4, 46, 70), -- Krasnal Pracz
    (4, 47, 80), -- Niemowa i Niewidoma
    (4, 48, 90), -- Marzenka
    (4, 49, 10), -- Automator
    (4, 50, 40), -- ATMers
    (4, 51, 30), -- Chrapacz
    (4, 52, 20), -- Programista
    (4, 53, 20), -- Capgeminiusz
    (4, 54, 22), -- Długi
    (4, 55, 10), -- Printer
    (4, 56,  4), -- Kacper Florianek
    (4, 57, 20), -- Gazuś
    (4, 58, 11), -- Wymieniacz
    (4, 59, 20), -- Gołąbek
    (4, 60, 23), -- Meloman
    (4, 61,  1); -- Janinek

-- Inserting sample data into the photos table
INSERT INTO photos (attraction_id, photo, caption) VALUES
(1, 'https://dolnyslask.travel/wp-content/uploads/2021/12/476_-Ksiaz_szer.jpg', 'zdjęcie z drona'),
(1, 'https://images.zwierciadlo.pl/_resource/res/path/8a/0e/8a0ebfe6-802f-453d-b232-1a98a08b62a2_f750x750', ''),
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9ICwzIeulEO39UA3XwufR-vvC2f8kdhdUBg&s', ''),
(3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/RotundaPanoramyRaclawickiej.jpg/640px-RotundaPanoramyRaclawickiej.jpg', ''),
(4, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/%C5%9Anie%C5%BCka_z_zachodu.jpg', ''),
(5, 'https://www.niesamowitapolska.eu/media/com_jbusinessdirectory/pictures/companies/403/szczeliniec_wielki_kudowa_zdroj___3_.jpg', ''),
(6, 'https://nadszczytami.pl/wp-content/uploads/2020/05/b%C5%82%C4%99dne-ska%C5%82y-g%C3%B3ry-sto%C5%82owe.jpg', ''),
(7, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bajkowy_Zamek_Czocha.jpg/1200px-Bajkowy_Zamek_Czocha.jpg', ''),
(8, 'https://www.national-geographic.pl/media/cache/slider_big/uploads/media/default/0009/62/85825b878a343d514b9ab189b95df47f7b8de62a.jpeg', ''),
(9, 'https://www.jaskinianiedzwiedzia.pl/templates/yootheme/cache/a8/2010_10_2687_Jaskinia%20Niedzwiedzia-a89d7225.jpeg', ''),
(10, 'https://szlakpodziemi.pl/wp-content/uploads/2017/04/f1-2.jpg', ''),
(11, 'https://zamekgrodno.pl/wp-content/uploads/2020/07/grafika_vid07.jpg', ''),
(12, 'https://silesia.edu.pl/images/7/70/Krzeszow-bazylika1.jpg', ''),
(13, 'https://zdjecianoclegi.pl/articles/imagesfly/fullhd/4233/16_duszniki_muzeum_papiernictwa_wmlynie.jpg', ''),
(14, 'https://u.profitroom.pl/2021-interferie-pl/thumb/2560x1440/uploads/stocks/Interferie24_01.jpg', ''),
(15, 'https://camp66.pl/wp-content/uploads/2017/02/maxresdefault.jpg', ''),
(16, 'https://www.tysiacstronswiata.pl/wp-content/uploads/2020/09/projekt-riese-ksiaz.jpg', ''),
(17, 'https://arboretumwojslawice.pl/wp-content/uploads/2013/03/Kolekcja-r%C3%B3%C5%BCanecznik%C3%B3w-Arboretum-Wojs%C5%82awice-2006-HGN.jpg', ''),
(18, 'https://api.kopalnia.pl/storage/2023/8/720px_kopalnia-soli-wieliczka-kopalnia-wiedzy-hala-stulecia-wroclaw-1-700-465-23-02-2023.jpeg', ''),
(19, 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Japanese_garden_Wroclaw_bridge.jpg', ''),
(20, 'https://www.readyforboarding.pl/wp-content/uploads/2022/02/kolejkowo-wroclaw-14-202202-readyforboarding_pl.jpg', ''),
(21, 'https://go.wroclaw.pl/api/download/img-655770bd0a18003d75e168ec7c3e8b3f/hydropolis-wroclaw-rekin-duzy.jpg', ''),
(22, 'https://zoo.wroclaw.pl/wp-content/uploads/2022/06/Dream-Night_09_06_2022-11-1030x686.webp', ''),
(23, 'https://krainakarkonoszy.pl/wp-content/uploads/2015/12/kolorowe-jeziorka-4.jpg', ''),
(24, 'https://lh4.googleusercontent.com/proxy/aRlVlVnxY7zgPAwg28psg8wCb3NlBN4Gk_PlEnCwCm1sWPNWdzS_s01oQso3Lbu-n8rFJn8fZOYmfC2vohxlle5d0OY5bCtVLh60DElZgADHgPbxg4HDJydn75w', ''),
(25, 'https://www.zamkipolskie.com/bolcz/97.jpg', ''),
(26, 'https://szlakzamkowipalacow.eu/wp-content/uploads/2017/02/lesnica-4-1280x768.jpg', ''),
(27, 'https://cdn02.sulimo.pl/media/userfiles/swiebodzice.cms2.sulimo.pl/Tresci/Szlaki_turystyczne/3b9adc2d6ebd54613defd97817d928d5.jpg', ''),
(28, 'https://lh4.googleusercontent.com/proxy/NLDafGIA_j2mVYnmEJQtTnEcW_en9c72-qg5CwBNdqdOpdyrJV-yzGriA0CqjLhudUxTgd00sL10SGcgmTKmdAl_t-xAWKhctMjVUEo_mim0rl3geCen4LkxBnZzJYiDZZmm', ''),
(29, 'https://mynaszlaku.pl/wp-content/uploads/2022/02/wieza-ksiazeca-w-siedlecinie-0024.jpg', ''),
(30, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBZI6LmT4P_eewogs1HlsWGaFJIVbc5_DSYg&s', ''),
(31, 'https://upload.wikimedia.org/wikipedia/commons/0/09/SM_O%C5%82awa_PlacZamkowy15_%2811%29.jpg', ''),
(32, 'https://media.gorykaczawskie.pl/2019/08/zamek-grodziec-4.jpg', ''),
(33, 'https://www.gov.pl/photo/0724185b-182d-4a9c-b036-fa31fe6d4f5b', ''),
(34, 'https://mosznazamek.pl/wp-content/uploads/2024/03/moszna-zamek.jpg', ''),
(35, 'https://upload.wikimedia.org/wikipedia/commons/a/a9/2016_Zamek_w_Karpnikach_1.jpg', ''),
(36, 'https://zamek.starakamienica.pl/wp-content/uploads/2020/01/Zamek-2-1024x680.jpg', ''),
(37, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinFymLUBWesEh96puEIPP2wxgXaU0dxE7AQqmeiq6X4tFXptco6MwMJJU4b_nytZ79NiVvD09z6pHNDR1N6K-C7AkZnHlGHcwE8ij74yqlTU5wSD4IBh4X9njViBWE7MnoNPL6N0iLMfk/s1600/DSC_0763.jpg', ''),
(38, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/77045439.jpg?k=0e03de60cc2494150c8ec786de19acea3b0804f4df4247cdbef8dbd058b2e7c9&o=&hp=1', ''),
(39, 'https://www.zamki.pl/xz/r_rogow1.jpg', ''),
(40, 'https://sway.to/download//1505/srebrnagora.jpeg', ''),
(41, 'https://kukushka.eu/_gallery/albums/userpics/10001/2013_07_21_601_Polska_Poland_Scinawka_Srednia_Zamek_Kapitanowo.jpg', '');

INSERT INTO photos (attraction_id, photo, caption) VALUES
(42, 'https://www.wroclaw.pl/cdn-cgi/image/,f=avif/https://go.wroclaw.pl/api/download/img-563d0df60a18003d2018c15eb00f6711/Papa-Krasnal2-Siem-jpg.jpg', ''),
(43, 'https://www.wroclaw.pl/cdn-cgi/image/,f=avif/https://go.wroclaw.pl/api/download/img-7b10ced60a18003d6160a601b57bbcca/szermierz-jpg.jpg', ''),
(44, 'https://kresy.org.pl/photo/file.action?thumbCover300x180=&id=846762', ''),
(45, 'https://polska-org.pl/foto/6937/Krasnale_Syzyfki_Wroclaw_6937385.jpg', ''),
(46, 'https://www.tuwroclaw.com/pliki/duze_zdjecia/wiadomosci/pracz_duze.jpg', ''),
(47, 'https://rampa.net.pl/wp-content/uploads/2017/09/tk058005-c5b765a2.jpg', ''),
(48, 'https://polska-org.pl/foto/6150/Krasnal_Marzenka_Wroclaw_6150038.jpg', ''),
(49, 'https://wroclaw.gum.gov.pl/dokumenty/zalaczniki/6/6-5859.jpg', ''),
(50, 'https://bi.im-g.pl/im/0f/96/14/z21589007AMP,Krasnal-Budowniczy-pod-Atal-Towers.jpg', ''),
(51, 'https://go.wroclaw.pl/api/download/img-29dac3202df7bd08605731370d58e903/krasnal-chrapek-wroclaw-panorama.jpg', ''),
(52, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVFHWaU17LnaGggWWVQiaslsnQVBZHtAKuGA&s', ''),
(53, 'https://go.wroclaw.pl/api/download/img-bfd404be2df7bd084e16842939e9416c/panorama-jpg.jpg', ''),
(54, 'https://www.wroclaw.pl/cdn-cgi/image/,f=avif/https://go.wroclaw.pl/api/download/img-a0d43b4c2df7bd086057313711b88715/dlugi-krasnal-wroclaw.jpg', ''),
(55, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Drukarz_%28Printer%29_Wroclaw_dwarf_01.JPG/1200px-Drukarz_%28Printer%29_Wroclaw_dwarf_01.JPG', ''),
(56, 'https://photos.wikimapia.org/p/00/04/22/75/72_full.jpg', ''),
(57, 'https://a.allegroimg.com/original/11a089/d2a59bfc46f085bd0d71fc3d0ea2/Obrazy-50x70-Krasnal-Gazus-Wroclaw', ''),
(58, 'https://wroclawskiefakty.pl/wp-content/uploads/2023/08/Krasnal_zdjecie-1-scaled.jpg', ''),
(59, 'https://go.wroclaw.pl/api/download/img-cd99f83b2df7bd0860573137117374ab/golebnik-krasnal-wroclaw-awatar.jpg', ''),
(60, 'https://polska-org.pl/foto/4029/Krasnale_Meloman_i_Grajek_ul_Olawska_Wroclaw_4029792.jpg', ''),
(61, 'https://polska-org.pl/foto/6684/Krasnal_Janinek_Wroclaw_6684645.jpg', '');
