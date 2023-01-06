const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());

    beforeEach(async () => {
        await Book.destroy({ where: {} });
    });

    describe('with no records in the database', () => {
        describe('POST /books', () => {
            it('creates a new book in the database', async () => {
                const response = await request(app)
                    .post('/books')
                    .send({
                        title: 'The Midnight Library',
                        author: 'Matt Haig',
                        genre: 'Contemporary Fiction',
                        ISBN: '978-0-525-55948-1'
                    });
                
                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });
                
                expect(response.body.title).to.equal('The Midnight Library');
                expect(newBookRecord.title).to.equal('The Midnight Library');
                expect(newBookRecord.author).to.equal('Matt Haig');
                expect(newBookRecord.genre).to.equal('Contemporary Fiction');
                expect(newBookRecord.ISBN).to.equal('978-0-525-55948-1');
                expect(response.status).to.equal(201);
            });
        });
    });

    describe('with records in the database', () => {
        let books;

        beforeEach(async () => {
            books = await Promise.all([
                Book.create({
                    title: 'The Midnight Library',
                    author: 'Matt Haig',
                    genre: 'Contemporary Fiction',
                    ISBN: '978-0-525-55948-1'
                }),
                Book.create({
                    title: 'The Stone Chamber',
                    author: 'Kate Ellis',
                    genre: 'Crime and Mistery',
                    ISBN: '978-0-349-42571-9'
                }),
                Book.create({
                    title: 'What I Talk About When I Talk About Running',
                    author: 'Haruki Murakami',
                    genre: 'Memoir',
                    ISBN: '0-307-26919-1'
                })
            ]);
        });

        describe('GET /books', () => {
            it('gets all book records', async () => {
                const response = await request(app).get('/books');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((book) => {
                    const expected = books.find((a) => a.id === book.id);

                    expect(book.title).to.equal(expected.title);
                    expect(book.author).to.equal(expected.author);
                    expect(book.genre).to.equal(expected.genre);
                    expect(book.ISBN).to.equal(expected.ISBN);
                });
            });
        });

    })
});