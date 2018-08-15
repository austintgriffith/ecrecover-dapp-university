const fs = require('fs');
module.exports = {
  'openzeppelin-solidity/contracts/ECRecovery.sol': fs.readFileSync('openzeppelin-solidity/contracts/ECRecovery.sol', 'utf8')
}
