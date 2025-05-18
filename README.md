# Reissuloki – Maailman maat & matkailu

Reissuloki on React + TypeScript + Firebase -sovellus, jossa voit tutkia maailman maita, hakea ja suodattaa tietoja, sekä kirjautua sisään ja hallita omia matkailulistojasi.

## Ominaisuudet

- **Kaikkien maiden selaus**: Listaa kaikki maailman maat kortteina (lippu, pääkaupunki, väkiluku, maanosat).
- **Hakutoiminto**: Hae maita nimen tai pääkaupungin perusteella.
- **Suodatus**: Suodata maita maanosan mukaan.
- **Yksityiskohtainen maatietonäkymä**: Näe lippu, vaakuna, pääkaupunki, valuutat, kielet, väkiluku, pinta-ala, rajanaapurit ja karttalinkki.
- **Käyttäjätunnistus**: Rekisteröidy ja kirjaudu Firebase Authilla.
- **Omat listat**: Merkitse maat, joissa olet käynyt, ja lisää maita toivelistalle ("Haluan matkustaa tänne").
- **Muistiinpanot**: Lisää henkilökohtaisia muistiinpanoja jokaiseen maahan.
- **Moderni ulkoasu**: Maailma & matkailu -inspiroitu responsiivinen käyttöliittymä.

## Käyttöohjeet

1. **Asenna riippuvuudet**
   ```sh
   npm install
   ```
2. **Käynnistä kehityspalvelin**
   ```sh
   npm run dev
   ```
3. **Avaa selain** ja siirry osoitteeseen [http://localhost:5173](http://localhost:5173)

## Rakenne
- `src/components/` – Sovelluksen käyttöliittymäkomponentit
- `src/services/` – API- ja Firebase/Firestore-palvelut
- `src/Site.css` – Yleisteema ja ulkoasu

## Kehittäjälle
- TypeScript, React, Vite, Firebase, Firestore
- ESLint käytössä
- Moderni React Router -reititys

## Lisenssi
Tämä projekti on tarkoitettu oppimiseen ja henkilökohtaiseen käyttöön.
