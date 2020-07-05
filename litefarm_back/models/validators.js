function validateSchema(schema) {
    return (req, res, next) => {
        const data = req.body;
        const passingValidation = Object.keys(schema).every((key) => {
            return schema[key].validate(data[key]);
        })
        passingValidation ? next() : badRequestResponse(res);
    }
}

function badRequestResponse(res){
    res.status(400).json({
        message: 'Bad Request',
        status: 400
    })
}

class Validator {
    _validations = [];
    isRequired = false;

    number() {
        this._validations.push((property) =>  !isNaN(property) || this._isNotRequiredAndNotDefined(property));
        return this;
    }

    string() {
        this._validations.push((property) => {
            return (typeof property === 'string' && property.length > 0 ) || this._isNotRequiredAndNotDefined(property);
        })
        return this;
    }

    numberArray() {
        this._validations.push((property) => property instanceof Array && property.every((value) => !isNaN(value)))
        return this;
    }

    required() {
        this.isRequired = true;
        this._validations.push(this._isDefined)
        return this;
    }

    validate(property) {
        return this._validations.reduce((currentStatus, validator) => 
             currentStatus && validator(property)
        , true)
    }
    
    _isNotRequiredAndNotDefined(property) {
        return !this.isRequired && !this._isDefined(property)
    }

    _isDefined(property) {
        return property !== null && typeof property !== 'undefined';
    }
}


module.exports = {
    Validator, 
    validateSchema
}