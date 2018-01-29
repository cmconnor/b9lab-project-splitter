var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {
  var contract;
  var randomAddress=accounts[0];
  var aliceAddress=accounts[1];
  var bobAddress=accounts[2];
  var carolAddress=accounts[3];

  beforeEach(function(){
    return Splitter.new(aliceAddress,bobAddress,carolAddress,{from:randomAddress,value:1000})
    .then(function(instance){
      contract=instance;
    });
  });
  it("Alice, Bob and Carol should have correct addresses", function() {
    return contract.getAddressAlice.call({from:randomAddress})
    .then(function(_addrAlice){
      console.log("Alice's address:");
      console.log(_addrAlice);
      console.log(aliceAddress);
      assert.equal(_addrAlice,aliceAddress,"Alice's address is incorrectly defined");
      return contract.getAddressBob.call({from:randomAddress})
    })
    .then(function(_addrBob){
      console.log("Bob's address:");
      console.log(_addrBob);
      console.log(bobAddress);
      assert.equal(_addrBob,bobAddress,"Bob's address is incorrectly defined");
      return contract.getAddressCarol.call({from:randomAddress})
    })
    .then(function(_addrCarol){
      console.log("Carol's address:");
      console.log(_addrCarol);
      console.log(carolAddress);
      assert.equal(_addrCarol,carolAddress,"Carol's address is incorrectly defined");
    });
  });
 
  it("contract gets the correct balances", function(){
    return contract.getBalanceAlice.call({from:randomAddress})
    .then(function(_balAlice){
      console.log("Alice's balance");
      console.log(_balAlice.toString(10));
      assert.equal(_balAlice.toString(10),"100000000000000000000","alice's balance is off");
      return contract.getBalanceBob.call({from:randomAddress})
    })
    .then(function(_balBob){
      console.log("Bob's  balance");
      console.log(_balBob.toString(10));
      assert.equal(_balBob.toString(10),"100000000000000000000","bob's balance is off");
      return contract.getBalanceCarol.call({from:randomAddress})
    })
    .then(function(_balCarol){
      console.log("Carol's balance");
      console.log(_balCarol.toString(10));
      assert.equal(_balCarol.toString(10),"100000000000000000000","carol's balance is off");
      return contract.getBalanceContract.call({from:randomAddress})
    })
    .then(function(_balContract){
      console.log("Contract's balance");
      console.log(_balContract.toString(10));
      assert.equal(_balContract.toString(10),"1000");
    });
  });


  it("Splitter functions when value is sent by Alice",function(){
    var splitValue=1000001;
    var aliceValue;
    var bobValue;
    var carolValue;

    return contract.sendTransaction({from:aliceAddress,value:splitValue})
    .then(function(_tx){
      return contract.getBalanceAlice({from:randomAddress})
    })
    .then(function(_balAlice){
      aliceValue=_balAlice;
      console.log("alice's balance");
      console.log(aliceValue);
      return contract.getBalanceBob({from:randomAddress})
    })
    .then(function(_balBob){
      bobValue=_balBob;
      console.log("bob's balance");
      console.log(bobValue);
      return contract.getBalanceCarol({from:randomAddress})
    })
    .then(function(_balCarol){
      carolValue=_balCarol;
      console.log("carol's balance");
      console.log(carolValue);
      var diff=bobValue.minus(carolValue).abs();
      console.log("difference:");
      console.log(diff);
      var lEqOne=diff.lte(1);	
      console.log(lEqOne);
      assert.ok(lEqOne,"More than 1 Wei difference between Bob and Carol's address");   
    });
  });

  it("Splitter halts when value is sent by someone other then Alice",function(){
    var splitValue=1000001;
    var aliceValue;
    var bobValue;
    var carolValue;

    return contract.getBalanceAlice({from:randomAddress})
    .then(function(_balAlice){
      aliceValue=_balAlice;
      return contract.getBalanceCarol({from:randomAddress})
    })
    .then(function(_balCarol){
      carolValue=_balCarol;
      return contract.sendTransaction({from:bobAddress,value:splitValue})
    })
    .catch(function(err){
      console.log(err);
    })
    .then(function(_tx){
      return contract.getBalanceAlice({from:randomAddress})
    })
    .then(function(_balAlice){
      assert.equal(_balAlice.toString(10),aliceValue.toString(10),"Alice's balance changed incorrectly");
      return contract.getBalanceCarol({from:randomAddress})
    })
    .then(function(_balCarol){
      assert.equal(_balCarol.toString(10),carolValue.toString(10),"Carol's balance changed incorrectly");
    })
  });
});
