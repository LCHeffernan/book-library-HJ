module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "title is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "title cannot be empty"
                },
            },
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "author is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "author cannot be empty"
                },
            },
        },
        genre: DataTypes.STRING,
        ISBN: DataTypes.STRING,
    };

    const BookModel = connection.define('Book', schema);
    return BookModel;
};