const assert =  require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Burada web3 constructordur bu yüzden baş harfi büyük şekilde yazdık
const web3 = new Web3(ganache.provider());
const {interface,bytecode} = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    // Büyün hesapların Listesini Getirir
    /*
    web3.eth.getAccounts()
        .then(fetchedAccounts => {
            console.log(fetchedAccounts);
        });
    */

    accounts = await web3.eth.getAccounts();

    //Contract Deploy etmek için bunlardan birini kullanır

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data : bytecode,arguments: ['Hello Chain!']})
        .send({from: accounts[0],gas:'1000000'});
});


describe('Inbox',() => {
    it('deploys a contract',() => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message,'Hello Chain!'); 
    });
    
    it('can change the message',async () => {
       await inbox.methods.setMessage('Bye Chain!').send({from:accounts[0]});
       const message = await inbox.methods.message().call();
       assert.equal(message,'Bye Chain!');
    });
});

/*
class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;

beforeEach(() => {
    car = new Car();
});

describe('Car Class',() => {
    it('has a park function',() => {
        assert.equal(car.park(),'stopped');
    });

    it('has a drive function',() => {
        assert.equal(car.drive(),'vroom');
    });
});
*/