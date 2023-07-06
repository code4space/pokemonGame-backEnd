<a id="readme-top"></a>

# &#127899; Pokemon Gacha API &#127899;

Ini adalah server side Pokemon Gacha, tinggal di clone aja dan ikutin instruksinya untuk menginstall dan seeding datanya ke database

## Server Side Dibuat dengan

[![Postgres][PostgreSQL]][Postgres-url][![Express][Express.js]][Express-url]

###

Agar dapat menjalankan server ini secara lokal, pastikan kalau di device kalian sudah install postgresSql. lalu sisanya tinggal ikutin intruksi dibawah ini.

[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Express-url]: https://expressjs.com/
[Postgres-url]: https://www.postgresql.org/
[demo-url]: https://www.loom.com/share/d5962b1926d24607a61349afaed52d88?sid=22a49585-14fc-4f5f-8659-a939dd847ce5

&nbsp;

## Untuk mulai

Siapkan folder project, lalu buka terminal di alamat folder tersebut dan lakukan command dibawah ini

```
$ git clone https://github.com/code4space/pokemonGame-backEnd.git
$ cd pokemonGame-backEnd
$ npm install
$ node index.js / $ nodemon (harus install terlebih dahulu)
```

_Disarankan menginstall [Git Bash](https://git-scm.com/downloads) terlebih dahulu_


## Cara Seeding data

```js
// Pastikan config server sudah di setup di pokemonGame-backEnd/config/config.json sesuai setingan masing masing

$ cd pokemonGame-backEnd
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all

// == Setelah berhasil
```

&nbsp;

&nbsp;

<p align="right">(<a href="#readme-top">back to top</a>)</p>
