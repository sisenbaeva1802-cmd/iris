import test from "node:test";
import assert from "node:assert/strict";
import * as c from "../.test/checks.js";

test("numbersSupported accepts numbers present in source", () => {
  assert.equal(c.numbersSupported("Өсім 15% құрады", "Нәтижесінде өсім 15 % болды"), true);
  assert.equal(c.numbersSupported("Сома 1 000 теңге", "Сомасы 1000 теңге"), true);
  assert.equal(c.numbersSupported("Мәні 3,14", "Pi ≈ 3.14"), true);
});
test("numbersSupported rejects invented or partial numbers", () => {
  assert.equal(c.numbersSupported("Өсім 5%", "Өсім 15%"), false);
  assert.equal(c.numbersSupported("Жыл 2021", "Жыл 2020"), false);
  assert.equal(c.numbersSupported("Мәні 3.1", "Мәні 3.14"), false);
});
test("numbersSupported passes text without numbers", () => assert.equal(c.numbersSupported("Хлоропласт", "кез келген"), true));
test("jaccard flags near-duplicates", () => {
  assert.ok(c.jaccard("Фотосинтез қай органоидта жүреді?", "Фотосинтез қай органоидта жүреді") > 0.9);
  assert.ok(c.jaccard("Фотосинтез қай органоидта жүреді?", "Хлорофилл қандай жарықты жұтады?") < 0.3);
});
test("languageOk", () => {
  assert.equal(c.languageOk("Фотосинтез қайда жүреді?", "Kazakh"), true);
  assert.equal(c.languageOk("Where does photosynthesis occur?", "Kazakh"), false);
  assert.equal(c.languageOk("Where does photosynthesis occur?", "English"), true);
  assert.equal(c.languageOk("Фотосинтез", "English"), false);
});
