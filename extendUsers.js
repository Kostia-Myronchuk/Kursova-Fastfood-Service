import mysql from "mysql2";
import bcrypt from "bcrypt";

const pool = mysql.createPool({
  host: "localhost",
  user: "Root1",
  password: "",
  database: "fast_food_website",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

const users = [
    ['mykola_krivyi', 'mykola@example.com', 'password789', '1992-03-25'],
    ['nata_pavlenko', 'nata@example.com', 'password101', '1988-09-30'],
    ['taras_homenko', 'taras@example.com', 'password111', '1995-12-15'],
    ['alina_litvinenko', 'alina@example.com', 'password222', '1983-11-05'],
    ['oleh_bondarenko', 'oleh@example.com', 'password333', '1991-08-20'],
    ['svitlana_shvets', 'svitlana@example.com', 'password444', '1993-04-10'],
    ['andriy_lisovyi', 'andriy@example.com', 'password555', '1987-02-17'],
    ['viktoria_kovalenko', 'viktoria@example.com', 'password666', '1990-07-08'],
    ['dmytro_yarovyi', 'dmytro@example.com', 'password777', '1992-06-25'],
    ['oksana_zelena', 'oksana@example.com', 'password888', '1989-11-12'],
    ['oleh_vasylenko', 'oleh_v@example.com', 'password999', '1993-01-15'],
    ['valeria_ivanova', 'valeria@example.com', 'password000', '1994-02-20'],
    ['yuriy_tymoshenko', 'yuriy@example.com', 'password111', '1992-04-22'],
    ['olena_petrova', 'olena@example.com', 'password222', '1991-06-30'],
    ['maksym_kovalenko', 'maksym@example.com', 'password333', '1995-08-12'],
    ['arina_yanova', 'arina@example.com', 'password444', '1986-09-18'],
    ['serhiy_shevchenko', 'serhiy@example.com', 'password555', '1987-11-23'],
    ['kateryna_holovna', 'kateryna@example.com', 'password666', '1990-10-05'],
    ['vadym_ivanov', 'vadym@example.com', 'password777', '1994-12-01'],
    ['iryna_kozachenko', 'iryna@example.com', 'password888', '1992-03-03'],
    ['bogdan_andriyovych', 'bogdan@example.com', 'password999', '1989-04-10'],
    ['olga_zaitseva', 'olga@example.com', 'password111', '1991-05-15'],
    ['yaroslav_sydorenko', 'yaroslav@example.com', 'password222', '1990-07-07'],
    ['tetyana_kozlovska', 'tetyana@example.com', 'password333', '1992-08-21'],
    ['denys_smirnov', 'denys@example.com', 'password444', '1988-09-13']
];

async function insertUsers() {
  for (const user of users) {
    const [username, email, password, birthdate] = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await promisePool.query(
        "INSERT INTO Users (username, email, password, birthdate) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, birthdate]
      );
      console.log(`User ${username} inserted successfully`);
    } catch (err) {
      console.error(`Error inserting user ${username}:`, err);
    }
  }
  pool.end();
}

insertUsers();
