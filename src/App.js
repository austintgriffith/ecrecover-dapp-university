import React, { Component } from 'react';
import './App.css';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler, Blockie, Address, Button } from "dapparatus"
import Web3 from 'web3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 4,
      doingTransaction: false,
      message:"",
      sig:"",
      hash:"",
      sig:"",
      events:[]
    }
  }
  handleInput(e){
    let update = {}
    update[e.target.name] = e.target.value
    if(e.target.name=="message"){
      update["hash"] = this.state.web3.utils.keccak256(e.target.value)
      update['sig'] = ""
    }
    this.setState(update)
  }
  render() {
    let {web3,account,contracts,tx,gwei,block,avgBlockTime,etherscan,events} = this.state
    let connectedDisplay = []
    let contractsDisplay = []
    if(web3){
      connectedDisplay.push(
       <Gas
         key="Gas"
         onUpdate={(state)=>{
           console.log("Gas price update:",state)
           this.setState(state,()=>{
             console.log("GWEI set:",this.state)
           })
         }}
       />
      )
      connectedDisplay.push(
        <ContractLoader
         key="ContractLoader"
         config={{DEBUG:true}}
         web3={web3}
         require={path => {return require(`${__dirname}/${path}`)}}
         onReady={(contracts,customLoader)=>{
           console.log("contracts loaded",contracts)
           this.setState({contracts:contracts},async ()=>{
             if(this.state.address){
               console.log("Loading dyamic contract "+this.state.address)
               let dynamicContract = customLoader("BouncerProxy",this.state.address)//new this.state.web3.eth.Contract(require("./contracts/BouncerProxy.abi.js"),this.state.address)
               let owner = await dynamicContract.owner().call()
               this.setState({contract:dynamicContract,owner:owner})
             }
           })
         }}
        />
      )
      connectedDisplay.push(
        <Transactions
          key="Transactions"
          config={{DEBUG:false}}
          account={account}
          gwei={gwei}
          web3={web3}
          block={block}
          avgBlockTime={avgBlockTime}
          etherscan={etherscan}
          onReady={(state)=>{
            console.log("Transactions component is ready:",state)
            this.setState(state)
          }}
          onReceipt={(transaction,receipt)=>{
            // this is one way to get the deployed contract address, but instead I'll switch
            //  to a more straight forward callback system above
            console.log("Transaction Receipt",transaction,receipt)
          }}
        />
      )

      if(contracts){
        contractsDisplay.push(
          <div key="UI" style={{padding:30}}>
            <div>
              <Address
                {...this.state}
                address={contracts.Recover._address}
              />
            </div>

            <div>
              <Address
                {...this.state}
                address={this.state.account}
              />
            </div>

            <div>
            string: <input
                style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="message" value={this.state.message} onChange={this.handleInput.bind(this)}
            />
            </div>
            <div>
              hash: <input
                  style={{verticalAlign:"middle",width:500,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="hash" value={this.state.hash} onChange={this.handleInput.bind(this)}
              />
            </div>
            <Button size="2" onClick={async ()=>{
                let sig = await this.state.web3.eth.personal.sign(""+this.state.hash,account)
                this.setState({sig:sig})
              }}>
              Sign
            </Button>
            <div>
              sig: <input
                  style={{verticalAlign:"middle",width:1000,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="sig" value={this.state.sig} onChange={this.handleInput.bind(this)}
              />
            </div>
            <Button color={this.state.doingTransaction?"orange":"green"} size="2" onClick={async ()=>{
                this.setState({doingTransaction:true})
                console.log(contracts.Recover)
                tx(contracts.Recover.message(this.state.message,this.state.sig),(receipt)=>{
                  this.setState({doingTransaction:false})
                })
              }}>
              Send
            </Button>
            <Events
              config={{hide:true}}
              contract={contracts.Recover}
              eventName={"Message"}
              block={block}
              onUpdate={(eventData,allEvents)=>{
                console.log("EVENT DATA:",eventData)
                this.setState({events:allEvents})
              }}
            />
          </div>
        )
      }
    }

    let messages = []
    for(let e in events){
      messages.push(
        <div key={"msg"+e} style={{padding:30}}>
        <Address
          {...this.state}
          address={events[e].signer}
        /> {events[e].message}
        </div>
      )
    }
    return (
      <div className="App">
        <Metamask
          config={{requiredNetwork:['Unknown','Rinkeby']}}
          onUpdate={(state)=>{
           console.log("metamask state update:",state)
           if(state.web3Provider) {
             state.web3 = new Web3(state.web3Provider)
             this.setState(state)
           }
          }}
        />
        {connectedDisplay}
        {contractsDisplay}
        {messages}
      </div>
    );
  }
}

export default App;
