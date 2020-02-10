export default () => ({
    type: 'string',
    validators: [
        {type: 'minLength', config: {max: 8}},
        {type: 'maxLength', config: {max: 64}},
        {type: 'match', config: {pattern: '[A-Z]+', message: 'At least one upper case letter is required'}},
        {type: 'match', config: {pattern: '[a-z]+', message: 'At least one lower case letter is required'}},
        {type: 'match', config: {pattern: '[0-9]+', message: 'At least one digit is required'}},
        {type: 'match', config: {pattern: '[\!\:\$\@\&\%\(\)\[\];,\/]+', message: 'At least special character is required'}},
    ],
    transform: {type: 'password', config: {rounds: 10}}
})