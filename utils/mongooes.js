module.exports = {
    mutipleMongooesToObject: (mongooes) => {
        return mongooes.map(mongooes => mongooes.toObject());
    },
    mongooesToObject: (mongooes) => {
        return mongooes ? mongooes.toObject() : mongooes;
    }
}