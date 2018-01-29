pragma solidity ^0.4.4;

import "./ConvertLib.sol";


contract Splitter {
	address addressAlice;
	address addressBob;
	address addressCarol;

	event LogRecievedPayment(address indexed _from, uint256 _value);
	event LogSplitPaymentSent(address indexed _from, address indexed _to1, uint256 _value1, address indexed _to2, uint256 _value2);

	function Splitter(address alice, address bob, address carol) public payable{
		addressAlice=alice;
		addressBob=bob;
		addressCarol=carol;
	}

        function getAddressAlice() public constant returns (address){
		return addressAlice;
	}
	function getAddressBob()public constant returns (address){
		return addressBob;
	}
	function getAddressCarol() public constant returns (address){
		return addressCarol;	
	} 

	function getBalanceAlice() public constant returns(uint256){
		return addressAlice.balance;
	}
	function getBalanceBob() public constant returns(uint256){
		return addressBob.balance;
	}
	function getBalanceCarol() public constant returns(uint256){
		return addressCarol.balance;
	}
	function getBalanceContract() public constant returns(uint256){
		return this.balance;
	}

	function() public payable{
		LogRecievedPayment(msg.sender,msg.value);
		require(msg.sender==addressAlice);
		require(msg.value>0);
		uint256 firstSplit; //defining the two output address values individually to handle case when msg amount doesn't divide by 2 evenly.
		uint256 secondSplit;
		firstSplit=msg.value/2;
		secondSplit=msg.value-firstSplit;
		addressBob.transfer(firstSplit);
		addressCarol.transfer(secondSplit);
		LogSplitPaymentSent(msg.sender,addressBob,firstSplit, addressCarol, secondSplit);
	}

}
