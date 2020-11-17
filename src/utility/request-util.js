function ensureCertainFields(query,keys) {
    for( key of keys) {
        if(!(key in query)) {
            let err = new Error("Required '" + key +"' attribute not present in query");
            throw err;
        }
    }
}

module.exports = {
    ensureCertainFields : ensureCertainFields
}